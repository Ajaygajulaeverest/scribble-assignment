import { Card } from "./Card";
import type { GuessEntry } from "../services/api";

interface ResultPanelProps {
  guesses?: GuessEntry[];
}

export function ResultPanel({ guesses = [] }: ResultPanelProps) {
  return (
    <Card title="Activity">
      <div className="placeholder-block" style={{ backgroundColor: '#f9fafb' }}>
        {guesses.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Game activity and guesses will appear here.</p>
        ) : (
          <ul className="activity-list">
            {guesses.map((guess) => (
              <li key={guess.id}>
                <span>
                  {guess.participantName}: {guess.text}
                </span>
                <strong>{guess.isCorrect ? "+100" : "+0"}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
