import { useState } from 'react';
import { submitRating } from '../../lib/quiz-db';

interface RatingModalProps {
  contentType: 'lesson' | 'challenge';
  contentId: string;
  usedMwarimu: boolean;
  language: 'EN' | 'KIN';
  onDone: () => void;
}

const LABELS_EN = ['Very easy', 'Easy', 'Just right', 'Hard', 'Very hard'];
const LABELS_KIN = ['Byoroshye cyane', 'Byoroshye', 'Bihuje', 'Bigoye', 'Bigoye cyane'];

export function RatingModal({ contentType, contentId, usedMwarimu, language, onDone }: RatingModalProps) {
  const isKin = language === 'KIN';
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [mwarimuHelped, setMwarimuHelped] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = difficulty !== null && (!usedMwarimu || mwarimuHelped !== null);

  const handleSubmit = async () => {
    if (!difficulty) return;
    setSubmitting(true);
    await submitRating({
      contentType,
      contentId,
      difficulty,
      mwarimuHelped,
      usedMwarimu,
      language,
    });
    onDone();
  };

  const isChallenge = contentType === 'challenge';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
    }}>
      <div className="card pad-lg" style={{ width: '100%', maxWidth: 360 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{isChallenge ? '🏆' : '✅'}</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            {isKin
              ? (isChallenge ? 'Warangije ikigeragezo!' : 'Warangije isomo!')
              : (isChallenge ? 'Challenge complete!' : 'Lesson complete!')}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            {isKin ? 'Twereka ibitekerezo byawe (bihita)' : 'Quick feedback (takes 5 seconds)'}
          </p>
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>
            {isKin
              ? (isChallenge ? 'Iki kigeragezo cyari...' : 'Iri somo ryari...')
              : (isChallenge ? 'This challenge was...' : 'This lesson was...')}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {([1, 2, 3, 4, 5] as const).map(n => (
              <button
                key={n}
                onClick={() => setDifficulty(n)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 'var(--radius)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .12s',
                  background: difficulty === n ? 'var(--text)' : 'var(--surface)',
                  color: difficulty === n ? 'var(--bg)' : 'var(--text-2)',
                  border: difficulty === n ? '1px solid var(--text)' : '1px solid var(--line)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          {difficulty && (
            <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 6, textAlign: 'center' }}>
              {isKin ? LABELS_KIN[difficulty - 1] : LABELS_EN[difficulty - 1]}
            </p>
          )}
        </div>

        {/* Mwarimu question — only if they used it */}
        {usedMwarimu && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>
              {isKin ? 'Mwarimu yakugufashije?' : 'Did Mwarimu help you?'}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  onClick={() => setMwarimuHelped(val)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 'var(--radius)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .12s',
                    background: mwarimuHelped === val ? 'var(--text)' : 'var(--surface)',
                    color: mwarimuHelped === val ? 'var(--bg)' : 'var(--text-2)',
                    border: mwarimuHelped === val ? '1px solid var(--text)' : '1px solid var(--line)',
                  }}
                >
                  {val
                    ? (isKin ? '👍 Yego' : '👍 Yes')
                    : (isKin ? '👎 Oya' : '👎 No')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onDone}
            className="btn btn-secondary"
            style={{ flex: 1 }}
            disabled={submitting}
          >
            {isKin ? 'Simbuka' : 'Skip'}
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ flex: 2, opacity: canSubmit ? 1 : 0.4 }}
            disabled={!canSubmit || submitting}
          >
            {submitting
              ? (isKin ? 'Birimo...' : 'Saving...')
              : (isKin ? 'Ohereza' : 'Submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
