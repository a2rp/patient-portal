import styles from "./App.module.css";

const App = () => (
  <main className={styles.setup}>
    <span className={styles.mark} aria-hidden="true">+</span>
    <p>WELLNEST PATIENT PORTAL</p>
    <h1>Your care, a little easier to follow.</h1>
    <span>Appointments, records, and next steps in one calm place.</span>
  </main>
);

export default App;
