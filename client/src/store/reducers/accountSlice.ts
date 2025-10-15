import { createSlice } from "@reduxjs/toolkit";

import { SLICE_NAMES } from "../../constants/enums";
import type { RootState } from "..";

type AccountSlice = {
  allUsers: { id: string; name: string }[];
};

const initialState: AccountSlice = {
  allUsers: [],
};

const accountSlice = createSlice({
  name: SLICE_NAMES.ACCOUNT,
  initialState,
  reducers: {
    setAllUsers: (state, actions) => {
      return {
        ...state,
        allUsers: actions.payload,
      };
    },
  },
});

export const selectAllUsers = (state: RootState) => state.account.allUsers;

export const { setAllUsers } = accountSlice.actions;

export default accountSlice.reducer;
