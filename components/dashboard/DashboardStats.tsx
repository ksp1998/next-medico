"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { boxStyle } from "@/utils/functions";
import DashboardStatsCard from "./DashboardStatsCard";
import { DashboardSectionProps } from "@/utils/props";
import { useEffect, useState } from "react";

const defaultReports = {
  sale: { totalAmount: 0 },
  purchase: { totalAmount: 0 },
};

const DashboardStats = () => {
  const [reports, setReports] = useState({
    today: defaultReports,
    all: defaultReports,
  });

  useEffect(() => {
    (async () => {
      let response = await fetch("api/reports?today=1");
      const today = await response.json();

      response = await fetch("api/reports");
      const all = await response.json();

      setReports({ today, all });
    })();
  }, []);

  const cards: DashboardSectionProps[] = [
    {
      title: "Total Customer",
      api: "api/customers",
      href: "customers",
    },
    {
      title: "Total Supplier",
      api: "api/suppliers",
      href: "suppliers",
    },
    {
      title: "Total Medicine",
      api: "api/medicines",
      href: "medicines",
    },
    {
      title: "Out of Stock",
      api: "api/medicines/stock?outOfStock=true",
      href: "medicines/stock?type=out_of_stock",
    },
    {
      title: "Expired",
      // api: "api/medicines/stock?expired=true",
      href: "medicines/stock?type=expired",
    },
    { title: "Total Invoice", api: "api/invoices", href: "invoices" },
  ];

  return (
    <Box sx={boxStyle()}>
      <div className="row rounded gap-2 p-2">
        <div className="row col col-xs-8 col-sm-8 col-md-8 col-lg-8">
          {cards.map((card: DashboardSectionProps, i) => (
            <DashboardStatsCard key={i} card={card} />
          ))}
        </div>

        <div className="col col-xs-4 col-sm-4 col-md-4 col-lg-4 flex-grow-1">
          <TableContainer
            className="mt-2 rounded overflow-hidden todays-report text-bold"
            sx={{ td: { fontWeight: "bold", fontSize: 18 } }}
          >
            <Table aria-label="Today's report">
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ fontSize: 22, fontWeight: "bold", padding: 3 }}
                  >
                    Today&apos;s Report
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Sales</TableCell>
                  <TableCell className="text-success">
                    Rs. {reports.today.sale.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Purchase</TableCell>
                  <TableCell className="text-danger">
                    Rs. {reports.today.purchase.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Box>
  );
};

export default DashboardStats;
