"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, IconButton } from "@mui/material";
import { ColumnProps, MedicineStockProps } from "@/utils/props";
import { boxStyle, getMedicines, getSuppliers } from "@/utils/functions";
import MedicineStockRow from "./MedicineStockRow";
import ManageTable from "../ManageTable";
import { defaultTableParams } from "@/utils/defaults";
import { Groups, Medication, Sync } from "@mui/icons-material";
import AutoCompleteInput from "../AutoCompleteInput";
import { useFetchData } from "@/utils/hooks";

const ManageMedicinesStock = () => {
  const [params, setParams] = useState(defaultTableParams);

  const {
    data: medicinesStock,
    count,
    loading,
    error,
  } = useFetchData("/api/medicines/stock", params, "medicinesStock");

  const [notice, setNotice] = useState(error);

  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    (async () => setSuppliers(await getSuppliers()))();
    (async () => setMedicines(await getMedicines()))();
  }, []);

  const columns: ColumnProps[] = [
    { id: "name", label: "Name" },
    { id: "packing", label: "Packing" },
    { id: "genericName", label: "Generic name" },
    { id: "batchId", label: "Batch ID", sortable: true },
    { id: "expiry", label: "Expiry" },
    { id: "supplier", label: "Supplier" },
    { id: "stock", label: "Quantity", sortable: true },
    { id: "mrp", label: "MRP", sortable: true },
    { id: "rate", label: "Rate", sortable: true },
    { id: "invoice", label: "Invoice", sortable: true },
  ];

  return (
    <Box sx={boxStyle()}>
      {notice.message && (
        <Alert sx={{ mb: 2 }} severity={notice.severity}>
          {notice.message}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex" }}>
        <div className="row col col-md-12">
          <div className="col col-12 col-md-6 col-xl-3 form-group">
            <AutoCompleteInput
              label="Medicine"
              options={medicines}
              value={params.medicine}
              setInputOption={(value) =>
                !value && setParams((prev) => ({ ...prev, medicine: "" }))
              }
              setOption={(option) =>
                option &&
                setParams((prev) => ({
                  ...prev,
                  medicine: option?.id ?? "",
                }))
              }
              startIcon={<Medication />}
            />
          </div>

          <div className="col col-12 col-md-6 col-xl-3 form-group">
            <AutoCompleteInput
              label="Supplier"
              options={suppliers}
              value={params.supplier}
              setInputOption={(value) =>
                !value && setParams((prev) => ({ ...prev, supplier: "" }))
              }
              setOption={(option) =>
                option &&
                setParams((prev) => ({
                  ...prev,
                  supplier: option?.id ?? "",
                }))
              }
              startIcon={<Groups />}
            />
          </div>

          <div className="col col-8 col-sm-6 col-md-4 col-lg-3 form-group">
            <Button
              className="w-100"
              variant={params.outOfStock ? "contained" : "outlined"}
              color="info"
              sx={{ pt: 1.8, pb: 1.8 }}
              onClick={() =>
                setParams((prev) => ({ ...prev, outOfStock: !prev.outOfStock }))
              }
            >
              Out of Stock
            </Button>
          </div>

          <div className="col col-2 col-lg-1 form-group d-none">
            <Button
              className="w-100"
              variant={params.expired ? "contained" : "outlined"}
              color="error"
              sx={{ pt: 1.8, pb: 1.8 }}
              onClick={() =>
                setParams((prev) => ({ ...prev, expired: !prev.expired }))
              }
            >
              Expired
            </Button>
          </div>

          <div className="col col-md-1 form-group">
            <IconButton
              size="large"
              color="success"
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  search: "",
                  supplier: "",
                  outOfStock: false,
                  expired: false,
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
        length={medicinesStock.length}
        params={params}
        setParams={setParams}
        isLoading={loading}
        ariaTable="Stocks Table"
        labelRowsPerPage="Stock per page"
        noRecordsLabel="No stock found!"
        rows={medicinesStock.map((medicineStock: MedicineStockProps) => (
          <MedicineStockRow
            key={medicineStock._id}
            medicineStock={medicineStock}
          />
        ))}
      />
    </Box>
  );
};

export default ManageMedicinesStock;
