import { Tick } from "../../../icons"
import type { TaskStatus } from "../../../types"
import styles from "./StatusFilter.module.scss"

type Props = {
  ref: React.RefObject<null>,
  selected: TaskStatus[];
  onClick: (status: TaskStatus) => void;
}

const StatusFilter = ({ selected, onClick, ref }: Props) => {
  return (
    <div ref={ref} className={styles.select_status}>
      <div className={`${styles.late} ${selected.includes("late") ? styles.selected : ""}`} onClick={() => onClick("late")}>
        <div className={styles.pill}>
          <p>late</p>
        </div>
        {selected.includes("late") && <Tick />}
      </div>
      <div className={`${styles.done} ${selected.includes("done") ? styles.selected : ""}`} onClick={() => onClick("done")}>
        <div className={styles.pill}>
          <p>done</p>
        </div>
        {selected.includes("done") && <Tick />}
      </div>
      <div className={`${styles.progress} ${selected.includes("progress") ? styles.selected : ""}`} onClick={() => onClick("progress")}>
        <div className={styles.pill}>
          <p>progress</p>
        </div>
        {selected.includes("progress") && <Tick />}
      </div>
    </div>
  )
}

export default StatusFilter