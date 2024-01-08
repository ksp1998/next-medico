"use client";

import { useTheme } from "@/utils/hooks";
import {
  DarkMode,
  LightMode,
  Logout,
  ManageAccounts,
  Password,
  Settings,
} from "@mui/icons-material";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ReactNode, useState } from "react";

interface Props {
  icon?: ReactNode;
  heading: String;
  subHeading?: String;
}

const Header = ({ icon, heading, subHeading }: Props) => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <header
        className="row content-header bg-white m-0 align-items-center"
        style={{ padding: "1em", borderBottom: "2px solid red" }}
      >
        <div className="col-10">
          <div className="d-flex align-items-center gap-2">
            {icon}
            <div className="d-flex flex-column">
              <h1 className="h4 m-0">{heading}</h1>
              <h6 className="h6 m-1">{subHeading}</h6>
            </div>
          </div>
        </div>
        <nav className="col-2 header-nav d-flex justify-content-end">
          <button
            className="col col-md-1 nav-item m-3"
            onClick={() => setOpen(!open)}
          >
            <Settings sx={{ fontSize: 32 }} />
          </button>
          <button className="col col-md-1 nav-item m-3" onClick={toggleTheme}>
            {theme === "dark" ? (
              <LightMode sx={{ fontSize: 32, color: "yellow" }} />
            ) : (
              <DarkMode sx={{ fontSize: 32, color: "darkblue" }} />
            )}
          </button>
          {open && (
            <ul className="nav-items list-unstyled">
              <li className="nav-item m-3">
                <Link
                  href="/profile"
                  className="d-flex align-items-center gap-2"
                >
                  <ManageAccounts sx={{ fontSize: 20 }} />
                  <span>My Profile</span>
                </Link>
              </li>
              <li className="nav-item m-3">
                <Link
                  href="/profile#change-password"
                  className="d-flex align-items-center gap-2"
                >
                  <Password sx={{ fontSize: 20 }} />
                  <span>Change Password</span>
                </Link>
              </li>
              <li className="nav-item m-3">
                <Link
                  href={"#"}
                  className="d-flex align-items-center gap-2"
                  onClick={() => signOut()}
                >
                  <Logout sx={{ fontSize: 20 }} />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
