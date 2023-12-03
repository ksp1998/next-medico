"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, IconButton } from "@mui/material";
import { ColumnProps, MedicineStockProps } from "@/utils/props";
import {
  apiGet,
  boxStyle,
  getMedicines,
  getNotice,
  getSuppliers,
} from "@/utils/functions";
import MedicineStockRow from "./MedicineStockRow";
import ManageTable from "../ManageTable";
import { defaultTableParams } from "@/utils/defaults";
import { Groups, Medication, Sync } from "@mui/icons-material";
import AutoCompleteInput from "../AutoCompleteInput";

const ManageMedicinesStock = () => {
  const [medicinesStock, setMedicinesStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState(getNotice());
  const [params, setParams] = useState(defaultTableParams);

  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const loadMedicinesStock = async () => {
    setLoading(true);
    const response = await apiGet(
      `/api/medicines/stock?${new URLSearchParams(params)}`
    );
    if (response.medicinesStock) {
      setMedicinesStock(response.medicinesStock ?? []);
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
    (async () => setSuppliers(await getSuppliers()))();
    (async () => setMedicines(await getMedicines()))();
  }, []);

  useEffect(() => {
    setNotice(getNotice());
    loadMedicinesStock();
  }, [params]);

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
          <div className="col col-md-3 form-group">
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

          <div className="col col-md-3 form-group">
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

          <div className="col col-md-2 form-group">
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

          <div className="col col-md-1 form-group d-none">
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
