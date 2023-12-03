"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { DateRange, Sync } from "@mui/icons-material";
import { Alert, Box, IconButton, SelectChangeEvent } from "@mui/material";
import { defaultTableParams } from "@/utils/defaults";
import { ColumnProps, PurchaseProps } from "@/utils/props";
import { apiGet, boxStyle, getNotice } from "@/utils/functions";
import FormInput from "../FormInput";
import ManageTable from "../ManageTable";
import PurchaseReportRow from "./PurchaseReportRow";

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState(getNotice());
  const [params, setParams] = useState(defaultTableParams);
  const [totalPurchase, setTotalPurchase] = useState(0);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const loadPurchases = async () => {
    setLoading(true);
    setNotice(getNotice());
    const searchParams = new URLSearchParams(params);
    const response = await apiGet(`/api/purchases?${searchParams}`);
    if (response.purchases) {
      setPurchases(response?.purchases ?? []);
      setCount(response?.count);
      setTotalPurchase(response?.salesTotal ?? 0);
    } else {
      setNotice({ message: response.error, severity: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPurchases();
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
        length={purchases.length}
        params={params}
        setParams={setParams}
        isLoading={loading}
        ariaTable="Purchase Report Table"
        noRecordsLabel="No purchases found!"
        rows={purchases.map((purchase: PurchaseProps, i) => (
          <PurchaseReportRow
            key={purchase._id}
            rowNo={i + 1}
            purchase={purchase}
          />
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
          borderTop: "1px solid lightgray",
        }}
      >
        <h2>
          Total Sales:{" "}
          <span style={{ color: "green" }}>{totalPurchase.toFixed(2)}</span>
        </h2>
      </div>
    </Box>
  );
};

export default PurchaseReport;
