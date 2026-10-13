import { useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiPlus } from "react-icons/fi";
import styles from "./styles.module.css";

const titles = { "/home": "Home", "/appointments": "Appointments", "/health-records": "Health records" };

const Header = ({ onMenuToggle, onOpenNotifications, unreadCount }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <button className={styles.menu} type="button" onClick={onMenuToggle} aria-label="Open navigation"><FiMenu aria-hidden="true" /></button>
        <div><p>WELLNEST CARE</p><h1>{titles[pathname] || "Patient portal"}</h1></div>
      </div>
      <div className={styles.actions}>
        <button className={styles.notification} type="button" onClick={onOpenNotifications} aria-label={`Notifications, ${unreadCount} unread`}><FiBell aria-hidden="true" />{unreadCount > 0 && <span>{unreadCount}</span>}</button>
        <button className={styles.newAppointment} type="button" onClick={() => navigate("/appointments?new=1")}><FiPlus aria-hidden="true" /><span>Book appointment</span></button>
      </div>
    </header>
  );
};

export default Header;
