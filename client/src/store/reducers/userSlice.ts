import { createSlice } from "@reduxjs/toolkit";

import { SLICE_NAMES } from "../../constants/enums";
import type { RootState } from "..";

type UserSlice = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
} | null;

const initialState: UserSlice = localStorage.getItem(SLICE_NAMES.USER)
  ? JSON.parse(localStorage.getItem(SLICE_NAMES.USER) || "")
  : null;

const userSlice = createSlice({
  name: SLICE_NAMES.USER,
  initialState,
  reducers: {
    setUser: (state, actions) => {
      // set local storage
      localStorage.setItem(SLICE_NAMES.USER, JSON.stringify(actions.payload));

      // set state
      return {
        ...state,
        ...actions.payload,
      };
    },
    setPartialUser: (state, actions) => {
      if (!state) return;
      localStorage.setItem(SLICE_NAMES.USER, JSON.stringify(state));
      return {
        ...state,
        user: actions.payload,
      };
    },
    logoutUser: (_state, _action) => {
      // remove local storage
      localStorage.removeItem(SLICE_NAMES.USER);
      localStorage.removeItem("admin");
      // set state
      return null;
    },
  },
});

export const selectUser = (state: RootState) => state.user?.user;
export const selectCompleteUser = (state: RootState) => state.user;

export const { setUser, logoutUser, setPartialUser } = userSlice.actions;

export default userSlice.reducer;
