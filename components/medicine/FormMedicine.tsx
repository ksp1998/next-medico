"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ErrorProps, InputProps, MedicineProps } from "@/utils/props";
import { boxStyle, getNotice, validate } from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent, Skeleton } from "@mui/material";
import { Inventory, Medication, Vaccines } from "@mui/icons-material";
import RenderInputs from "../RenderInputs";
import { defaultMedicine } from "@/utils/defaults";

interface Props {
  initialMedicine?: MedicineProps;
  medicineId?: String | undefined;
  btnLabel?: String;
}

const FormMedicine = ({
  initialMedicine = defaultMedicine,
  medicineId,
  btnLabel = "Add",
}: Props) => {
  const [medicine, setMedicine] = useState(initialMedicine || defaultMedicine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(getNotice());

  const [suppliers, setSuppliers] = useState([
    {
      id: "",
      label: "Loading...",
    },
  ]);

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      try {
        const url = `/api/medicines/${medicineId}`;
        const response = await fetch(url);
        const medicine = await response.json();
        if (!medicine.error) {
          setMedicine(medicine);
        } else {
          setNotice({
            message: medicine.error,
            severity: "error",
          });
        }
      } catch (error: any | unknown) {
        setNotice({
          message: error.message,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    medicineId && fetchMedicine();

    (async () => {
      const response = await fetch("/api/suppliers?limit=1000");
      const jsonResponse = await response.json();
      setSuppliers(
        jsonResponse.suppliers.map((supplier: any) => ({
          id: supplier._id,
          label: supplier.name,
        }))
      );
    })();
  }, [medicineId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setMedicine((prev) => ({ ...prev, [e.target.name]: value }));
    const error = validate(value, name);
    setError((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (form: FormEvent) => {
    form.preventDefault();

    setNotice(getNotice());

    fetch(`/api/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medicine),
    })
      .then((response) => response.json())
      .then((response) => {
        setNotice({
          message: response?.message || response?.error,
          severity: response?.error ? "error" : "success",
        });

        if (!medicineId && !response?.error) {
          setMedicine(defaultMedicine);
        }
      });
  };

  const isError =
    Object.entries(error).filter((err) => err[1] !== "").length > 0;

  const inputs: InputProps[] = [
    {
      label: "Medicine's Name",
      name: "name",
      value: medicine.name,
      error: error?.name,
      startIcon: <Medication />,
    },
    {
      label: "Packing",
      name: "packing",
      value: medicine.packing,
      error: error?.packing,
      startIcon: <Inventory />,
    },
    {
      label: "Generic Name",
      name: "genericName",
      value: medicine.genericName,
      error: error?.genericName,
      startIcon: <Vaccines />,
    },
    // {
    //   label: "Supplier",
    //   type: "select",
    //   options: suppliers,
    //   name: "supplier",
    //   value: medicine.supplier,
    //   error: error?.supplier,
    //   startIcon: <Groups />,
    // },
  ];

  return (
    <Box sx={boxStyle()}>
      <form onSubmit={handleSubmit}>
        {loading &&
          Array.from(Array(3)).map((t, i) => {
            return (
              <Skeleton key={i} variant="rounded" height={50} sx={{ mb: 3 }} />
            );
          })}

        {!loading && (
          <RenderInputs inputs={inputs} handleChange={handleChange} />
        )}

        {/* <AddModal
          btnLabel="Add new Supplier"
          btnColor="success"
          form={<FormSupplier formTitle="Add New Supplier" />}
        /> */}

        {/* Form submit button */}
        <div className="row col col-md-12">
          <div className="form-group m-auto">
            <Button
              type="submit"
              variant="contained"
              disabled={isError || loading}
            >
              {btnLabel}
            </Button>
          </div>
        </div>

        {/* Result Message */}
        {notice.message && (
          <Alert className="mt-4" severity={notice.severity}>
            {notice.message}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default FormMedicine;
