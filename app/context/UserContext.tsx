"use client";

import { createContext, useContext } from "react";

export const UserContext = createContext<{ username: string }>({ username: "Guest" });

export const useUser = () => useContext(UserContext);
