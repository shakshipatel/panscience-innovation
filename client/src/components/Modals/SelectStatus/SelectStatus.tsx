import { Tick } from "../../../icons";

import type { TaskStatus } from "../../../types";
import styles from "./SelectStatus.module.scss";

type Props = {
  ref: React.RefObject<null>;
  onSelect: (status: TaskStatus) => void;
  selectedState: string;
};

const SelectStatus = ({ ref, onSelect, selectedState }: Props) => {
  return (
    <div ref={ref} className={styles.select_status}>
      <div className={styles.late}>
        <div onClick={() => onSelect("late")}>
          <p>late</p>
        </div>
        {selectedState === "late" && <Tick />}
      </div>
      <div className={styles.done}>
        <div onClick={() => onSelect("done")}>
          <p>done</p>
        </div>
        {selectedState === "done" && <Tick />}
      </div>
      <div className={styles.progress}>
        <div onClick={() => onSelect("progress")}>
          <p>progress</p>
        </div>
        {selectedState === "progress" && <Tick />}
      </div>
    </div>
  );
};

export default SelectStatus;
