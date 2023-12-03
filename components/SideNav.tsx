"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Url } from "next/dist/shared/lib/router/router";
import {
  Analytics,
  ArrowBackIos,
  Assessment,
  Dashboard,
  Groups,
  Medication,
  People,
  RequestQuote,
  Search,
} from "@mui/icons-material";

const SideNav = () => {
  interface MenuItem {
    key?: null;
    text: String;
    href?: Url;
    icon?: ReactNode;
    items?: MenuItem[];
  }

  const iconSize = 20;

  const menuItems: MenuItem[] = [
    {
      text: "Dashboard",
      href: "/",
      icon: <Dashboard sx={{ fontSize: iconSize }} />,
    },
    {
      text: "Invoices",
      icon: <RequestQuote sx={{ fontSize: iconSize }} />,
      items: [
        { text: "New Invoice", href: "/invoices/new" },
        { text: "Manage Invoice", href: "/invoices" },
      ],
    },
    {
      text: "Customers",
      icon: <People sx={{ fontSize: iconSize }} />,
      items: [
        { text: "Add Customer", href: "/customers/add" },
        { text: "Manage Customer", href: "/customers" },
      ],
    },
    {
      text: "Medicines",
      icon: <Medication sx={{ fontSize: iconSize }} />,
      items: [
        { text: "Add Medicine", href: "/medicines/add" },
        { text: "Manage Medicine", href: "/medicines" },
        { text: "Manage Medicine Stock", href: "/medicines/stock" },
      ],
    },
    {
      text: "Suppliers",
      icon: <Groups sx={{ fontSize: iconSize }} />,
      items: [
        { text: "Add Supplier", href: "/suppliers/add" },
        { text: "Manage Supplier", href: "/suppliers" },
      ],
    },
    {
      text: "Purchases",
      icon: <Analytics sx={{ fontSize: iconSize }} />,
      items: [
        { text: "Add Purchase", href: "/purchases/add" },
        { text: "Manage Purchase", href: "/purchases" },
      ],
    },
    {
      text: "Reports",
      icon: <Assessment sx={{ fontSize: iconSize }} />,
      items: [
        { text: "Sales Report", href: "/reports/sales" },
        { text: "Purchase Report", href: "/reports/purchase" },
      ],
    },
    {
      text: "Search",
      icon: <Search sx={{ fontSize: iconSize }} />,
      items: [
        { text: "Invoice", href: "/invoices" },
        { text: "Customer", href: "/customers" },
        { text: "Medicine", href: "/medicines" },
        { text: "Supplier", href: "/suppliers" },
        { text: "Purchase", href: "/purchases" },
      ],
    },
  ];

  interface MenuTagProps {
    item: MenuItem;
    children: ReactNode;
    onClick: () => void;
  }

  const MenuTag = ({ item, children, onClick }: MenuTagProps) => {
    return item?.href ? (
      <Link className="link" href={item?.href} onClick={onClick}>
        {children}
      </Link>
    ) : (
      <span className="link" onClick={onClick}>
        {children}
      </span>
    );
  };

  const RenderMenuItem = (item: MenuItem) => {
    const [open, setOpen] = useState(false);
    return (
      <li
        key={`${item.text}-${item.href}`}
        className={`nav-item ${item?.items ? "" : "treeview-item"} ${
          open ? "expanded" : ""
        }`}
      >
        <MenuTag item={item} onClick={() => setOpen(!open)}>
          {item.icon}
          <span className="title">{item.text}</span>
          {item.items && (
            <ArrowBackIos
              className="expand"
              style={{ fontSize: 16, rotate: open ? "-90deg" : "0deg" }}
            />
          )}
        </MenuTag>
        {item.items && (
          <ul className={`nav-items treeview-items`}>
            {item.items.map((item: MenuItem) => RenderMenuItem(item))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className="side-nav">
      <div className="nav-content">
        <div className="nav-body">
          <div className="logo pt-5 pb-4">
            <Image
              className="profile"
              src="/images/prof.jpg"
              width={100}
              height={100}
              alt="Profile"
            />
            <h1 className="logo-caption">Admin</h1>
          </div>
          {/* logo class */}
          <ul className="nav-items">
            {menuItems.map((item: MenuItem) => RenderMenuItem(item))}
          </ul>
        </div>
        {/* card-body class */}
      </div>
      {/* card  */}
    </nav>
  );
};

export default SideNav;
