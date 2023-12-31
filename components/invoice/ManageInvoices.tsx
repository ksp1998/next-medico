"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Alert, Box, IconButton, SelectChangeEvent } from "@mui/material";
import { ColumnProps, InvoiceProps } from "@/utils/props";
import { boxStyle, getCustomers, getNotice } from "@/utils/functions";
import { defaultTableParams } from "@/utils/defaults";
import InvoiceRow from "./InvoiceRow";
import ManageTable from "../ManageTable";
import FormInput from "../FormInput";
import { DateRange, Numbers, People, Sync } from "@mui/icons-material";
import AutoCompleteInput from "../AutoCompleteInput";
import { useFetchData } from "@/utils/hooks";

const ManageInvoices = () => {
  const [params, setParams] = useState(defaultTableParams);

  const {
    data: invoices,
    count,
    loading,
    error: notice,
  } = useFetchData("/api/invoices", params);

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    (async () => setCustomers(await getCustomers()))();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const columns: ColumnProps[] = [
    { id: "invoiceNumber", label: "Invoice Number", sortable: true },
    { id: "invoice", label: "Customer", sortable: true },
    { id: "paymentType", label: "Payment Type", sortable: true },
    { id: "subtotal", label: "Subtotal", sortable: true },
    { id: "discount", label: "Discount", sortable: true },
    { id: "total", label: "Total", sortable: true },
    { id: "date", label: "Date", sortable: true },
    { id: "action", label: "Action", align: "center" },
  ];

  return (
    <Box sx={boxStyle()}>
      {notice.message && (
        <Alert sx={{ mb: 2 }} severity={notice.severity}>
          {notice.message}
        </Alert>
      )}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <div className="row col col-md-12">
          <div className="col col-12 col-md-6 col-xl-3 form-group">
            <FormInput
              label="Invoice Number"
              type="number"
              name="invoiceNumber"
              value={params?.invoiceNumber}
              onChange={handleChange}
              startIcon={<Numbers />}
            />
          </div>
          <div className="col col-12 col-md-6 col-xl-3 form-group">
            <AutoCompleteInput
              label="Customer"
              noOptionsText="No customers"
              value={params.customer}
              options={customers}
              setInputOption={(value) =>
                !value && setParams((prev) => ({ ...prev, customer: "" }))
              }
              setOption={(option) =>
                option &&
                setParams((prev) => ({
                  ...prev,
                  customer: option?.id ?? "",
                }))
              }
              startIcon={<People />}
            />
          </div>

          <div className="col col-10 col-md-6 col-xl-3 form-group">
            <FormInput
              label="Invoice Date"
              type="date"
              name="invoiceDate"
              value={params?.invoiceDate}
              onChange={handleChange}
              startIcon={<DateRange />}
            />
          </div>

          <div className="col col-2 form-group">
            <IconButton
              size="large"
              color="success"
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  invoiceNumber: "",
                  customer: "",
                  invoiceDate: "",
                }))
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
        ariaTable="Invoices Table"
        labelRowsPerPage="Invoices per page"
        noRecordsLabel="No invoices found!"
        rows={invoices.map((invoice: InvoiceProps) => (
          <InvoiceRow key={invoice._id} invoice={invoice} />
        ))}
      />
    </Box>
  );
};

export default ManageInvoices;
