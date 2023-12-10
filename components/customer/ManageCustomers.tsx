"use client";

import { useState } from "react";
import { Alert, Box } from "@mui/material";
import { ColumnProps, CustomerProps } from "@/utils/props";
import CustomerRow from "./CustomerRow";
import { boxStyle } from "@/utils/functions";
import { Search } from "@mui/icons-material";
import { defaultTableParams } from "@/utils/defaults";
import ManageTable from "../ManageTable";
import FormInput from "../FormInput";
import { useFetchData } from "@/utils/hooks";

const ManageCustomers = () => {
  const [params, setParams] = useState(defaultTableParams);

  const {
    data: customers,
    count,
    loading,
    error,
  } = useFetchData("/api/customers", params);

  const [notice, setNotice] = useState(error);

  const deleteCustomer = async (id: string) => {
    const response = await fetch(`/api/customers/${id}`, {
      method: "DELETE",
    });
    const jsonResponse = await response.json();
    if (jsonResponse.error) {
      setNotice({
        message: jsonResponse.error,
        severity: "error",
      });
      return;
    }

    setNotice({
      message: jsonResponse.message,
      severity: "success",
    });

    setParams((prev) => ({ ...prev }));
  };

  const columns: ColumnProps[] = [
    { id: "name", label: "Name", sortable: true },
    { id: "number", label: "Contact", sortable: true },
    { id: "address", label: "Address", sortable: true },
    { id: "doctorName", label: "Dr. Name", sortable: true },
    { id: "doctorAddress", label: "Dr. Address", sortable: true },
    { id: "createdAt", label: "Added On", sortable: true },
    { id: "action", label: "Action", align: "center" },
  ];

  return (
    <Box sx={boxStyle()}>
      {notice.message && (
        <Alert sx={{ mb: 2 }} severity={notice.severity}>
          {notice.message}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex", justifyContent: "end" }}>
        <div className="col col-md-3 form-group">
          <FormInput
            label="Search"
            type="search"
            name="search"
            value={params?.search}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, search: e.target.value }))
            }
            startIcon={<Search />}
          />
        </div>
      </Box>

      <ManageTable
        count={count}
        columns={columns}
        length={customers.length}
        params={params}
        setParams={setParams}
        isLoading={loading}
        ariaTable="Customers Table"
        labelRowsPerPage="Customers per page"
        noRecordsLabel="No customers found!"
        rows={customers.map((customer: CustomerProps) => (
          <CustomerRow
            key={customer._id}
            customer={customer}
            deleteCallback={deleteCustomer}
          />
        ))}
      />
    </Box>
  );
};

export default ManageCustomers;
