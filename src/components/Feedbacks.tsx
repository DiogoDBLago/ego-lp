import SectionTitle from "./SectionTitle";
import { FEEDBACKS } from "@/lib/content";

export default function Feedbacks() {
  return (
    <section className="sec fb" id="feedbacks">
      <div className="wrap">
        <SectionTitle>Feedbacks</SectionTitle>
        <ul className="fb-grid">
          {FEEDBACKS.map((feedback) => (
            <li className="fb-card" key={feedback.name}>
              <span className="fb-stars" role="img" aria-label="5 de 5 estrelas">
                ★★★★★
              </span>
              <blockquote>{feedback.quote}</blockquote>
              <footer>
                <strong>{feedback.name}</strong>
                <span>{feedback.where}</span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
