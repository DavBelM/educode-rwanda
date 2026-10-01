import { useState, useCallback } from 'react';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';
import { supabase } from '../lib/supabase';
import { runQuizTests, type TestCase } from '../lib/quiz-executor';
import { Plus, Trash2, Play, Check, AlertCircle, Save, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  language: 'EN' | 'KIN';
}

interface TestCaseForm {
  id: string;
  assertion: string;
  description: string;
  description_kin: string;
}

interface SetOption { id: string; title: string; rqf_level: number | null; }

const emptyTest = (): TestCaseForm => ({
  id: crypto.randomUUID(),
  assertion: '',
  description: '',
  description_kin: '',
});

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'] as const;
const CHALLENGE_TYPE_OPTIONS = ['fix_bug', 'complete_code', 'write_from_scratch'] as const;

export default function ChallengeBuilderPage({ language }: Props) {
  usePageTitle('Challenge Builder · EduCode Rwanda');
  const isKin = language === 'KIN';

  // Form state
  const [title, setTitle] = useState('');
  const [titleKin, setTitleKin] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKin, setDescriptionKin] = useState('');
  const [starterCode, setStarterCode] = useState('// Write your solution here\n');
  const [solutionCode, setSolutionCode] = useState('');
  const [tests, setTests] = useState<TestCaseForm[]>([emptyTest()]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [challengeType, setChallengeType] = useState<'fix_bug' | 'complete_code' | 'write_from_scratch'>('write_from_scratch');
  const [xpReward, setXpReward] = useState(10);
  const [setId, setSetId] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [sets, setSets] = useState<SetOption[]>([]);
  const [setsLoaded, setSetsLoaded] = useState(false);
  const [hint, setHint] = useState('');
  const [hintKin, setHintKin] = useState('');

  // Preview state
  const [previewCode, setPreviewCode] = useState('');
  const [previewRunning, setPreviewRunning] = useState(false);
  const [previewResults, setPreviewResults] = useState<{ passed: boolean; description: string; error?: string }[] | null>(null);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [expandedSection, setExpandedSection] = useState<string | null>('basic');

  const loadSets = useCallback(async () => {
    if (setsLoaded) return;
    const { data } = await supabase.from('quiz_sets').select('id, title, rqf_level').order('rqf_level').order('order_index');
    setSets((data as SetOption[]) ?? []);
    setSetsLoaded(true);
  }, [setsLoaded]);

  const addTest = () => setTests(t => [...t, emptyTest()]);
  const removeTest = (id: string) => setTests(t => t.filter(tc => tc.id !== id));
  const updateTest = (id: string, field: keyof TestCaseForm, value: string) =>
    setTests(t => t.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));

  const runPreview = async () => {
    const validTests: TestCase[] = tests
      .filter(t => t.assertion.trim())
      .map(t => ({ assertion: t.assertion, description: t.description || t.assertion }));
    if (validTests.length === 0 || !previewCode.trim()) return;
    setPreviewRunning(true);
    try {
      const result = await runQuizTests(previewCode, '', validTests);
      setPreviewResults(result.results);
    } catch {
      setPreviewResults([{ passed: false, description: 'Execution error', error: 'Runner failed' }]);
    } finally {
      setPreviewRunning(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) { setSaveError('Challenge title is required.'); return; }
    if (!setId) { setSaveError('Select a quiz set.'); return; }
    const validTests = tests.filter(t => t.assertion.trim() && t.description.trim());
    if (validTests.length === 0) { setSaveError('Add at least one test case with assertion and description.'); return; }

    setSaving(true);
    setSaveError('');

    const testCasesJson = validTests.map(t => ({
      assertion: t.assertion.trim(),
      description: t.description.trim(),
      description_kin: t.description_kin.trim() || null,
    }));

    const { error: chErr } = await supabase.from('quiz_challenges').insert({
      set_id: setId,
      title: title.trim(),
      title_kin: titleKin.trim() || null,
      description: description.trim(),
      description_kin: descriptionKin.trim() || null,
      starter_js: starterCode,
      starter_html: '',
      test_cases: testCasesJson,
      difficulty,
      challenge_type: challengeType,
      xp_reward: xpReward,
      order_index: orderIndex,
      hint: hint.trim() || null,
      hint_kin: hintKin.trim() || null,
      is_visible: false, // start hidden until reviewed
    });

    if (chErr) {
      setSaveError(chErr.message ?? 'Failed to save challenge');
      setSaving(false);
      return;
    }

    setSaveSuccess(true);
    setSaving(false);
    // Reset form
    setTimeout(() => {
      setTitle(''); setTitleKin(''); setDescription(''); setDescriptionKin('');
      setStarterCode('// Write your solution here\n'); setSolutionCode('');
      setTests([emptyTest()]); setHint(''); setHintKin('');
      setPreviewResults(null); setPreviewCode('');
      setSaveSuccess(false);
    }, 3000);
  };

  const SectionHeader = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => setExpandedSection(s => s === id ? null : id)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
        padding: '12px 16px', background: 'var(--surface-2)', border: '1px solid var(--line)',
        borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'var(--text)',
      }}
    >
      {label}
      {expandedSection === id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 8, fontSize: 13,
    border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)',
    fontFamily: 'inherit', boxSizing: 'border-box',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    fontFamily: 'ui-monospace, monospace', resize: 'vertical', lineHeight: 1.6,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <AppNav />
      <div className="wrap page">

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', marginBottom: 6 }}>
            {isKin ? 'Ongera Challenge Nshya' : 'Challenge Builder'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
            {isKin
              ? 'Rema challenge nshya igiye gukomeza urukurikirane rw\'amashuri. Izagaragarirwa nyuma yo kugenzurwa.'
              : 'Create a new challenge for the RTB curriculum. It stays hidden until reviewed and published.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Basic info */}
          <div>
            <SectionHeader id="basic" label={isKin ? '1. Amakuru Rusange' : '1. Basic Info'} />
            {expandedSection === 'basic' && (
              <div className="card pad-lg" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Title (English) *</label>
                    <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Write a function that adds two numbers" />
                  </div>
                  <div>
                    <label style={labelStyle}>Umutwe (Kinyarwanda)</label>
                    <input style={inputStyle} value={titleKin} onChange={e => setTitleKin(e.target.value)} placeholder="e.g. Andika function yo guteranya inomero ebyiri" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Description (English)</label>
                    <textarea style={{ ...textareaStyle, fontFamily: 'inherit' }} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Instructions for the student..." />
                  </div>
                  <div>
                    <label style={labelStyle}>Ibisobanuro (Kinyarwanda)</label>
                    <textarea style={{ ...textareaStyle, fontFamily: 'inherit' }} rows={3} value={descriptionKin} onChange={e => setDescriptionKin(e.target.value)} placeholder="Amabwiriza y'umunyeshuri..." />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Quiz Set *</label>
                    <select
                      style={inputStyle}
                      value={setId}
                      onFocus={loadSets}
                      onChange={e => setSetId(e.target.value)}
                    >
                      <option value="">— Select set —</option>
                      {sets.map(s => <option key={s.id} value={s.id}>[L{s.rqf_level}] {s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Order Index</label>
                    <input type="number" style={inputStyle} value={orderIndex} min={1} onChange={e => setOrderIndex(Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Difficulty</label>
                    <select style={inputStyle} value={difficulty} onChange={e => setDifficulty(e.target.value as typeof difficulty)}>
                      {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Type</label>
                    <select style={inputStyle} value={challengeType} onChange={e => setChallengeType(e.target.value as typeof challengeType)}>
                      {CHALLENGE_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>XP Reward</label>
                    <input type="number" style={inputStyle} value={xpReward} min={1} max={100} onChange={e => setXpReward(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Starter code */}
          <div>
            <SectionHeader id="code" label={isKin ? '2. Kode ya Tangira' : '2. Starter Code'} />
            {expandedSection === 'code' && (
              <div className="card pad-lg" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none' }}>
                <label style={labelStyle}>JavaScript starter code shown to students</label>
                <textarea style={{ ...textareaStyle, minHeight: 140 }} value={starterCode} onChange={e => setStarterCode(e.target.value)} />
                <label style={{ ...labelStyle, marginTop: 14 }}>Reference solution (not shown to students — optional)</label>
                <textarea style={{ ...textareaStyle, minHeight: 100 }} value={solutionCode} onChange={e => setSolutionCode(e.target.value)} placeholder="// Optional: reference solution for internal use" />
              </div>
            )}
          </div>

          {/* Tests */}
          <div>
            <SectionHeader id="tests" label={isKin ? '3. Ikizamini (Test Cases)' : '3. Test Cases'} />
            {expandedSection === 'tests' && (
              <div className="card pad-lg" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tests.map((tc, i) => (
                  <div key={tc.id} style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)' }}>Test {i + 1}</p>
                      {tests.length > 1 && (
                        <button onClick={() => removeTest(tc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div>
                        <label style={labelStyle}>Assertion (JavaScript expression that returns true)</label>
                        <input
                          style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}
                          value={tc.assertion}
                          onChange={e => updateTest(tc.id, 'assertion', e.target.value)}
                          placeholder="add(2, 3) === 5"
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <label style={labelStyle}>Description (EN)</label>
                          <input style={inputStyle} value={tc.description} onChange={e => updateTest(tc.id, 'description', e.target.value)} placeholder="add(2, 3) should return 5" />
                        </div>
                        <div>
                          <label style={labelStyle}>Ibisobanuro (KIN)</label>
                          <input style={inputStyle} value={tc.description_kin} onChange={e => updateTest(tc.id, 'description_kin', e.target.value)} placeholder="add(2, 3) igomba gusubiza 5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addTest}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: '1.5px dashed var(--line)', background: 'var(--surface-2)', color: 'var(--text-2)',
                  }}
                >
                  <Plus size={13} /> Add test case
                </button>
              </div>
            )}
          </div>

          {/* Live preview */}
          <div>
            <SectionHeader id="preview" label={isKin ? '4. Gerageza Tests (Preview)' : '4. Live Test Preview'} />
            {expandedSection === 'preview' && (
              <div className="card pad-lg" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Test your solution code against the assertions above</label>
                  <textarea
                    style={{ ...textareaStyle, minHeight: 100 }}
                    value={previewCode}
                    onChange={e => setPreviewCode(e.target.value)}
                    placeholder="// Paste a solution here to test it..."
                  />
                </div>
                <button
                  onClick={runPreview}
                  disabled={previewRunning}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: 'var(--text)', color: 'var(--bg)', border: 'none', alignSelf: 'flex-start',
                  }}
                >
                  <Play size={13} /> {previewRunning ? 'Running…' : 'Run tests'}
                </button>
                {previewResults && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {previewResults.map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        borderRadius: 6, background: r.passed ? '#9eaa8415' : '#ef444415',
                        border: `1px solid ${r.passed ? '#9eaa8440' : '#ef444440'}`,
                      }}>
                        {r.passed
                          ? <Check size={13} style={{ color: '#9eaa84', flexShrink: 0 }} />
                          : <AlertCircle size={13} style={{ color: '#ef4444', flexShrink: 0 }} />}
                        <p style={{ fontSize: 12.5, color: 'var(--text)' }}>{r.description}</p>
                        {r.error && <p style={{ fontSize: 11, color: '#ef4444', marginLeft: 'auto' }}>{r.error}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hints */}
          <div>
            <SectionHeader id="hints" label={isKin ? '5. Inama (Hint)' : '5. Hint'} />
            {expandedSection === 'hints' && (
              <div className="card pad-lg" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Hint (English)</label>
                  <textarea style={{ ...textareaStyle, fontFamily: 'inherit', minHeight: 80 }} value={hint} onChange={e => setHint(e.target.value)} placeholder="Think about the return statement..." />
                </div>
                <div>
                  <label style={labelStyle}>Inama (Kinyarwanda)</label>
                  <textarea style={{ ...textareaStyle, fontFamily: 'inherit', minHeight: 80 }} value={hintKin} onChange={e => setHintKin(e.target.value)} placeholder="Tekereza ku kugaburira inyishu..." />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Save bar */}
        <div style={{
          position: 'sticky', bottom: 0, background: 'var(--bg)', borderTop: '1px solid var(--line)',
          padding: '14px 0', marginTop: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {saveError && (
            <p style={{ fontSize: 12, color: 'var(--error)', flex: 1 }}>{saveError}</p>
          )}
          {saveSuccess && (
            <p style={{ fontSize: 12, color: '#9eaa84', flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={13} /> Challenge saved! It will be visible after review.
            </p>
          )}
          {!saveError && !saveSuccess && <div style={{ flex: 1 }} />}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: 'var(--text)', color: 'var(--bg)', border: 'none',
            }}
          >
            <Save size={14} /> {saving ? 'Saving…' : isKin ? 'Bika Challenge' : 'Save Challenge'}
          </button>
        </div>

      </div>
    </div>
  );
}
