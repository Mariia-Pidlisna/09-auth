import css from "./Header.module.css";
import Link from "next/link";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
             <Link href="/notes/filter/all" className={css.menuLink}>
                Notes
             </Link>
          </li>
            <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}

export default Header;
