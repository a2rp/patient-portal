import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiCheck, FiClock, FiFileText, FiHeart, FiMapPin, FiPlus, FiShield, FiUser } from "react-icons/fi";
import styles from "./styles.module.css";

const dayLabel = (value) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const shortDate = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));

const Home = ({ appointments, records, careTasks, onToggleTask, onSupport }) => {
  const navigate = useNavigate();
  const nextAppointment = [...appointments].filter((item) => item.status === "Confirmed").sort((a, b) => a.date.localeCompare(b.date))[0];
  const upcoming = appointments.filter((item) => item.status === "Confirmed").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2);
  const latestRecord = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
  const completed = careTasks.filter((task) => task.done).length;
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <div className={styles.page}>
      <div className={styles.greeting}><div><p className={styles.date}>{today}</p><h2>Good morning, Maya <span aria-hidden="true">☀</span></h2><p>Here’s your care, in one clear place. Take it one step at a time.</p></div><button className={styles.profileButton} type="button" onClick={onSupport}><span className={styles.profileIcon}><FiUser aria-hidden="true" /></span><span>Your care team</span><FiArrowRight aria-hidden="true" /></button></div>

      {nextAppointment ? <section className={styles.nextVisit}>
        <div className={styles.visitCopy}><div className={styles.visitLabel}><span /> NEXT APPOINTMENT</div><h1>Your next step is already on the calendar.</h1><p>We’ll see you soon. Your visit details are ready when you are.</p>
          <div className={styles.visitMeta}><span><FiCalendar aria-hidden="true" /> {dayLabel(nextAppointment.date)}</span><span><FiClock aria-hidden="true" /> {nextAppointment.time}</span></div>
          <div className={styles.doctor}><span className={styles.doctorAvatar}>AR</span><span><strong>{nextAppointment.provider}</strong><small>{nextAppointment.specialty}</small></span></div>
          <div className={styles.visitFooter}><span><FiMapPin aria-hidden="true" /> {nextAppointment.location}</span><button type="button" onClick={() => navigate("/appointments")}>Visit details <FiArrowRight aria-hidden="true" /></button></div>
        </div>
        <div className={styles.calendarCard}><div className={styles.calendarHead}><span>YOUR NEXT VISIT</span><FiHeart aria-hidden="true" /></div><strong>{shortDate(nextAppointment.date)}</strong><span className={styles.calendarTime}>{nextAppointment.time}</span><div className={styles.calendarRule} /><p>{nextAppointment.type}</p><span className={styles.calendarTag}>Confirmed</span></div>
      </section> : <section className={styles.noVisit}><FiCalendar aria-hidden="true" /><div><h2>No upcoming appointments</h2><p>Whenever you’re ready, choose a time that works for you.</p></div><Link to="/appointments"><FiPlus aria-hidden="true" /> Book an appointment</Link></section>}

      <div className={styles.contentGrid}>
        <section className={styles.carePlan}>
          <div className={styles.sectionHeader}><div><p>SMALL STEPS</p><h2>Your care plan</h2><span>A few things to keep you feeling well.</span></div><span className={styles.progressText}>{completed} of {careTasks.length} done</span></div>
          <div className={styles.progressTrack}><span style={{ width: `${careTasks.length ? completed / careTasks.length * 100 : 0}%` }} /></div>
          <div className={styles.taskList}>{careTasks.map((task) => <article className={`${styles.task} ${task.done ? styles.taskDone : ""}`} key={task.id}><button className={styles.taskCheck} type="button" onClick={() => onToggleTask(task.id)} aria-label={task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`} aria-pressed={task.done}>{task.done && <FiCheck aria-hidden="true" />}</button><div><h3>{task.title}</h3><p>{task.detail}</p></div><span className={styles.taskDue}>{task.done ? "Done" : task.due}</span></article>)}</div>
          <button className={styles.careButton} type="button" onClick={() => onSupport()}>Talk with your care team <FiArrowRight aria-hidden="true" /></button>
        </section>

        <section className={styles.snapshot}>
          <div className={styles.sectionHeader}><div><p>YOUR HEALTH</p><h2>At a glance</h2><span>Keep the important details close.</span></div><span className={styles.privacy}><FiShield aria-hidden="true" /> Private</span></div>
          <div className={styles.snapshotCard}><span className={styles.snapshotIcon}><FiFileText aria-hidden="true" /></span><div><span>Latest health record</span><strong>{latestRecord?.title || "No records yet"}</strong><small>{latestRecord ? `${shortDate(latestRecord.date)} · ${latestRecord.category}` : "Your records will appear here"}</small></div><Link to="/health-records" aria-label="Open health records"><FiArrowRight aria-hidden="true" /></Link></div>
          <div className={styles.snapshotStats}><div><span className={styles.statIcon}><FiCalendar aria-hidden="true" /></span><div><strong>{appointments.filter((item) => item.status === "Confirmed").length}</strong><span>Upcoming visits</span></div></div><div><span className={styles.statIcon}><FiHeart aria-hidden="true" /></span><div><strong>{records.filter((item) => item.category === "Medications" && item.status === "Current").length}</strong><span>Current medications</span></div></div></div>
          <Link className={styles.recordsLink} to="/health-records">Explore health records <FiArrowRight aria-hidden="true" /></Link>
        </section>
      </div>

      <section className={styles.upcoming}>
        <div className={styles.upcomingHead}><div><p>LOOKING AHEAD</p><h2>Coming up</h2></div><Link to="/appointments">All appointments <FiArrowRight aria-hidden="true" /></Link></div>
        {upcoming.length ? <div className={styles.upcomingList}>{upcoming.map((visit) => <article className={styles.upcomingItem} key={visit.id}><div className={styles.upcomingDate}><strong>{shortDate(visit.date).split(" ")[1]}</strong><span>{shortDate(visit.date).split(" ")[0]}</span></div><div className={styles.upcomingInfo}><strong>{visit.type}</strong><span>{visit.provider} · {visit.specialty}</span></div><span className={styles.upcomingTime}><FiClock aria-hidden="true" /> {visit.time}</span><Link to="/appointments" aria-label={`View ${visit.type}`}><FiArrowRight aria-hidden="true" /></Link></article>)}</div> : <p className={styles.emptyUpcoming}>You’re all caught up. Book a visit whenever you need one.</p>}
      </section>

      <div className={styles.careNote}><FiShield aria-hidden="true" /><span>Your information is shown for this frontend demo. Changes reset when you refresh.</span><button type="button" onClick={onSupport}>How this works</button></div>
    </div>
  );
};

export default Home;
