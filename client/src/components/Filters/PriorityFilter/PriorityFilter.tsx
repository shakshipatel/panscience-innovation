import type { TaskPriority } from "../../../types";

import { Tick } from "../../../icons";
import styles from "./PriorityFilter.module.scss";

type Props = {
  ref: React.RefObject<null>;
  selected: TaskPriority[];
  onClick: (priority: TaskPriority) => void;
};

const PriorityFilter = ({ selected, onClick, ref }: Props) => {
  return (
    <div ref={ref} className={styles.priority_modal}>
      <div className={styles.low} onClick={() => onClick("low")}>
        <div>
          <p>low</p>
        </div>
        {selected?.includes("low") && <Tick />}
      </div>
      <div className={styles.medium} onClick={() => onClick("medium")}>
        <div>
          <p>medium</p>
        </div>
        {selected?.includes("medium") && <Tick />}
      </div>
      <div className={styles.high} onClick={() => onClick("high")}>
        <div>
          <p>high</p>
        </div>
        {selected?.includes("high") && <Tick />}
      </div>
      <div className={styles.urgent} onClick={() => onClick("urgent")}>
        <div>
          <p>urgent</p>
        </div>
        {selected?.includes("urgent") && <Tick />}
      </div>
    </div>
  );
};

export default PriorityFilter;
