"use client";

import { useState } from "react";
import { Alert, Box } from "@mui/material";
import { ColumnProps, MedicineProps } from "@/utils/props";
import MedicineRow from "./MedicineRow";
import { boxStyle } from "@/utils/functions";
import { Search } from "@mui/icons-material";
import { defaultTableParams } from "@/utils/defaults";
import ManageTable from "../ManageTable";
import FormInput from "../FormInput";
import { useFetchData } from "@/utils/hooks";

const ManageMedicines = () => {
  const [params, setParams] = useState(defaultTableParams);

  const {
    data: medicines,
    count,
    loading,
    error,
  } = useFetchData("/api/medicines", params);

  const [notice, setNotice] = useState(error);

  const deleteMedicine = async (id: string) => {
    const response = await fetch(`/api/medicines/${id}`, {
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
    { id: "packing", label: "Packing", sortable: true },
    { id: "genericName", label: "Generic name", sortable: true },
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
        <div className="col col-12 col-md-6 col-lg-4 col-xl-3 form-group">
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
        length={medicines.length}
        params={params}
        setParams={setParams}
        isLoading={loading}
        ariaTable="Medicines Table"
        labelRowsPerPage="Medicines per page"
        noRecordsLabel="No medicines found!"
        rows={medicines.map((medicine: MedicineProps) => (
          <MedicineRow
            key={medicine._id}
            medicine={medicine}
            deleteCallback={deleteMedicine}
          />
        ))}
      />
    </Box>
  );
};

export default ManageMedicines;
