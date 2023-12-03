import { Box } from "@mui/material";
import Link from "next/link";

import { boxStyle } from "@/utils/functions";
import { DashboardSectionProps } from "@/utils/props";
import {
  Analytics,
  Assessment,
  Groups,
  Medication,
  People,
  RequestQuote,
} from "@mui/icons-material";

const DashboardCards = () => {
  const iconStyle = { fontSize: 64 };

  const cards: DashboardSectionProps[] = [
    {
      icon: <RequestQuote style={iconStyle} />,
      title: "Create New Invoice",
      href: "/invoices/new",
    },
    {
      icon: <People style={iconStyle} />,
      title: "Add New Customer",
      href: "/customers/add",
    },
    {
      icon: <Medication style={iconStyle} />,
      title: "Add New Medicine",
      href: "/medicines/add",
    },
    {
      icon: <Groups style={iconStyle} />,
      title: "Add New Supplier",
      href: "/suppliers/add",
    },
    {
      icon: <Analytics style={iconStyle} />,
      title: "Add New Purchase",
      href: "/purchases/add",
    },
    {
      icon: <Assessment style={iconStyle} />,
      title: "Sales Report",
      href: "/reports/sales",
    },
    {
      icon: <Assessment style={iconStyle} />,
      title: "Purchase Report",
      href: "/reports/purchase",
    },
  ];

  return (
    <Box sx={boxStyle({ display: "flex", flexWrap: "wrap" })}>
      {cards.map((card: DashboardSectionProps, i) => (
        <div key={i} className="col-xs-12 col-sm-6 col-md-3 col-lg-3 p-2">
          <Link
            className="d-block text-decoration-none p-3 pt-4 pb-4 rounded dashboard-stats"
            href={card.href ?? "#"}
          >
            <div className="text-center text-dark">
              <span className="d-block mb-3">{card.icon}</span>
              <div className="h5">{card.title}</div>
            </div>
          </Link>
        </div>
      ))}
    </Box>
  );
};

export default DashboardCards;
