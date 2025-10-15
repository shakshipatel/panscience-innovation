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
  // ArrowDown,
  // ArrowUp,
  Calendar,
  Cross,
  Cross2,
  Doc,
  Flame,
  Target,
  Upload,
  User,
} from "../../icons";
import styles from "./AddTask.module.scss";

type Props = {
  onClose: () => void;
  visible: boolean;
  addTaskRef: React.RefObject<null>;
  onCreate: () => void;
};

const AddTask = ({ onClose, visible, addTaskRef, onCreate }: Props) => {
  const dispatch = useDispatch();

  const APP_USER = useSelector(selectUser);
  const allUsers = useSelector(selectAllUsers);
  // const allDocs = useSelector(selectAllDocs)

  const { getAllUsers } = useUser();
  const { createTask } = useTask();
  const { getDocs, uploadDoc } = useDocs();

  const [task, setTask] = useState<CreateTask>({
    title: "",
    description: "",
    priority: "low",
    status: "progress",
    dueDate: new Date(),
    attachedDocuments: [],
  });
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [newFiles, setNewFiles] = useState<{ name: string }[]>([]);
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
    fileInputRef.current?.click(); // trigger file picker
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
        successToast("Document uploaded successfully.");
        _getDocs();
        setNewFiles((prev) => [
          ...prev,
          {
            name: file.name,
          },
        ]);
      });
    }
  };

  const handleSubmit = () => {
    if (!APP_USER) {
      errorToast("User not found. Please login again.");
      return;
    }
    if (
      APP_USER?.role !== "admin" &&
      !users.find((u) => u.id === APP_USER?.id)
    ) {
      errorToast("Failed to create task.");
      return;
    }
    createTask(
      task,
      APP_USER?.role === "admin"
        ? users.map((u) => ({ id: u.id }))
        : [{ id: APP_USER?.id }],
      (_res, err) => {
        if (err) {
          errorToast("Failed to create task. Please try again.");
          return;
        }
        successToast("Task created successfully.");
        setTask({
          title: "",
          description: "",
          priority: "low",
          status: "progress",
          dueDate: new Date(),
          attachedDocuments: [],
        });
        setUsers([]);
        onCreate();
      }
    );
  };

  const handleRemoveDoc = (doc: string) => {
    setTask((prev) => ({
      ...prev,
      attachedDocuments: prev.attachedDocuments.filter((d) => d !== doc),
    }));
  };

  const handleAddDoc = (doc: string) => {
    if (task.attachedDocuments.includes(doc)) return;
    setTask((prev) => ({
      ...prev,
      attachedDocuments: [...prev.attachedDocuments, doc],
    }));
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
      setTask({
        title: "",
        description: "",
        priority: "low",
        status: "progress",
        dueDate: new Date(),
        attachedDocuments: [],
      });
      _getDocs();
      setUsers([]);
      setNewFiles([]);
    }
  }, [visible]);
  return (
    <div
      ref={addTaskRef}
      className={`${styles.add_task} ${visible ? styles.vis : ""}`}
    >
      <div className={styles.header}>
        <div className={styles.actions}>
          <div onClick={onClose} className={styles.close}>
            <Cross size={24} />
          </div>
          {/* <div className={styles.sep} />
          <div className={styles.arrows}>
            <div className={styles.arrow_up}>
              <ArrowUp size={24} />
            </div>
            <div className={styles.arrow_down}>
              <ArrowDown size={24} />
            </div>
          </div> */}
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
          <div className={styles.form_row}>
            <div className={styles.label}>
              <User />
              <p>Assigned to</p>
            </div>
            <div
              className={styles.field}
              onClick={() => setUserModalOpen(true)}
            >
              {userModalOpen && (
                <SelectAssignee
                  allUsers={allUsers}
                  onSelect={(id) => {
                    if (APP_USER?.role !== "admin" && id !== APP_USER?.id) {
                      errorToast("Only admin can assign tasks to other users.");
                      return;
                    }
                    const _user = users.find((u) => u.id === id);
                    if (_user) {
                      setUsers(users.filter((u) => u.id !== id));
                      return;
                    }
                    const user = allUsers.find((u) => u.id === id);
                    if (!user) return;
                    setUsers([...users, user]);
                  }}
                  ref={userModalRef}
                  selectedUsers={users}
                />
              )}
              {users.length > 0 ? (
                users?.map((user) => (
                  <UserTag
                    id={user.id}
                    name={user.name}
                    key={user.id}
                    onRemove={() =>
                      setUsers((prev) => {
                        return prev.filter((u) => u.id !== user.id);
                      })
                    }
                  />
                ))
              ) : (
                <div
                  onClick={() => setUserModalOpen(true)}
                  className={styles.wrapper}
                >
                  <p>assign user...</p>
                </div>
              )}
            </div>
          </div>
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
                    setTask((prev) => ({
                      ...prev,
                      status: val,
                    }));
                    setStatusModalOpen(false);
                  }}
                />
              )}
              {task.status == "late" ? (
                <div className={styles.late}>
                  <p>late</p>
                </div>
              ) : task.status == "done" ? (
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
                    setTask((prev) => ({
                      ...prev,
                      priority: val,
                    }));
                    setPriorityModalOpen(false);
                  }}
                />
              )}
              {task.priority == "low" ? (
                <div className={styles.low}>
                  <p>low</p>
                </div>
              ) : task.priority == "medium" ? (
                <div className={styles.medium}>
                  <p>medium</p>
                </div>
              ) : task.priority == "high" ? (
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
          <div className={styles.form_row}>
            <div className={styles.label}>
              <Calendar />
              <p>Due date</p>
            </div>
            {/* { input } */}
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
                  dueDate: value ? new Date(value) : null, // if empty, set null
                });
              }}
            />
          </div>
        </div>
        <div className={styles.divider} />
        <textarea
          className={styles.description}
          placeholder="task description..."
          value={task.description ?? ""}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
        <div className={styles.upload}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf" // only PDF
            style={{ display: "none" }}
          />
          <div onClick={handleDivClick} className={styles.upload_file}>
            <Upload />
            <p>Upload file</p>
          </div>
          {newFiles
            ?.map((file) => file.name)
            ?.map((doc: string, idx: number) => (
              <div
                key={idx}
                className={styles.doc}
                onClick={() => {
                  if (!task.attachedDocuments.includes(doc)) {
                    if (task.attachedDocuments.length >= 3) {
                      errorToast("You can attach up to 5 documents only.");
                      return;
                    }
                    handleAddDoc(doc);
                  }
                }}
              >
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
  );
};

export default AddTask;
