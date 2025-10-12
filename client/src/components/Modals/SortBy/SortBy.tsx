import { AlphabetSort, Calendar, Flame, Target } from "../../../icons";
import styles from "./SortBy.module.scss"

type Props = {
  ref: React.RefObject<null>;
  onClick: (name: string) => void;
  selected: string,
}

const SortBy = ({ onClick, selected, ref }: Props) => {
  return (
    <div className={styles.sort_by} ref={ref}>
      <div className={styles.text}>
        <p>sort by...</p>
      </div>
      <div className={`${styles.option} ${selected === "dueDate" ? styles.selected : ""}`} onClick={() => onClick("dueDate")}>
        <Calendar />
        <p>Due date</p>
      </div>
      <div className={`${styles.option} ${selected === "createdAt" ? styles.selected : ""}`} onClick={() => onClick("createdAt")}>
        <Calendar />
        <p>Created at</p>
      </div>
      <div className={`${styles.option} ${selected === "title" ? styles.selected : ""}`} onClick={() => onClick("title")}>
        <AlphabetSort />
        <p>Title</p>
      </div>
      <div className={`${styles.option} ${selected === "priority" ? styles.selected : ""}`} onClick={() => onClick("priority")}>
        <Flame />
        <p>Priority</p>
      </div>
      <div className={`${styles.option} ${selected === "status" ? styles.selected : ""}`} onClick={() => onClick("status")}>
        <Target />
        <p>Status</p>
      </div>
    </div>
  )
}

export default SortBy