import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.wrap}>
        <span>© {new Date().getFullYear()} NoteHub</span>
        <span>Developer: Volodymyr Soroka</span>
        <a href="mailto:student@notehub.app">student@notehub.app</a>
      </div>
    </footer>
  );
}
