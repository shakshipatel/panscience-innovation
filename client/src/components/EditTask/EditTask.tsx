import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  type Task,
  type TaskPriority,
  type TaskStatus,
  type User as TaskUser,
} from "../../types";
import { useDocs, useTask, useUser } from "../../api";
import { errorToast, successToast } from "../../lib/toast";
import { useOutsideClickHandler } from "../../hooks";

import { PriorityModal, SelectAssignee, SelectStatus } from "../Modals";
import UserTag from "../UserTag/UserTag";

import { selectAllUsers, setAllUsers } from "../../store/reducers/accountSlice";
import {
  selectAllDocs,
  selectSelectedTask,
  setAllDocs,
} from "../../store/reducers/taskSlice";
import { selectUser } from "../../store/reducers/userSlice";

import {
  Calendar,
  Cross,
  Cross2,
  Doc,
  Flame,
  Target,
  Upload,
  User,
} from "../../icons";
import styles from "./EditTask.module.scss";

type Props = {
  onClose: () => void;
  visible: boolean;
  editTaskRef: React.RefObject<null>;
  onEdit: () => void;
};

const EditTask = ({ onClose, visible, editTaskRef, onEdit }: Props) => {
  const dispatch = useDispatch();

  const allUsers = useSelector(selectAllUsers);
  const APP_USER = useSelector(selectUser);
  const allDocs = useSelector(selectAllDocs);
  const selectedTask = useSelector(selectSelectedTask);

  const { getAllUsers } = useUser();
  const { updateTask } = useTask();
  const { getDocs, uploadDoc, getDoc } = useDocs();

  const [task, setTask] = useState<Task | null>(selectedTask);
  const [newFiles, setNewFiles] = useState<string[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);

  const userModalRef = useOutsideClickHandler(() => {
    setUserModalOpen(false);
  });
  const statusModalRef = useOutsideClickHandler(() => {
    setStatusModalOpen(false);
  });
  const priorityModalRef = useOutsideClickHandler(() => {
    setPriorityModalOpen(false);
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);
      uploadDoc(formData, (_res, err) => {
        if (err) {
          errorToast("Failed to upload document. Please try again.");
          return;
        }

        _getDocs();
        setNewFiles((prev) => [...prev, file.name]);

        if (!task) return;
        setTask((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            attachedDocuments: [...(prev.attachedDocuments ?? []), file.name],
          };
        });

        // Update task with new document
        updateTask(
          {
            id: task.id,
            updates: {
              ...task,
              users: task.users.map((u) => u.id),
              attachedDocuments: [...(task.attachedDocuments ?? []), file.name],
            },
          },
          (_res, err) => {
            if (err) {
              errorToast("Failed to update task with new document.");
              return;
            }
            successToast("Task updated successfully.");
          }
        );
      });
    }
  };

  const handleSubmit = () => {
    if (!task) return;

    // Permission check: only admin or assigned users can edit
    if (
      APP_USER?.role !== "admin" &&
      !task.users.find((u) => u.id === APP_USER?.id)
    ) {
      errorToast("You do not have permission to edit this task.");
      return;
    }

    const _task: Omit<Task, "id" | "createdAt" | "updatedAt" | "users"> & {
      users: string[];
    } = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      attachedDocuments: task.attachedDocuments,
      users: task.users.map((u) => u.id),
    };

    updateTask({ id: task.id, updates: _task }, (_res, err) => {
      if (err) {
        errorToast("Failed to update task. Please try again.");
        return;
      }
      successToast("Task updated successfully.");
      onEdit();
    });
  };

  const handleRemoveDoc = (doc: string) => {
    if (!task) return;
    setTask((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        attachedDocuments: prev.attachedDocuments.filter((d) => d !== doc),
      };
    });
  };

  const fetchAllUsers = () => {
    getAllUsers((res, err) => {
      if (err) {
        errorToast("Failed to fetch users. Please try again.");
        return;
      }
      dispatch(setAllUsers(res.data));
    });
  };

  const _getDocs = () => {
    getDocs((res, err) => {
      if (err) {
        errorToast("Failed to fetch documents. Please try again.");
        return;
      }
      dispatch(setAllDocs(res?.data));
    });
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (!visible) {
      _getDocs();
    }
  }, [visible]);

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
      setNewFiles(selectedTask?.attachedDocuments || []);
    }
  }, [selectedTask]);

  if (!selectedTask || !task) return null;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0,0,0,0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        pointerEvents: visible ? "all" : "none",
      }}
    >
      <div
        ref={editTaskRef}
        className={`${styles.add_task} ${visible ? styles.vis : ""}`}
      >
        <div className={styles.header}>
          <div className={styles.actions}>
            <div onClick={onClose} className={styles.close}>
              <Cross size={24} />
            </div>
          </div>
          <div className={styles.save} onClick={handleSubmit}>
            <p>Save</p>
          </div>
        </div>

        <div className={styles.main_content}>
          <input
            type="text"
            className={styles.title}
            placeholder="task title..."
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />

          <div className={styles.form_data}>
            {/* ASSIGNED USERS */}
            <div className={styles.form_row}>
              <div className={styles.label}>
                <User />
                <p>Assigned to</p>
              </div>
              <div
                className={styles.field}
                onClick={() => {
                  if (APP_USER?.role !== "admin") {
                    errorToast("Only admins can reassign users.");
                    return;
                  }
                  setUserModalOpen(true);
                }}
              >
                {userModalOpen && APP_USER?.role === "admin" && (
                  <SelectAssignee
                    allUsers={allUsers}
                    onSelect={(id) => {
                      if (APP_USER?.role !== "admin") {
                        errorToast("Only admins can reassign users.");
                        return;
                      }
                      const existing = task.users.find((u) => u.id === id);
                      if (existing) {
                        setTask((prev) =>
                          prev
                            ? {
                                ...prev,
                                users: prev.users.filter((u) => u.id !== id),
                              }
                            : null
                        );
                        return;
                      }
                      const user = allUsers.find((u) => u.id === id);
                      if (!user) return;
                      setTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              users: [
                                ...prev.users,
                                user as Omit<TaskUser, "password">,
                              ],
                            }
                          : null
                      );
                    }}
                    ref={userModalRef}
                    selectedUsers={task.users}
                  />
                )}
                {task.users.length > 0 ? (
                  task.users.map((user) => (
                    <UserTag
                      id={user.id}
                      name={user.name}
                      key={user.id}
                      onRemove={() => {
                        if (APP_USER?.role !== "admin") {
                          errorToast("Only admins can remove assigned users.");
                          return;
                        }
                        setTask((prev) =>
                          prev
                            ? {
                                ...prev,
                                users: prev.users.filter(
                                  (u) => u.id !== user.id
                                ),
                              }
                            : null
                        );
                      }}
                    />
                  ))
                ) : (
                  <div
                    onClick={() => {
                      if (APP_USER?.role !== "admin") {
                        errorToast("Only admins can reassign users.");
                        return;
                      }
                      setUserModalOpen(true);
                    }}
                    className={styles.wrapper}
                  >
                    <p>assign user...</p>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className={styles.form_row}>
              <div className={styles.label}>
                <Target />
                <p>Status</p>
              </div>
              <div
                className={styles.field}
                onClick={() => setStatusModalOpen(true)}
              >
                {statusModalOpen && (
                  <SelectStatus
                    ref={statusModalRef}
                    selectedState={task.status}
                    onSelect={(val: TaskStatus) => {
                      setTask((prev) =>
                        prev ? { ...prev, status: val } : null
                      );
                      setStatusModalOpen(false);
                    }}
                  />
                )}
                {task.status === "late" ? (
                  <div className={styles.late}>
                    <p>late</p>
                  </div>
                ) : task.status === "done" ? (
                  <div className={styles.done}>
                    <p>done</p>
                  </div>
                ) : (
                  <div className={styles.progress}>
                    <p>progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* PRIORITY */}
            <div className={styles.form_row}>
              <div className={styles.label}>
                <Flame />
                <p>Priority</p>
              </div>
              <div
                className={styles.field}
                onClick={() => setPriorityModalOpen(true)}
              >
                {priorityModalOpen && (
                  <PriorityModal
                    ref={priorityModalRef}
                    selectedState={task.priority}
                    onSelect={(val: TaskPriority) => {
                      setTask((prev) =>
                        prev ? { ...prev, priority: val } : null
                      );
                      setPriorityModalOpen(false);
                    }}
                  />
                )}
                {task.priority === "low" ? (
                  <div className={styles.low}>
                    <p>low</p>
                  </div>
                ) : task.priority === "medium" ? (
                  <div className={styles.medium}>
                    <p>medium</p>
                  </div>
                ) : task.priority === "high" ? (
                  <div className={styles.high}>
                    <p>high</p>
                  </div>
                ) : (
                  <div className={styles.urgent}>
                    <p>urgent</p>
                  </div>
                )}
              </div>
            </div>

            {/* DUE DATE */}
            <div className={styles.form_row}>
              <div className={styles.label}>
                <Calendar />
                <p>Due date</p>
              </div>
              <input
                type="date"
                value={
                  task.dueDate && !isNaN(new Date(task.dueDate).getTime())
                    ? new Date(task.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setTask({
                    ...task,
                    dueDate: value ? new Date(value) : null,
                  });
                }}
              />
            </div>
          </div>

          <div className={styles.divider} />

          {/* DESCRIPTION */}
          <textarea
            className={styles.description}
            placeholder="task description..."
            value={task.description ?? ""}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />

          {/* FILE UPLOADS */}
          <div className={styles.upload}>
            <div onClick={handleDivClick} className={styles.upload_file}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                style={{ display: "none" }}
              />
              <Upload />
              <p>Upload file</p>
            </div>
            {newFiles?.map((doc: string, idx: number) => (
              <div key={idx} className={styles.doc} onClick={() => getDoc(doc)}>
                <Doc />
                <p>{doc}</p>
                {task.attachedDocuments.includes(doc) && (
                  <Cross2
                    className={styles.cross}
                    size={16}
                    onClick={() => handleRemoveDoc(doc)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
