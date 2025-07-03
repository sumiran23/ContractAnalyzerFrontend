import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

const Navbar = () => (
  <nav className={styles.navbar}>
    <div className={styles.logo}>ContractAnalyzer</div>
    <div>
      {localStorage.getItem("accessToken") ? (
        <div className={styles.avatarDropdown}>
          <img
            src="https://ui-avatars.com/api/?name=User"
            alt="Avatar"
            className={styles.avatar}
            tabIndex={0}
            onClick={() => {
              const dropdown = document.getElementById("dropdown-menu");
              if (dropdown) dropdown.classList.toggle(styles.show);
            }}
          />
          <div id="dropdown-menu" className={styles.dropdownMenu}>
            <Link to="/profile">Profile</Link>
            <a
              href="#logout"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem("accessToken");
                window.location.reload();
              }}
            >
              Log out
            </a>
          </div>
        </div>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  </nav>
);

export default Navbar;
