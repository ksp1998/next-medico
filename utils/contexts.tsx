"use client";

import { ReactNode, createContext, useState } from "react";

const ThemeContext = createContext<any>(null);

interface Props {
  children: ReactNode;
}

const ThemeProvider = ({ children }: Props) => {
  const local = typeof window !== "undefined";
  const [theme, setTheme] = useState(
    (local && localStorage.getItem("theme")) ?? "light"
  );

  const toggleTheme = () => {
    setTheme((theme) => {
      theme = theme === "dark" ? "light" : "dark";
      local && localStorage.setItem("theme", theme);
      return theme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
