import { Tick } from "../../../icons"
import type { TaskPriority } from "../../../types"
import styles from "./PriorityModal.module.scss"

type Props = {
  ref: React.RefObject<null>,
  onSelect: (priority: TaskPriority) => void,
  selectedState: string,
}

const PriorityModal = ({ ref, onSelect, selectedState }: Props) => {
  return (
    <div ref={ref} className={styles.priority_modal}>
      <div className={styles.low}>
        <div onClick={() => onSelect("low")}>
          <p>low</p>
        </div>
        {selectedState === "low" && <Tick />}
      </div>
      <div className={styles.medium}>
        <div onClick={() => onSelect("medium")}>
          <p>medium</p>
        </div>
        {selectedState === "medium" && <Tick />}
      </div>
      <div className={styles.high}>
        <div onClick={() => onSelect("high")}>
          <p>high</p>
        </div>
        {selectedState === "high" && <Tick />}
      </div>
      <div className={styles.urgent}>
        <div onClick={() => onSelect("urgent")}>
          <p>urgent</p>
        </div>
        {selectedState === "urgent" && <Tick />}
      </div>
    </div>
  )
}

export default PriorityModal