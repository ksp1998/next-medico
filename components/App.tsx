"use client";

import { ThemeProvider } from "@/utils/contexts";
import SideNav from "./SideNav";
import { ReactNode } from "react";
import { useTheme } from "@/utils/hooks";

interface Props {
  children: ReactNode;
  session: any;
  fontClass: string;
}

const App = ({ session, fontClass, children }: Props) => {
  return (
    <ThemeProvider>
      {session && <SideNav />}
      <Main {...{ session, fontClass }}>{children}</Main>
    </ThemeProvider>
  );
};

const Main = ({ session, fontClass, children }: Props) => {
  const { theme } = useTheme();

  return (
    <main
      className={`${fontClass} ${
        session ? "container-fluid logged-in" : "logged-out"
      } ${theme}-theme`}
    >
      {children}
    </main>
  );
};

export default App;
