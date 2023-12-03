"use client";

import { defaultTableParams } from "@/utils/defaults";
import { apiGet, boxStyle, getNotice } from "@/utils/functions";
import { ColumnProps, InvoiceProps } from "@/utils/props";
import { Alert, Box, IconButton, SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import FormInput from "../FormInput";
import { DateRange, Sync } from "@mui/icons-material";
import ManageTable from "../ManageTable";
import SalesReportRow from "./SalesReportRow";

const SalesReport = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState(getNotice());
  const [params, setParams] = useState(defaultTableParams);
  const [totalSales, setTotalSales] = useState(0);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const loadSales = async () => {
    setLoading(true);
    setNotice(getNotice());
    const searchParams = new URLSearchParams(params);
    const response = await apiGet(`/api/invoices?${searchParams}`);
    if (response.invoices) {
      setInvoices(response?.invoices ?? []);
      setCount(response?.count);
      setTotalSales(response.salesTotal ?? 0);
    } else {
      setNotice({ message: response.error, severity: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSales();
  }, [params]);

  const columns: ColumnProps[] = [
    { id: "#", label: "#" },
    { id: "date", label: "Date", sortable: true },
    { id: "invoiceNumber", label: "Invoice Number", sortable: true },
    { id: "customer", label: "Customer", sortable: true },
    { id: "paymentType", label: "Payment Type", sortable: true },
    { id: "total", label: "Total", sortable: true },
  ];

  return (
    <Box sx={{ ...boxStyle(), marginBottom: 12 }}>
      {notice.message && (
        <Alert sx={{ mb: 2 }} severity={notice.severity}>
          {notice.message}
        </Alert>
      )}

      <Box
        className="row"
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <div className="row col col-md-12">
          <div className="col col-md-3 form-group">
            {" "}
            <FormInput
              label="Start Date"
              type="date"
              name="start"
              value={params?.start}
              onChange={handleChange}
              startIcon={<DateRange />}
            />
          </div>
          <div className="col col-md-3 form-group">
            <FormInput
              label="End Date"
              type="date"
              name="end"
              value={params?.end}
              onChange={handleChange}
              startIcon={<DateRange />}
            />
          </div>

          <div className="col col-md-1 form-group">
            <IconButton
              size="large"
              color="success"
              onClick={() =>
                setParams((prev) => ({ ...prev, start: "", end: "" }))
              }
            >
              <Sync sx={{ fontSize: 32 }} />
            </IconButton>
          </div>
        </div>
      </Box>

      <ManageTable
        count={count}
        columns={columns}
        length={invoices.length}
        params={params}
        setParams={setParams}
        isLoading={loading}
        ariaTable="Sales Report Table"
        noRecordsLabel="No invoices found!"
        rows={invoices.map((invoice: InvoiceProps, i) => (
          <SalesReportRow key={invoice._id} rowNo={i + 1} invoice={invoice} />
        ))}
      />

      <div
        className="mt-4 text-end"
        style={{
          position: "fixed",
          width: "100%",
          margin: 0,
          padding: "1em 2em",
          bottom: 0,
          right: 0,
          background: "#FFF",
          fontWeight: "bold",
        }}
      >
        <h2>
          Total Sales:{" "}
          <span style={{ color: "green" }}>{totalSales.toFixed(2)}</span>
        </h2>
      </div>
    </Box>
  );
};

export default SalesReport;
