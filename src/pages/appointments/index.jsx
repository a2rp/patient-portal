import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowDown, FiArrowUp, FiCalendar, FiChevronRight, FiClock, FiEdit2, FiMapPin, FiPlus, FiSearch, FiShield, FiTrash2, FiVideo } from "react-icons/fi";
import Dialog from "../../components/dialog";
import ConfirmDialog from "../../components/confirmDialog";
import styles from "./styles.module.css";

const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const today = localDate();
const blankForm = { provider: "Dr. Anika Rao", specialty: "Primary care", type: "Follow-up visit", date: localDate(new Date(Date.now() + 86400000)), time: "9:30 AM", reason: "" };
const prettyDate = (value) => new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const providers = [{ name: "Dr. Anika Rao", specialty: "Primary care" }, { name: "Dr. Julian Brooks", specialty: "Cardiology" }, { name: "Dr. Lila Chen", specialty: "Dermatology" }];
const timeOptions = ["8:30 AM", "9:30 AM", "10:15 AM", "11:00 AM", "1:30 PM", "2:15 PM", "3:00 PM"];

const Appointments = ({ appointments, onSave, onCancelAppointment, notify }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedNew = new URLSearchParams(location.search).get("new") === "1";
  const [dialog, setDialog] = useState(() => requestedNew ? { type: "form", appointment: null } : null);
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All appointments");
  const [sort, setSort] = useState("asc");
  const [cancelTarget, setCancelTarget] = useState(null);

  const closeDialog = () => { setDialog(null); if (new URLSearchParams(location.search).get("new") === "1") navigate(location.pathname, { replace: true }); };
  const openNew = () => { setForm({ ...blankForm, date: localDate(new Date(Date.now() + 86400000)) }); setErrors({}); setDialog({ type: "form", appointment: null }); };
  const openEdit = (appointment) => { setForm({ provider: appointment.provider, specialty: appointment.specialty, type: appointment.type, date: appointment.date, time: appointment.time, reason: appointment.reason }); setErrors({}); setDialog({ type: "form", appointment }); };
  const updateField = (field, value) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== field))); };

  const filtered = useMemo(() => appointments.filter((item) => {
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || `${item.provider} ${item.specialty} ${item.type} ${item.reason} ${item.id}`.toLowerCase().includes(term);
    const matchesFilter = filter === "All appointments" || item.status === filter;
    return matchesQuery && matchesFilter;
  }).sort((a, b) => a.date.localeCompare(b.date) * (sort === "asc" ? 1 : -1)), [appointments, query, filter, sort]);

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.date) nextErrors.date = "Choose a date for your visit.";
    if (form.date && form.date < today) nextErrors.date = "Choose today or a future date.";
    if (!form.reason.trim()) nextErrors.reason = "Add a short reason for your visit.";
    if (form.reason.trim().length > 120) nextErrors.reason = "Keep the reason under 120 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { notify("error", "Please review the appointment details."); return; }
    const saved = onSave({ ...form, reason: form.reason.trim() }, dialog.appointment?.id);
    if (saved) closeDialog();
  };
  const cancelVisit = () => { onCancelAppointment(cancelTarget.id); setCancelTarget(null); if (dialog?.type === "details") closeDialog(); };

  return (
    <div className={styles.page}>
      <div className={styles.heading}><div><p className={styles.breadcrumb}>Your health <span>/</span> Appointments</p><h2>Care that fits your day.</h2><p>See what’s coming up, or find a time that works better.</p></div><button className={styles.primary} type="button" onClick={openNew}><FiPlus aria-hidden="true" /> Book a visit</button></div>
      <div className={styles.summary}><div><FiCalendar aria-hidden="true" /><span><strong>{appointments.filter((item) => item.status === "Confirmed").length}</strong> upcoming visits</span></div><div><FiClock aria-hidden="true" /><span><strong>{appointments.filter((item) => item.status === "Completed").length}</strong> past visits</span></div><p>Appointments shown here are demo data.</p></div>
      <section className={styles.appointmentPanel}>
        <div className={styles.toolbar}><label className={styles.search}><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a provider, visit, or note" aria-label="Search appointments" /></label><label className={styles.filter}>View<select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All appointments</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></label><button className={styles.sort} type="button" onClick={() => setSort((value) => value === "asc" ? "desc" : "asc")} aria-label={`Sort by date ${sort === "asc" ? "descending" : "ascending"}`}>Date {sort === "asc" ? <FiArrowUp aria-hidden="true" /> : <FiArrowDown aria-hidden="true" />}</button></div>
        <div className={styles.listHead}><h3>Your appointments</h3><span>{filtered.length} shown</span></div>
        {filtered.length ? <div className={styles.timeline}>{filtered.map((item) => <article className={styles.visit} key={item.id}>
          <div className={styles.dateBlock}><span>{new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(`${item.date}T12:00:00`))}</span><strong>{new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(new Date(`${item.date}T12:00:00`))}</strong><small>{new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(`${item.date}T12:00:00`))}</small></div>
          <div className={styles.visitMain}><div className={styles.visitTop}><button type="button" className={styles.visitName} onClick={() => setDialog({ type: "details", appointment: item })}>{item.type}<FiChevronRight aria-hidden="true" /></button><span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>{item.status}</span></div><p>{item.provider} <span>·</span> {item.specialty}</p><div className={styles.meta}><span><FiClock aria-hidden="true" /> {item.time}</span><span>{item.type.toLowerCase().includes("virtual") ? <FiVideo aria-hidden="true" /> : <FiMapPin aria-hidden="true" />} {item.location}</span></div><small>{item.reason}</small></div>
          <div className={styles.actions}>{item.status === "Confirmed" && <><button className={styles.editButton} type="button" onClick={() => openEdit(item)}><FiEdit2 aria-hidden="true" /><span>Reschedule</span></button><button className={styles.cancelButton} type="button" onClick={() => setCancelTarget(item)}><FiTrash2 aria-hidden="true" /><span>Cancel visit</span></button></>}</div>
        </article>)}</div> : <div className={styles.empty}><FiCalendar aria-hidden="true" /><h3>No appointments match</h3><p>Try changing your search or view filter.</p><button type="button" onClick={() => { setQuery(""); setFilter("All appointments"); }}>Clear filters</button></div>}
        <div className={styles.listFooter}><FiShield aria-hidden="true" /><span>Your visit changes stay in this demo while this page is open.</span></div>
      </section>

      {dialog?.type === "form" && <Dialog title={dialog.appointment ? "Reschedule your visit" : "Book an appointment"} description="Choose a time and tell your care team what you’d like to discuss." onClose={closeDialog} size="large"><form className={styles.form} onSubmit={submit} noValidate>
        <label className={styles.field}>Care provider<select value={form.provider} onChange={(event) => { const provider = providers.find((item) => item.name === event.target.value); updateField("provider", provider.name); updateField("specialty", provider.specialty); }}>{providers.map((item) => <option key={item.name} value={item.name}>{item.name} · {item.specialty}</option>)}</select></label>
        <label className={styles.field}>Visit type<select value={form.type} onChange={(event) => updateField("type", event.target.value)}><option>Follow-up visit</option><option>Annual check-up</option><option>In-person visit</option><option>Virtual visit</option></select></label>
        <label className={styles.field}>Date<input type="date" min={today} value={form.date} onChange={(event) => updateField("date", event.target.value)} aria-invalid={!!errors.date} />{errors.date && <span>{errors.date}</span>}</label>
        <label className={styles.field}>Time<select value={form.time} onChange={(event) => updateField("time", event.target.value)}>{timeOptions.map((time) => <option key={time}>{time}</option>)}</select></label>
        <label className={`${styles.field} ${styles.fullField}`}>What would you like to discuss?<textarea rows="3" maxLength="120" value={form.reason} onChange={(event) => updateField("reason", event.target.value)} placeholder="A short note for your care team" aria-invalid={!!errors.reason} /><small>{form.reason.length}/120</small>{errors.reason && <span>{errors.reason}</span>}</label>
        <div className={styles.formFoot}><p>Your visit will appear as confirmed in this demo.</p><div><button className={styles.secondary} type="button" onClick={closeDialog}>Go back</button><button className={styles.primary} type="submit"><FiCalendar aria-hidden="true" /> {dialog.appointment ? "Save new time" : "Confirm appointment"}</button></div></div>
      </form></Dialog>}

      {dialog?.type === "details" && <Dialog title={dialog.appointment.type} description={`Appointment ${dialog.appointment.id}`} onClose={closeDialog}><div className={styles.detail}><div><span>Care provider</span><strong>{dialog.appointment.provider}</strong><small>{dialog.appointment.specialty}</small></div><div><span>Date and time</span><strong>{prettyDate(dialog.appointment.date)}</strong><small>{dialog.appointment.time}</small></div><div><span>Visit location</span><strong>{dialog.appointment.location}</strong></div><div><span>Status</span><strong>{dialog.appointment.status}</strong></div><div className={styles.reason}><span>Visit note</span><strong>{dialog.appointment.reason}</strong></div></div>{dialog.appointment.status === "Confirmed" && <div className={styles.detailActions}><button className={styles.secondary} type="button" onClick={() => openEdit(dialog.appointment)}><FiEdit2 aria-hidden="true" /> Reschedule</button><button className={styles.cancelButton} type="button" onClick={() => setCancelTarget(dialog.appointment)}>Cancel visit</button></div>}</Dialog>}
      {cancelTarget && <ConfirmDialog title="Cancel this appointment?" message={`${cancelTarget.type} with ${cancelTarget.provider} on ${prettyDate(cancelTarget.date)} will be removed from your upcoming visits.`} confirmLabel="Cancel appointment" onCancel={() => setCancelTarget(null)} onConfirm={cancelVisit} />}
    </div>
  );
};

export default Appointments;
