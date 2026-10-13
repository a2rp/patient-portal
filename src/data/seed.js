const dateOffset = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const initialAppointments = [
  { id: "WN-2408", date: dateOffset(1), time: "9:30 AM", provider: "Dr. Anika Rao", specialty: "Primary care", type: "Follow-up visit", status: "Confirmed", reason: "Routine wellness review", location: "Wellnest North Clinic, Suite 210" },
  { id: "WN-2416", date: dateOffset(9), time: "2:15 PM", provider: "Dr. Julian Brooks", specialty: "Cardiology", type: "In-person visit", status: "Confirmed", reason: "Review recent readings", location: "Wellnest North Clinic, Suite 410" },
  { id: "WN-2382", date: dateOffset(-17), time: "11:00 AM", provider: "Dr. Anika Rao", specialty: "Primary care", type: "Annual check-up", status: "Completed", reason: "Annual wellness visit", location: "Wellnest North Clinic, Suite 210" },
  { id: "WN-2371", date: dateOffset(-32), time: "10:15 AM", provider: "Dr. Lila Chen", specialty: "Dermatology", type: "Follow-up visit", status: "Completed", reason: "Skin health review", location: "Wellnest East Clinic, Suite 305" },
];

export const initialRecords = [
  { id: "REC-3821", title: "Complete blood count", category: "Lab results", date: dateOffset(-3), provider: "Wellnest Diagnostics", status: "Reviewed", summary: "Results are within the expected range.", details: "Hemoglobin 13.4 g/dL. White blood cell count 6.2 x10^9/L. Platelets 248 x10^9/L. Your care team can answer questions about these results." },
  { id: "REC-3774", title: "Visit summary", category: "Visit notes", date: dateOffset(-17), provider: "Dr. Anika Rao", status: "Reviewed", summary: "A routine wellness visit with a follow-up plan.", details: "Continue your current care plan. Follow up in three months, or contact the clinic if your symptoms change." },
  { id: "REC-3628", title: "Medication list", category: "Medications", date: dateOffset(-25), provider: "Dr. Anika Rao", status: "Current", summary: "One active medication on file.", details: "Vitamin D3, 1,000 IU once daily with a meal. Confirm medication instructions with your clinician before making changes." },
  { id: "REC-3540", title: "Allergy profile", category: "Health profile", date: dateOffset(-41), provider: "Wellnest North Clinic", status: "Current", summary: "No known medication allergies on file.", details: "No known medication allergies are listed in this demo profile. Share new or corrected allergy information with your care team." },
  { id: "REC-3401", title: "Metabolic panel", category: "Lab results", date: dateOffset(-65), provider: "Wellnest Diagnostics", status: "Reviewed", summary: "Your care team reviewed the panel.", details: "The panel was reviewed at your last follow-up. Contact your clinician for interpretation and questions about your results." },
];

export const initialCareTasks = [
  { id: "CARE-1", title: "Take your daily vitamin", detail: "Vitamin D3 · with breakfast", due: "Today, morning", done: false },
  { id: "CARE-2", title: "Bring your home readings", detail: "A week of blood pressure notes", due: "Before your next visit", done: false },
  { id: "CARE-3", title: "Move a little today", detail: "A short walk counts", due: "Any time today", done: true },
];
