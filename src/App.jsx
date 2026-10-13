import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiCalendar, FiClock, FiHeart, FiMapPin } from "react-icons/fi";
import AppRoutes from "./AppRoutes";
import Dialog from "./components/dialog";
import Footer from "./components/footer";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Toast from "./components/toast";
import { initialAppointments, initialCareTasks, initialRecords } from "./data/seed";
import styles from "./App.module.css";

const App = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [records, setRecords] = useState(initialRecords);
  const [careTasks, setCareTasks] = useState(initialCareTasks);
  const [toasts, setToasts] = useState([]);
  const [sidebar, setSidebar] = useState({ open: false, pathname: location.pathname });
  const sidebarOpen = sidebar.open && sidebar.pathname === location.pathname;
  const [dialog, setDialog] = useState(null);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const toastId = useRef(0);
  const appointmentId = useRef(2421);

  const notify = (type, message) => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((items) => [...items, { id, type, message }].slice(-4));
  };

  const saveAppointment = (values, id) => {
    if (id) {
      setAppointments((items) => items.map((item) => item.id === id ? { ...item, ...values, status: "Confirmed" } : item));
      notify("success", "Your appointment details have been updated.");
      return true;
    }
    const newAppointment = {
      ...values,
      id: `WN-${appointmentId.current}`,
      status: "Confirmed",
      location: values.type.toLowerCase().includes("virtual") ? "Secure video visit" : "Wellnest North Clinic, Suite 210",
    };
    appointmentId.current += 1;
    setAppointments((items) => [newAppointment, ...items]);
    notify("success", "Your appointment is confirmed in this demo.");
    setNotificationsRead(false);
    return true;
  };

  const cancelAppointment = (id) => {
    setAppointments((items) => items.map((item) => item.id === id ? { ...item, status: "Cancelled" } : item));
    notify("success", "The appointment was cancelled.");
  };

  const toggleCareTask = (id) => {
    const task = careTasks.find((item) => item.id === id);
    setCareTasks((items) => items.map((item) => item.id === id ? { ...item, done: !item.done } : item));
    notify("success", task?.done ? "Care plan item marked incomplete." : "Care plan item marked complete.");
  };

  const markRecordReviewed = (id) => {
    setRecords((items) => items.map((item) => item.id === id ? { ...item, status: "Reviewed" } : item));
    notify("success", "The record is marked as reviewed.");
  };

  const confirmedAppointments = appointments.filter((item) => item.status === "Confirmed").sort((a, b) => a.date.localeCompare(b.date));
  const openNotifications = () => { setNotificationsRead(true); setDialog("notifications"); };
  const routeProps = {
    appointments,
    records,
    careTasks,
    onToggleTask: toggleCareTask,
    onSupport: () => setDialog("support"),
    onSave: saveAppointment,
    onCancelAppointment: cancelAppointment,
    onMarkReviewed: markRecordReviewed,
    notify,
  };

  return (
    <div className={styles.appShell}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebar({ open: false, pathname: location.pathname })} appointmentCount={confirmedAppointments.length} onSupportClick={() => setDialog("support")} />
      <div className={styles.workspace}>
        <Header onMenuToggle={() => setSidebar({ open: !sidebarOpen, pathname: location.pathname })} isMenuOpen={sidebarOpen} onOpenNotifications={openNotifications} unreadCount={notificationsRead ? 0 : confirmedAppointments.length ? 1 : 0} />
        <main id="main-content" className={styles.mainContent}>
          <AppRoutes {...routeProps} />
        </main>
        <Footer />
      </div>

      <Toast items={toasts} onDismiss={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />

      {dialog === "support" && <Dialog title="A little help, whenever you need it." description="This patient portal is a frontend demonstration with sample health information." onClose={() => setDialog(null)}>
        <div className={styles.supportBody}>
          <div className={styles.supportIntro}><span><FiHeart aria-hidden="true" /></span><p>Your real care team can help with medical questions, appointment changes, and records. This demo does not contact a clinic or provide medical advice.</p></div>
          <div className={styles.supportOption}><FiCalendar aria-hidden="true" /><div><strong>Appointments</strong><span>Review or reschedule a visit in the Appointments section.</span></div></div>
          <div className={styles.supportOption}><FiMapPin aria-hidden="true" /><div><strong>Clinic information</strong><span>Wellnest North Clinic, Suite 210</span></div></div>
          <div className={styles.supportOption}><FiClock aria-hidden="true" /><div><strong>Demo data</strong><span>Changes are held in page state and reset after refresh.</span></div></div>
          <button className={styles.doneButton} type="button" onClick={() => setDialog(null)}>Got it</button>
        </div>
      </Dialog>}

      {dialog === "notifications" && <Dialog title="Your care reminders" description="A quick look at what is coming up." onClose={() => setDialog(null)}>
        <div className={styles.notifications}>
          {confirmedAppointments.length ? confirmedAppointments.slice(0, 3).map((appointment) => <article className={styles.notificationItem} key={appointment.id}>
            <span><FiCalendar aria-hidden="true" /></span><div><strong>{appointment.type}</strong><p>{appointment.provider} | {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(new Date(`${appointment.date}T12:00:00`))} at {appointment.time}</p></div>
          </article>) : <div className={styles.noNotifications}><FiHeart aria-hidden="true" /><p>You are all caught up. Your next appointment reminder will appear here.</p></div>}
          <p className={styles.demoNote}>These reminders are sample data in this frontend demo.</p>
          <button className={styles.doneButton} type="button" onClick={() => setDialog(null)}>Close reminders</button>
        </div>
      </Dialog>}

    </div>
  );
};

export default App;
