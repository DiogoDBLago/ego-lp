import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="ft">
      <Logo className="ft-logo" />
      <p>Ego Corporation, sua empresa, nosso foco!</p>
      <p className="ft-copy">© {new Date().getFullYear()} Ego Corp.</p>
    </footer>
  );
}
