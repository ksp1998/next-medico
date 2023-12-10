"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ErrorProps,
  InputProps,
  MedicineProps,
  NoticeProps,
} from "@/utils/props";
import { boxStyle, getNotice, validate } from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import { Inventory, Medication, Vaccines } from "@mui/icons-material";
import RenderInputs from "../RenderInputs";
import { defaultMedicine } from "@/utils/defaults";
import LoadingIcon from "../LoadingIcon";

interface Props {
  initialMedicine?: MedicineProps;
  initialNotice?: NoticeProps;
  medicineId?: String | undefined;
  btnLabel?: String;
}

const FormMedicine = ({
  initialMedicine = defaultMedicine,
  initialNotice = getNotice(),
  btnLabel = "Add",
}: Props) => {
  const [medicine, setMedicine] = useState(initialMedicine || defaultMedicine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(initialNotice);

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

    setLoading(true);
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

        if (!medicine._id && !response?.error) {
          setMedicine(defaultMedicine);
        }
      })
      .finally(() => setLoading(false));
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
        <RenderInputs inputs={inputs} handleChange={handleChange} />

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
              endIcon={loading && <LoadingIcon />}
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
