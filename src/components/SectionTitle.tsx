// Títulos entre "> <", como no site atual da Ego.
export default function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="sec-title display">
      <span aria-hidden="true">&gt;</span> {children} <span aria-hidden="true">&lt;</span>
    </h2>
  );
}
