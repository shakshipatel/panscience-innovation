import { format } from "date-fns";

import { stringToHexCompact } from "../../UserTag/UserTag";

import type { TaskPriority, TaskStatus } from "../../../types";

import styles from "./TaskRow.module.scss";
import { Attachment, Doc2 } from "../../../icons";

type Props = {
  title: string;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
  priority: TaskPriority;
  description?: string;
  assignedTo?: { id: string; name: string }[];
  attachedDocuments?: string[];
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const TaskRow = ({
  title,
  status,
  createdAt,
  dueDate,
  priority,
  description,
  attachedDocuments,
  assignedTo,
  onClick,
}: Props) => {
  return (
    <div className={styles.task_row + " task_row"} onClick={onClick}>
      <div className={styles.task_details}>
        <p>{title}</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <div className={styles.assigned_to}>
          {assignedTo?.map(({ id, name }) => (
            <div
              className={styles.user_tag}
              key={id}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={styles.icon}
                style={{ background: stringToHexCompact(id) }}
              >
                <p>
                  {name
                    ?.split(" ")
                    ?.map((word) => word[0])
                    ?.join("")
                    ?.slice(0, 2)}
                </p>
              </div>
              <p className={styles.name}>{name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.task_details_dynamic}>
        {status === "done" ? (
          <div className={styles.done}>
            <p>done</p>
          </div>
        ) : status === "progress" ? (
          <div className={styles.progress}>
            <p>progress</p>
          </div>
        ) : status === "late" ? (
          <div className={styles.late}>
            <p>late</p>
          </div>
        ) : (
          <div className={styles.status_todo}>
            <p>to-do</p>
          </div>
        )}
      </div>
      <div className={styles.task_details_dynamic}>
        <p>{format(new Date(createdAt), "dd/MM/yyyy")}</p>
      </div>
      <div className={styles.task_details_dynamic}>
        <p>{format(new Date(dueDate), "dd/MM/yyyy")}</p>
      </div>
      <div className={styles.task_details_dynamic}>
        {priority === "high" ? (
          <div className={styles.high}>
            <p>high</p>
          </div>
        ) : priority === "medium" ? (
          <div className={styles.medium}>
            <p>medium</p>
          </div>
        ) : priority === "urgent" ? (
          <div className={styles.urgent}>
            <p>urgent</p>
          </div>
        ) : (
          <div className={styles.low}>
            <p>low</p>
          </div>
        )}
      </div>
      <div className={styles.task_details_dynamic}>
        <Doc2 className={description ? styles.active : styles.empty} />
        <Attachment
          className={attachedDocuments?.length ? styles.active : styles.empty}
        />
      </div>
    </div>
  );
};

export default TaskRow;
