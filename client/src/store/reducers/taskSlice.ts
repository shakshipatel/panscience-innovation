import { createSlice } from "@reduxjs/toolkit";
import { SLICE_NAMES } from "../../constants/enums";
import type { RootState } from "..";
import type { Task } from "../../types";

type TaskSlice = {
  allTasks: Task[];
  allDocs: string[];
  selectedTask: Task | null;
  paginationTasks: {
    tasks: Record<number, Task[]>,
    totalPages: number,
    currentPage: number,
    filter: {
      status: string[];
      priority: string[];
      users: string[];
    }
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }
}

const initialState: TaskSlice = {
  allTasks: [],
  selectedTask: null,
  allDocs: [],
  paginationTasks: {
    tasks: {
      1: [],
    },
    totalPages: 1,
    currentPage: 1,
    filter: {
      status: [],
      priority: [],
      users: [],
    },
    sortBy: "createdAt",
    sortOrder: "desc",
  },
}

const taskSlice = createSlice({
  name: SLICE_NAMES.TASK,
  initialState,
  reducers: {
    setAllTasks: (state, actions) => {
      return {
        ...state,
        allTasks: actions.payload,
      }
    },
    setPaginationTasks: (state, actions) => {
      return {
        ...state,
        paginationTasks: actions.payload
      }
    },
    setAllDocs: (state, actions) => {
      return {
        ...state,
        allDocs: actions.payload,
      }
    },
    setSelectedTask: (state, actions) => {
      return {
        ...state,
        selectedTask: actions.payload,
      }
    }
  }
})

export const selectAllTasks = (state: RootState) => state.task.allTasks;
export const selectPaginationTasks = (state: RootState) => state.task.paginationTasks;
export const selectAllDocs = (state: RootState) => state.task.allDocs;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;

export const { setAllTasks, setPaginationTasks, setAllDocs, setSelectedTask } = taskSlice.actions;

export default taskSlice.reducer;
