"use client";

import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";
import { ColumnProps, MedicineProps } from "@/utils/props";
import MedicineRow from "./MedicineRow";
import { apiGet, boxStyle, getNotice } from "@/utils/functions";
import { Search } from "@mui/icons-material";
import { defaultTableParams } from "@/utils/defaults";
import ManageTable from "../ManageTable";
import FormInput from "../FormInput";

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState(getNotice());
  const [params, setParams] = useState(defaultTableParams);

  const loadMedicines = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams(params);
    const response = await apiGet(`/api/medicines?${searchParams}`);
    if (response.medicines) {
      setMedicines(response.medicines ?? []);
      setCount(response?.count);
    } else {
      setNotice({
        message: response.error,
        severity: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedicines();
  }, [params]);

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
    loadMedicines();
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
