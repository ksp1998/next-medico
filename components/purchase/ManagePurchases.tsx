"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Alert, Box, IconButton, SelectChangeEvent } from "@mui/material";
import { boxStyle, getSuppliers } from "@/utils/functions";
import {
  defaultPaymentStatusesOptions,
  defaultTableParams,
} from "@/utils/defaults";
import { ColumnProps, OptionProps, PurchaseProps } from "@/utils/props";
import PurchaseRow from "./PurchaseRow";
import ManageTable from "../ManageTable";
import AutoCompleteInput from "../AutoCompleteInput";
import { DateRange, Groups, Sync } from "@mui/icons-material";
import FormInput from "../FormInput";
import { useFetchData } from "@/utils/hooks";

const ManagePurchases = () => {
  const [params, setParams] = useState(defaultTableParams);

  const {
    data: purchases,
    count,
    loading,
    error: notice,
  } = useFetchData("/api/purchases", params);

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    (async () => setSuppliers(await getSuppliers()))();
  }, []);

  const setSupplier = (option: OptionProps) => {
    setParams((prev) => ({ ...prev, supplier: option?.id ?? "" }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const columns: ColumnProps[] = [
    { id: "invoiceNumber", label: "Invoice Number", sortable: true },
    { id: "supplier", label: "Supplier", sortable: true },
    { id: "amount", label: "Amount", sortable: true },
    { id: "paymentStatus", label: "Payment Status", sortable: true },
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
            <AutoCompleteInput
              label="Supplier"
              options={suppliers}
              value={params.supplier}
              setOption={setSupplier}
              startIcon={<Groups />}
            />
          </div>

          <div className="col col-12 col-md-6 col-xl-3 form-group">
            <FormInput
              label="Purchase Date"
              type="date"
              name="invoiceDate"
              value={params.invoiceDate}
              onChange={handleChange}
              startIcon={<DateRange />}
            />
          </div>

          <div className="col col-10 col-md-6 col-xl-3 form-group">
            <FormInput
              label="Payment Status"
              type="select"
              name="paymentStatus"
              value={params.paymentStatus}
              options={defaultPaymentStatusesOptions}
              onChange={handleChange}
            />
          </div>

          <div className="col col-2 form-group">
            <IconButton
              size="large"
              color="success"
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  supplier: "",
                  invoiceDate: "",
                  paymentStatus: "",
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
        length={purchases.length}
        params={params}
        setParams={setParams}
        isLoading={loading}
        ariaTable="Purchase Table"
        labelRowsPerPage="Purchase per page"
        noRecordsLabel="No purchases found!"
        rows={purchases.map((purchase: PurchaseProps) => (
          <PurchaseRow key={purchase._id} purchase={purchase} />
        ))}
      />
    </Box>
  );
};

export default ManagePurchases;
