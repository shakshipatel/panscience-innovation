import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Navbar } from "../../components";
import AddTask from "../../components/AddTask/AddTask";
import { TaskHeader, TaskRow } from "../../components/Task";
import { SortBy } from "../../components/Modals";
import EditTask from "../../components/EditTask/EditTask";
import {
  PriorityFilter,
  StatusFilter,
  UserFilter,
} from "../../components/Filters";

import { useOutsideClickHandler } from "../../hooks";
import { useTask, useUser } from "../../api";
import { errorToast } from "../../lib/toast";
import type { TaskPriority, TaskStatus } from "../../types";

import {
  selectPaginationTasks,
  selectSelectedTask,
  setPaginationTasks,
  setSelectedTask,
} from "../../store/reducers/taskSlice";
import { selectAllUsers, setAllUsers } from "../../store/reducers/accountSlice";
import { selectUser } from "../../store/reducers/userSlice";

import {
  Add,
  ArrowLeft,
  DropdownArrow,
  Flame,
  Sort,
  Target,
  User,
} from "../../icons";
import styles from "./Tasks.module.scss";

const LIMIT = 10;

const Tasks = () => {
  const dispatch = useDispatch();

  const paginationTasks = useSelector(selectPaginationTasks);
  const selectedTask = useSelector(selectSelectedTask);
  const allUsers = useSelector(selectAllUsers);
  const APP_USER = useSelector(selectUser);

  const { getPaginatedTasks } = useTask();
  const { getAllUsers } = useUser();

  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [priorityFilterOpen, setPriorityFilterOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [userFilterOpen, setUserFilterOpen] = useState(false);

  const addTaskRef = useOutsideClickHandler(() => {
    setAddTaskVisible(false);
  });
  const sortRef = useOutsideClickHandler(() => {
    setSortModalOpen(false);
  });
  const editTaskRef = useOutsideClickHandler(() => {
    dispatch(setSelectedTask(null));
  });
  const priorityFilterRef = useOutsideClickHandler(() => {
    setPriorityFilterOpen(false);
  });
  const statusFilterRef = useOutsideClickHandler(() => {
    setStatusFilterOpen(false);
  });
  const userFilterRef = useOutsideClickHandler(() => {
    setUserFilterOpen(false);
  });

  const _getPaginationTasks = () => {
    getPaginatedTasks(
      {
        filter: {
          priority: paginationTasks.filter.priority,
          status: paginationTasks.filter.status,
          users: [...paginationTasks.filter.users, APP_USER?.id || ""],
        },
        page: paginationTasks.currentPage,
        limit: LIMIT,
        sortBy: paginationTasks.sortBy,
        sortOrder: paginationTasks.sortOrder,
      },
      (res, err) => {
        if (err) {
          errorToast("Failed to fetch tasks. Please try again.");
          return;
        }
        dispatch(
          setPaginationTasks({
            tasks: {
              ...paginationTasks?.tasks,
              [paginationTasks.currentPage]: res?.data?.tasks || [],
            },
            totalPages: Math.ceil(res?.data.total / LIMIT),
            currentPage: paginationTasks.currentPage,
            filter: paginationTasks.filter,
            sortBy: paginationTasks.sortBy,
            sortOrder: paginationTasks.sortOrder,
          })
        );
      }
    );
  };

  const _getAllUsers = () => {
    getAllUsers((res, err) => {
      if (err) {
        errorToast("Failed to fetch users. Please try again.");
        return;
      }
      dispatch(setAllUsers(res?.data || []));
    });
  };

  useEffect(() => {
    _getAllUsers();
    _getPaginationTasks();
  }, [
    paginationTasks.currentPage,
    paginationTasks.sortBy,
    paginationTasks.sortOrder,
    paginationTasks.filter,
  ]);
  return (
    <div className={styles.page}>
      <AddTask
        addTaskRef={addTaskRef}
        onClose={() => setAddTaskVisible(false)}
        visible={addTaskVisible}
        onCreate={() => {
          _getPaginationTasks();
        }}
      />
      <EditTask
        editTaskRef={editTaskRef}
        visible={selectedTask ? true : false}
        onClose={() => dispatch(setSelectedTask(null))}
        onEdit={() => {
          _getPaginationTasks();
        }}
      />
      <Navbar title="My Tasks" />
      <div className={styles.action_container}>
        <div className={styles.left}>
          <div
            className={styles.priority}
            onClick={() => setPriorityFilterOpen(!priorityFilterOpen)}
            ref={priorityFilterRef}
          >
            <Flame />
            <p>{paginationTasks.filter.priority.join(", ") || "Priority"}</p>
            <DropdownArrow />
            {paginationTasks.filter.priority?.length > 0 && (
              <div className={styles.indicator} />
            )}
            {priorityFilterOpen && (
              <PriorityFilter
                ref={priorityFilterRef}
                selected={paginationTasks.filter.priority as TaskPriority[]}
                onClick={(priority) => {
                  if (paginationTasks.filter.priority.includes(priority)) {
                    dispatch(
                      setPaginationTasks({
                        ...paginationTasks,
                        filter: {
                          ...paginationTasks.filter,
                          priority: paginationTasks.filter.priority.filter(
                            (s) => s !== priority
                          ),
                        },
                      })
                    );
                    return;
                  }
                  dispatch(
                    setPaginationTasks({
                      ...paginationTasks,
                      filter: {
                        ...paginationTasks.filter,
                        priority: [
                          ...paginationTasks.filter.priority,
                          priority,
                        ],
                      },
                    })
                  );
                }}
              />
            )}
          </div>
          <div
            className={styles.status}
            onClick={() => setStatusFilterOpen(!statusFilterOpen)}
            ref={statusFilterRef}
          >
            <Target />
            <p>{paginationTasks.filter.status.join(", ") || "Status"}</p>
            <DropdownArrow />
            {paginationTasks.filter.status?.length > 0 && (
              <div className={styles.indicator} />
            )}
            {statusFilterOpen && (
              <StatusFilter
                ref={statusFilterRef}
                selected={paginationTasks.filter.status as TaskStatus[]}
                onClick={(status) => {
                  if (paginationTasks.filter.status.includes(status)) {
                    dispatch(
                      setPaginationTasks({
                        ...paginationTasks,
                        filter: {
                          ...paginationTasks.filter,
                          status: paginationTasks.filter.status.filter(
                            (s) => s !== status
                          ),
                        },
                      })
                    );
                    return;
                  }
                  dispatch(
                    setPaginationTasks({
                      ...paginationTasks,
                      filter: {
                        ...paginationTasks.filter,
                        status: [...paginationTasks.filter.status, status],
                      },
                    })
                  );
                }}
              />
            )}
          </div>
          <div
            className={styles.users}
            onClick={() => setUserFilterOpen((prev) => !prev)}
            ref={userFilterRef}
          >
            <User fill="#162029" />
            <p>Users ({paginationTasks.filter.users.length})</p>
            <DropdownArrow />
            {paginationTasks.filter.users?.length > 0 && (
              <div className={styles.indicator} />
            )}
            {userFilterOpen && (
              <UserFilter
                allUsers={allUsers}
                ref={userFilterRef}
                selectedUsers={paginationTasks.filter.users}
                onSelect={(userId) => {
                  if (paginationTasks.filter.users.includes(userId)) {
                    dispatch(
                      setPaginationTasks({
                        ...paginationTasks,
                        filter: {
                          ...paginationTasks.filter,
                          users: paginationTasks.filter.users.filter(
                            (u) => u !== userId
                          ),
                        },
                      })
                    );
                    return;
                  }
                  dispatch(
                    setPaginationTasks({
                      ...paginationTasks,
                      filter: {
                        ...paginationTasks.filter,
                        users: [...paginationTasks.filter.users, userId],
                      },
                    })
                  );
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div
            className={styles.sort}
            onClick={() => setSortModalOpen(!sortModalOpen)}
            ref={sortRef}
          >
            <Sort />
            <p>Sort by</p>
            {sortModalOpen && (
              <SortBy
                ref={sortRef}
                selected={paginationTasks.sortBy}
                onClick={(name: string) => {
                  if (name === paginationTasks.sortBy) {
                    dispatch(
                      setPaginationTasks({
                        ...paginationTasks,
                        sortOrder:
                          paginationTasks.sortOrder === "asc" ? "desc" : "asc",
                      })
                    );
                    setSortModalOpen(false);
                    return;
                  }
                  dispatch(
                    setPaginationTasks({
                      ...paginationTasks,
                      sortBy: name,
                      sortOrder: "asc",
                    })
                  );
                  setSortModalOpen(false);
                }}
              />
            )}
          </div>
          <div
            onClick={() => setAddTaskVisible(true)}
            className={styles.add_task}
          >
            <Add />
            <p>Add task</p>
          </div>
        </div>
      </div>
      <div className={styles.tasks_section}>
        <TaskHeader />
        <div className={styles.task_container}>
          {paginationTasks?.tasks[paginationTasks.currentPage]?.map?.(
            (task, idx) => (
              <Fragment key={task.id}>
                <TaskRow
                  title={task.title}
                  status={task.status}
                  createdAt={
                    typeof task.createdAt === "string"
                      ? task.createdAt
                      : task.createdAt
                      ? task.createdAt.toISOString()
                      : ""
                  }
                  dueDate={
                    typeof task.dueDate === "string"
                      ? task.dueDate
                      : task.dueDate
                      ? task.dueDate.toISOString()
                      : ""
                  }
                  priority={task.priority}
                  key={task.id}
                  assignedTo={task.users}
                  attachedDocuments={task?.attachedDocuments}
                  description={task?.description || undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setSelectedTask(task));
                  }}
                />
                {idx !==
                  (paginationTasks.tasks[paginationTasks.currentPage]?.length ||
                    0) -
                    1 && <div className={styles.line} />}
              </Fragment>
            )
          )}
        </div>
      </div>
      <div className={styles.pagination}>
        <div className={styles.icon}>
          <ArrowLeft className={styles.arrow} />
        </div>
        {Array.from(
          { length: paginationTasks.totalPages || 0 },
          (_, i) => i + 1
        ).map((page) => (
          <div
            key={page}
            onClick={() => {
              dispatch(
                setPaginationTasks({
                  ...paginationTasks,
                  currentPage: page,
                })
              );
            }}
            className={`${styles.page} ${
              paginationTasks.currentPage === page ? styles.active : ""
            }`}
          >
            <p>{page}</p>
          </div>
        ))}
        <div className={styles.icon}>
          <ArrowLeft className={styles.arrow2} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
