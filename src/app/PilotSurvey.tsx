import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { submitPilotSurvey } from '../lib/db';

interface Props {
  language: 'EN' | 'KIN';
  onDone: () => void;
}

interface Answers {
  overall_rating: number | null;
  helped_learning: number | null;
  mwarimu_helpfulness: string | null;
  language_preference: string | null;
  ease_of_use: number | null;
  liked_most: string;
  would_change: string;
}

const TOTAL_STEPS = 6; // 0–5 are questions, done screen shown after submit

export default function PilotSurvey({ language, onDone }: Props) {
  const isKin = language === 'KIN';
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    overall_rating: null,
    helped_learning: null,
    mwarimu_helpfulness: null,
    language_preference: null,
    ease_of_use: null,
    liked_most: '',
    would_change: '',
  });

  const progress = ((step) / TOTAL_STEPS) * 100;

  const goNext = () => { setDir('fwd'); setStep(s => s + 1); };
  const goBack = () => { setDir('bwd'); setStep(s => s - 1); };

  const canAdvance = () => {
    if (step === 0) return answers.overall_rating !== null;
    if (step === 1) return answers.helped_learning !== null;
    if (step === 2) return answers.mwarimu_helpfulness !== null;
    if (step === 3) return answers.language_preference !== null;
    if (step === 4) return answers.ease_of_use !== null;
    if (step === 5) return true; // open text is optional
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitPilotSurvey(answers);
    setSubmitting(false);
    setDone(true);
  };

  const slideAnim = `${dir === 'fwd' ? 'survey-slide-right' : 'survey-slide-left'} 0.26s ease both`;

  // ── Scale (1–5) ────────────────────────────────────────────────────────────
  const ScaleStep = ({
    field, value, labelLow, labelHigh, labelLowKin, labelHighKin,
  }: {
    field: keyof Answers;
    value: number | null;
    labelLow: string; labelHigh: string;
    labelLowKin: string; labelHighKin: string;
  }) => (
    <div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
        {([1, 2, 3, 4, 5] as const).map(n => (
          <button
            key={n}
            onClick={() => setAnswers(a => ({ ...a, [field]: n }))}
            style={{
              width: 52, height: 52, borderRadius: 12, fontSize: 17, fontWeight: 600,
              cursor: 'pointer', transition: 'all .15s',
              background: value === n ? 'var(--text)' : 'var(--surface)',
              color: value === n ? 'var(--bg)' : 'var(--text-2)',
              border: value === n ? '2px solid var(--text)' : '1.5px solid var(--line)',
              transform: value === n ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', padding: '0 4px' }}>
        <span>{isKin ? labelLowKin : labelLow}</span>
        <span>{isKin ? labelHighKin : labelHigh}</span>
      </div>
    </div>
  );

  // ── Choice (cards) ─────────────────────────────────────────────────────────
  const ChoiceStep = ({
    field, value, options,
  }: {
    field: keyof Answers;
    value: string | null;
    options: { label: string; labelKin: string; val: string }[];
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => (
        <button
          key={opt.val}
          onClick={() => setAnswers(a => ({ ...a, [field]: opt.val }))}
          style={{
            padding: '13px 16px', borderRadius: 10, textAlign: 'left',
            fontSize: 14, fontWeight: value === opt.val ? 600 : 400,
            cursor: 'pointer', transition: 'all .15s',
            background: value === opt.val ? 'var(--text)' : 'var(--surface)',
            color: value === opt.val ? 'var(--bg)' : 'var(--text-2)',
            border: value === opt.val ? '2px solid var(--text)' : '1.5px solid var(--line)',
            transform: value === opt.val ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          {isKin ? opt.labelKin : opt.label}
        </button>
      ))}
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
        <div className="card w-full text-center" style={{ maxWidth: 420, padding: '48px 32px', animation: 'ethics-card-in 0.35s ease both' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={26} style={{ color: 'var(--text)' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
            {isKin ? 'Murakoze cyane!' : 'Thank you!'}
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 28 }}>
            {isKin
              ? 'Ibisubizo byawe bizafasha guteza imbere EduCode Rwanda. Urakoze kwiga natwe!'
              : 'Your feedback will help improve EduCode Rwanda for future students. Thank you for being part of this pilot!'}
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onDone}>
            {isKin ? 'Garuka ku dashboard' : 'Back to dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', animation: 'ethics-bg-in 0.3s ease both' }}>
      <div className="card w-full overflow-hidden" style={{ maxWidth: 480, padding: 0, animation: 'ethics-card-in 0.35s cubic-bezier(0.22,0.61,0.36,1) both' }}>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--surface-2)' }}>
          <div style={{ height: '100%', background: 'var(--text)', width: `${progress}%`, transition: 'width 0.35s ease' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>
            {isKin ? `Ibibazo ${step + 1} / ${TOTAL_STEPS}` : `Question ${step + 1} of ${TOTAL_STEPS}`}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {isKin ? 'Ubushakashatsi bw\'umunyeshuri' : 'Student pilot survey'}
          </span>
        </div>

        {/* Step content */}
        <div key={step} style={{ padding: '28px 28px 24px', animation: slideAnim }}>

          {step === 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                {isKin ? 'Icyerekezo rusange' : 'Overall experience'}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 24 }}>
                {isKin
                  ? 'Mwasanze gukoresha EduCode Rwanda bimeze bite muri rusange?'
                  : 'How was your overall experience using EduCode Rwanda?'}
              </h3>
              <ScaleStep
                field="overall_rating" value={answers.overall_rating}
                labelLow="Very poor" labelHigh="Excellent"
                labelLowKin="Bibi cyane" labelHighKin="Byiza cyane"
              />
            </>
          )}

          {step === 1 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                {isKin ? 'Kwiga' : 'Learning'}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 24 }}>
                {isKin
                  ? '"EduCode yangufashije gusobanukirwa JavaScript neza."'
                  : '"EduCode helped me understand JavaScript better."'}
              </h3>
              <ScaleStep
                field="helped_learning" value={answers.helped_learning}
                labelLow="Strongly agree" labelHigh="Strongly disagree"
                labelLowKin="Nemera cyane" labelHighKin="Ntabwo nemera"
              />
            </>
          )}

          {step === 2 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                {isKin ? 'Mwarimu AI' : 'AI tutor'}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 24 }}>
                {isKin
                  ? 'Mwarimu (AI) yakugufashije neza iyo ubaga uhagaritswe na code?'
                  : 'Was Mwarimu (the AI tutor) helpful when you were stuck on code?'}
              </h3>
              <ChoiceStep
                field="mwarimu_helpfulness" value={answers.mwarimu_helpfulness}
                options={[
                  { val: 'very_helpful',     label: 'Very helpful',      labelKin: 'Yangufashije cyane' },
                  { val: 'somewhat_helpful', label: 'Somewhat helpful',  labelKin: 'Yangufashije gato' },
                  { val: 'not_helpful',      label: 'Not helpful',       labelKin: 'Ntiyangufashije' },
                  { val: 'didnt_use',        label: "I didn't use it",   labelKin: 'Sinayikoreshe' },
                ]}
              />
            </>
          )}

          {step === 3 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                {isKin ? 'Ururimi' : 'Language'}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 24 }}>
                {isKin
                  ? 'Ni ururimi uruhe watoraga gukoresha kuri EduCode?'
                  : 'Which language did you prefer to use on EduCode?'}
              </h3>
              <ChoiceStep
                field="language_preference" value={answers.language_preference}
                options={[
                  { val: 'english',     label: 'English',         labelKin: 'Icyongereza' },
                  { val: 'kinyarwanda', label: 'Kinyarwanda',     labelKin: 'Ikinyarwanda' },
                  { val: 'both',        label: 'Both equally',    labelKin: 'Indimi zombi' },
                ]}
              />
            </>
          )}

          {step === 4 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                {isKin ? 'Ukoreshwa' : 'Ease of use'}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 24 }}>
                {isKin
                  ? 'Gukoresha EduCode no kuyimanahana byari byoroshye bite?'
                  : 'How easy was EduCode to navigate and use?'}
              </h3>
              <ScaleStep
                field="ease_of_use" value={answers.ease_of_use}
                labelLow="Very easy" labelHigh="Very hard"
                labelLowKin="Byoroshye cyane" labelHighKin="Bigoye cyane"
              />
            </>
          )}

          {step === 5 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                {isKin ? 'Ibitekerezo byawe' : 'Your thoughts'}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 6 }}>
                {isKin ? 'Ibibazo bya nyuma — dushaka gutekereza nkawe.' : 'Last question — in your own words.'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
                {isKin ? '(Ntabwo ari ngombwa, ariko bizatufasha cyane)' : '(Optional, but incredibly helpful)'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
                    {isKin ? 'Ni iki cyakwagufashije cyane kuri EduCode?' : 'What did you like most about EduCode?'}
                  </label>
                  <textarea
                    value={answers.liked_most}
                    onChange={e => setAnswers(a => ({ ...a, liked_most: e.target.value }))}
                    rows={3}
                    className="input"
                    style={{ resize: 'none', fontSize: 13.5, lineHeight: 1.5, width: '100%' }}
                    placeholder={isKin ? 'Andika hano...' : 'Type here...'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
                    {isKin ? 'Ni iki wahindura cyangwa kongeraho?' : 'What would you change or improve?'}
                  </label>
                  <textarea
                    value={answers.would_change}
                    onChange={e => setAnswers(a => ({ ...a, would_change: e.target.value }))}
                    rows={3}
                    className="input"
                    style={{ resize: 'none', fontSize: 13.5, lineHeight: 1.5, width: '100%' }}
                    placeholder={isKin ? 'Andika hano...' : 'Type here...'}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div style={{ padding: '0 28px 28px', display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={goBack} className="btn btn-secondary" style={{ flexShrink: 0 }}>
              <ArrowLeft size={15} />
            </button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={goNext}
              disabled={!canAdvance()}
              className="btn btn-primary"
              style={{ flex: 1, opacity: canAdvance() ? 1 : 0.38, transition: 'opacity 0.2s' }}
            >
              {isKin ? 'Komeza' : 'Next'} <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary"
              style={{ flex: 1, opacity: submitting ? 0.6 : 1 }}
            >
              {submitting
                ? (isKin ? 'Birimo...' : 'Submitting...')
                : <>{isKin ? 'Ohereza ibisubizo' : 'Submit feedback'} <CheckCircle size={15} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
