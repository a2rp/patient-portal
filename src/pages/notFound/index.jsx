import { Link } from "react-router-dom";
import { FiArrowLeft, FiHeart } from "react-icons/fi";
import styles from "./styles.module.css";

const NotFound = () => (
  <main className={styles.page}>
    <span className={styles.icon}><FiHeart aria-hidden="true" /></span>
    <p className={styles.eyebrow}>WELLNEST PATIENT PORTAL</p>
    <h2>This page isn’t on your care plan.</h2>
    <p className={styles.copy}>The address may have changed. Head back to your health overview to find what you need.</p>
    <Link to="/home"><FiArrowLeft aria-hidden="true" /> Return to overview</Link>
  </main>
);

export default NotFound;
