import { useMemo, useState } from "react";
import { FiActivity, FiArrowRight, FiBookOpen, FiCheck, FiChevronRight, FiFileText, FiHeart, FiSearch, FiShield, FiUser } from "react-icons/fi";
import Dialog from "../../components/dialog";
import styles from "./styles.module.css";

const categories = ["All records", "Lab results", "Visit notes", "Medications", "Health profile"];
const prettyDate = (value) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));

const HealthRecords = ({ records, onMarkReviewed }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All records");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => records.filter((record) => {
    const term = query.trim().toLowerCase();
    const matchesSearch = !term || `${record.title} ${record.provider} ${record.category} ${record.summary}`.toLowerCase().includes(term);
    return matchesSearch && (category === "All records" || record.category === category);
  }).sort((a, b) => b.date.localeCompare(a.date)), [records, query, category]);

  const iconFor = (record) => record.category === "Lab results" ? FiActivity : record.category === "Medications" ? FiHeart : record.category === "Visit notes" ? FiUser : FiFileText;
  const openFirstOf = (recordCategory) => {
    const record = records.find((item) => item.category === recordCategory);
    if (record) setSelected(record);
  };

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <div>
          <p className={styles.breadcrumb}>Your health <span>/</span> Records</p>
          <h2>All the little details, together.</h2>
          <p>Find your visit notes, medication list, and recent results in one place.</p>
        </div>
        <span className={styles.private}><FiShield aria-hidden="true" /> Your records are private</span>
      </section>

      <section className={styles.recordSummary} aria-label="Record summary">
        <div className={styles.summaryIcon}><FiBookOpen aria-hidden="true" /></div>
        <div className={styles.summaryText}><strong>{records.length} records</strong><span>Updated as your care moves along</span></div>
        <span className={styles.summaryDivider} />
        <div className={styles.summaryText}><strong>{records.filter((item) => item.status === "Reviewed").length} reviewed</strong><span>Ready for your next visit</span></div>
        <span className={styles.summaryBadge}><FiCheck aria-hidden="true" /> Up to date</span>
      </section>

      <div className={styles.layout}>
        <section className={styles.recordsPanel}>
          <div className={styles.panelHead}><div><p>YOUR HEALTH HISTORY</p><h3>Records</h3></div><span>{filtered.length} shown</span></div>
          <div className={styles.filters}>
            <label className={styles.search}><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records or providers" aria-label="Search health records" /></label>
            <label className={styles.category}>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>

          {filtered.length ? <div className={styles.recordList}>{filtered.map((record) => {
            const Icon = iconFor(record);
            const statusClass = styles[record.status.toLowerCase().replaceAll(" ", "-")];
            return <article className={styles.record} key={record.id}>
              <span className={styles.recordIcon}><Icon aria-hidden="true" /></span>
              <div className={styles.recordCopy}>
                <div className={styles.recordTitle}>
                  <button type="button" onClick={() => setSelected(record)}>{record.title}<FiChevronRight aria-hidden="true" /></button>
                  <span className={`${styles.recordStatus} ${statusClass || ""}`}>{record.status}</span>
                </div>
                <p>{record.summary}</p>
                <div className={styles.recordMeta}><span>{prettyDate(record.date)}</span><span aria-hidden="true">&bull;</span><span>{record.category}</span><span aria-hidden="true">&bull;</span><span>{record.provider}</span></div>
              </div>
              <button className={styles.openButton} type="button" aria-label={`Open ${record.title}`} onClick={() => setSelected(record)}><FiArrowRight aria-hidden="true" /></button>
            </article>;
          })}</div> : <div className={styles.empty}><FiSearch aria-hidden="true" /><h3>No records found</h3><p>Try another search or category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All records"); }}>Clear filters</button></div>}

          <div className={styles.panelFoot}><FiShield aria-hidden="true" /><span>Sample health information for this frontend demo.</span></div>
        </section>

        <aside className={styles.aside}>
          <section className={styles.healthCard}>
            <div className={styles.healthHead}><span><FiHeart aria-hidden="true" /></span><p>HEALTH PROFILE</p></div>
            <h3>A little context for your care.</h3>
            <div className={styles.profileRow}><span>Primary care</span><strong>Dr. Anika Rao</strong></div>
            <div className={styles.profileRow}><span>Preferred clinic</span><strong>Wellnest North</strong></div>
            <div className={styles.profileRow}><span>Medication allergies</span><strong>No known allergies</strong></div>
            <button type="button" onClick={() => openFirstOf("Health profile")}>View allergy record <FiArrowRight aria-hidden="true" /></button>
          </section>
          <section className={styles.medication}>
            <div><FiActivity aria-hidden="true" /><h3>Current medication</h3></div>
            <strong>Vitamin D3</strong><p>1,000 IU <span aria-hidden="true">&bull;</span> once daily with a meal</p>
            <button type="button" onClick={() => openFirstOf("Medications")}>See medication record <FiArrowRight aria-hidden="true" /></button>
          </section>
          <section className={styles.helpCard}>
            <FiBookOpen aria-hidden="true" /><div><h3>Need help understanding a record?</h3><p>Your care team can help put your results in context.</p><button type="button" onClick={() => openFirstOf("Visit notes")}>Open your visit summary</button></div>
          </section>
        </aside>
      </div>

      {selected && <Dialog title={selected.title} description={`${selected.category} | ${prettyDate(selected.date)}`} onClose={() => setSelected(null)}>
        <div className={styles.detail}>
          <div className={styles.detailMeta}><span>From</span><strong>{selected.provider}</strong></div>
          <div className={styles.detailMeta}><span>Record status</span><strong>{selected.status}</strong></div>
          <p>{selected.details}</p>
        </div>
        {selected.status !== "Reviewed" && <div className={styles.detailActions}><span>Mark this item for your next visit.</span><button type="button" onClick={() => { onMarkReviewed(selected.id); setSelected(null); }}><FiCheck aria-hidden="true" /> Mark reviewed</button></div>}
      </Dialog>}
    </div>
  );
};

export default HealthRecords;
