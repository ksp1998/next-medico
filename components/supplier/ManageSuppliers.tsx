"use client";

import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";
import { apiGet, boxStyle, getNotice } from "@/utils/functions";
import { defaultTableParams } from "@/utils/defaults";
import { ColumnProps, SupplierProps } from "@/utils/props";
import SupplierRow from "./SupplierRow";
import { Search } from "@mui/icons-material";
import ManageTable from "../ManageTable";
import FormInput from "../FormInput";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState(getNotice());
  const [params, setParams] = useState(defaultTableParams);

  const loadSuppliers = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams(params);
    const response = await apiGet(`/api/suppliers?${searchParams}`);
    if (response.suppliers) {
      setSuppliers(response.suppliers ?? []);
      setCount(response?.count);
      setNotice(getNotice());
    } else {
      setNotice({
        message: response.message,
        severity: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSuppliers();
  }, [params]);

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
    loadSuppliers();
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
