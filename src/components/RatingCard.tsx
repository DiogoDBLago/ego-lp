type Props = { letter: string; label: string; className?: string };

// Recriação em HTML/CSS do selo que a Ego usa (paródia de classificação de jogo).
export default function RatingCard({ letter, label, className = "" }: Props) {
  return (
    <div className={`rc ${className}`}>
      <div className="rc-in">
        <span className="rc-label">{label}</span>
        <span className="rc-box">
          <span className="rc-letter">{letter}</span>
        </span>
        <span className="rc-foot">
          <small>Content rated by</small>
          <strong>Ego Corp.</strong>
        </span>
      </div>
    </div>
  );
}
