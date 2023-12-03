import SideNav from "@/components/SideNav";
import { Nunito } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "@/styles/globals.scss";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
});

interface Props {
  children: ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        {session && <SideNav />}
        <main
          className={`${nunito.className} ${
            session ? "container-fluid logged-in" : "logged-out"
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
