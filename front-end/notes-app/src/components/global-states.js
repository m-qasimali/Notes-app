import React from "react";
import { createGlobalState } from "react-hooks-global-state";

const initialState = { isLoggedIn: false, user: null };
export const { useGlobalState } = createGlobalState(initialState);
