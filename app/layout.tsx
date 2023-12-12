import SideNav from "@/components/SideNav";
import { Nunito } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "@/styles/globals.scss";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import App from "@/components/App";

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
        <App session={session} fontClass={nunito.className}>
          {children}
        </App>
      </body>
    </html>
  );
}
