"use client";

import { useState } from "react";
import { Alert, Box } from "@mui/material";
import { boxStyle } from "@/utils/functions";
import { defaultTableParams } from "@/utils/defaults";
import { ColumnProps, SupplierProps } from "@/utils/props";
import SupplierRow from "./SupplierRow";
import { Search } from "@mui/icons-material";
import ManageTable from "../ManageTable";
import FormInput from "../FormInput";
import { useFetchData } from "@/utils/hooks";

const ManageSuppliers = () => {
  const [params, setParams] = useState(defaultTableParams);

  const {
    data: suppliers,
    count,
    loading,
    error,
  } = useFetchData("/api/suppliers", params);

  const [notice, setNotice] = useState(error);

  const deleteSupplier = async (id: string) => {
    const response = await fetch(`/api/suppliers/${id}`, {
      method: "DELETE",
    });
    const jsonResponse = await response.json();
    if (jsonResponse.error) {
      setNotice({
        message: `${jsonResponse.error} ${jsonResponse?.message}`.trim(),
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
    { id: "email", label: "Email", sortable: true },
    { id: "address", label: "Address", sortable: true },
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
        length={suppliers.length}
        params={params}
        setParams={setParams}
        isLoading={loading}
        ariaTable="Suppliers Table"
        labelRowsPerPage="Suppliers per page"
        noRecordsLabel="No suppliers found!"
        rows={suppliers.map((supplier: SupplierProps) => (
          <SupplierRow
            key={supplier._id}
            supplier={supplier}
            deleteCallback={deleteSupplier}
          />
        ))}
      />
    </Box>
  );
};

export default ManageSuppliers;
