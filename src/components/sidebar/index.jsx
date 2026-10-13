import { NavLink, Link } from "react-router-dom";
import { FiActivity, FiBookOpen, FiCalendar, FiHeart, FiHelpCircle, FiHome } from "react-icons/fi";
import styles from "./styles.module.css";

const links = [
  { to: "/home", label: "Home", icon: FiHome },
  { to: "/appointments", label: "Appointments", icon: FiCalendar },
  { to: "/health-records", label: "Health records", icon: FiBookOpen },
];

const Sidebar = ({ open, onClose, appointmentCount, onSupportClick }) => (
  <>
    {open && <button className={styles.scrim} type="button" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`} aria-label="Patient portal navigation">
      <Link className={styles.brand} to="/home" onClick={onClose}>
        <span className={styles.mark} aria-hidden="true"><FiHeart /></span>
        <span>wellnest<small>PATIENT PORTAL</small></span>
      </Link>

      <div className={styles.patient}>
        <span className={styles.avatar}>MP</span>
        <span className={styles.identity}><strong>Maya Patel</strong><small>Patient since 2022</small></span>
        <span className={styles.online} title="Profile active" />
      </div>

      <p className={styles.sectionLabel}>YOUR HEALTH</p>
      <nav className={styles.navigation} aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => [styles.navLink, isActive ? styles.active : ""].filter(Boolean).join(" ")} onClick={onClose}>
          <Icon aria-hidden="true" /><span>{label}</span>{label === "Appointments" && appointmentCount > 0 && <span className={styles.count}>{appointmentCount}</span>}
        </NavLink>)}
      </nav>

      <div className={styles.wellness}><div><FiActivity aria-hidden="true" /><span>WELLNESS CHECK</span></div><strong>You're on track.</strong><p>Your next visit is coming up soon. Keep your care moving at your own pace.</p><Link to="/appointments" onClick={onClose}>See your visit <span aria-hidden="true">→</span></Link></div>

      <button className={styles.help} type="button" onClick={onSupportClick}><span><FiHelpCircle aria-hidden="true" /></span><span><strong>Need a hand?</strong><small>Visit portal help</small></span><span className={styles.helpArrow}>↗</span></button>
      <div className={styles.sideFoot}><span className={styles.secure}><FiHeart aria-hidden="true" /> Your health, in your hands</span><span>Demo workspace</span></div>
    </aside>
  </>
);

export default Sidebar;
