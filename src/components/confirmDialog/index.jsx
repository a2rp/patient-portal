import { FiAlertTriangle } from "react-icons/fi";
import Dialog from "../dialog";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, message, confirmLabel = "Confirm", onConfirm, onCancel }) => (
  <Dialog title={title} description={message} onClose={onCancel} size="small">
    <div className={styles.note}><FiAlertTriangle aria-hidden="true" /><p>You can review this change before confirming.</p></div>
    <div className={styles.actions}><button className={styles.cancel} type="button" data-dialog-initial onClick={onCancel}>Go back</button><button className={styles.confirm} type="button" onClick={onConfirm}>{confirmLabel}</button></div>
  </Dialog>
);

export default ConfirmDialog;
