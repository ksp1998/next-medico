"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import {
  ErrorProps,
  InputProps,
  NoticeProps,
  SupplierProps,
} from "@/utils/props";
import { boxStyle, getNotice, getSuppliers, validate } from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import { ContactMail, Email, Person, Smartphone } from "@mui/icons-material";
import RenderInputs from "../RenderInputs";
import { defaultSupplier } from "@/utils/defaults";
import LoadingIcon from "../LoadingIcon";

interface Props {
  initialSupplier?: SupplierProps;
  initialNotice?: NoticeProps;
  supplierId?: String | undefined;
  btnLabel?: String;
  formTitle?: string;
  updateSuppliers?: Dispatch<SetStateAction<never[]>> | null;
}

const FormSupplier = ({
  initialSupplier = defaultSupplier,
  initialNotice = getNotice(),
  btnLabel = "Add",
  formTitle = "",
  updateSuppliers = null,
}: Props) => {
  const [supplier, setSupplier] = useState(initialSupplier || defaultSupplier);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(initialNotice);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setSupplier((prev) => ({ ...prev, [name]: value }));
    const error = validate(value, name);
    setError((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (form: FormEvent) => {
    form.preventDefault();

    setLoading(true);
    setNotice(getNotice());

    fetch(`/api/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplier),
    })
      .then((response) => response.json())
      .then((response) => {
        setNotice({
          message: response?.message || response?.error,
          severity: response?.error ? "error" : "success",
        });

        if (!supplier._id && !response?.error) {
          setSupplier(defaultSupplier);
        }

        if (!response?.error && updateSuppliers !== null) {
          (async () => updateSuppliers(await getSuppliers()))();
        }
      })
      .finally(() => setLoading(false));
  };

  const isError =
    Object.entries(error).filter((err) => err[1] !== "").length > 0;

  const inputs: InputProps[] = [
    {
      label: "Supplier's Name",
      name: "name",
      value: supplier.name,
      error: error.name,
      startIcon: <Person />,
    },
    {
      label: "Contact Number",
      type: "number",
      name: "number",
      value: supplier.number,
      error: error.number,
      startIcon: <Smartphone />,
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      value: supplier.email,
      error: error.email,
      startIcon: <Email />,
    },
    {
      label: "Address",
      type: "textarea",
      name: "address",
      value: supplier.address,
      error: error.address,
      startIcon: <ContactMail />,
    },
  ];

  return (
    <Box sx={boxStyle()}>
      {formTitle && (
        <h3
          style={{
            marginBottom: "1em",
            paddingBottom: "0.5em",
            borderBottom: "1px solid lightgray",
          }}
        >
          {formTitle}
        </h3>
      )}
      <form onSubmit={handleSubmit}>
        {/* supplier details content */}
        <RenderInputs inputs={inputs} handleChange={handleChange} />
        {/* supplier details content end */}

        {/* form submit button */}

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

        {/* result message */}
        {notice.message && (
          <Alert className="mt-4" severity={notice.severity}>
            {notice.message}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default FormSupplier;
