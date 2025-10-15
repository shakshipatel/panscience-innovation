import styles from "./TaskHeader.module.scss";

type Props = {};

const TaskHeader = ({}: Props) => {
  return (
    <div className={styles.task_header}>
      <div className={styles.task_details}>
        <p>TASK DETAILS</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <p>ASSIGNED TO</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <p>STATUS</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <p>CREATED DATE</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <p>DUE DATE</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <p>PRIORITY</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <p>ATTACHMENTS</p>
      </div>
    </div>
  );
};

export default TaskHeader;
