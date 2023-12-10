"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import {
  CustomerProps,
  ErrorProps,
  InputProps,
  NoticeProps,
} from "@/utils/props";
import { boxStyle, getCustomers, getNotice, validate } from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import { AccountCircle, ContactMail, Smartphone } from "@mui/icons-material";
import RenderInputs from "../RenderInputs";
import { defaultCustomer } from "@/utils/defaults";
import LoadingIcon from "../LoadingIcon";

interface Props {
  initialCustomer?: CustomerProps;
  initialNotice?: NoticeProps;
  customerId?: String | undefined;
  btnLabel?: String;
  formTitle?: string;
  updateCustomers?: Dispatch<SetStateAction<never[]>> | null;
}

const FormCustomer = ({
  initialCustomer = defaultCustomer,
  initialNotice = getNotice(),
  btnLabel = "Add",
  formTitle = "",
  updateCustomers = null,
}: Props) => {
  const [customer, setCustomer] = useState(initialCustomer || defaultCustomer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(initialNotice);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setCustomer((prev) => ({ ...prev, [e.target.name]: value }));
    const error = validate(value, name);
    setError((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (form: FormEvent) => {
    form.preventDefault();

    setLoading(true);
    setNotice(getNotice());

    fetch(`/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
      .then((response) => response.json())
      .then((response) => {
        setNotice({
          message: response?.message || response?.error,
          severity: response?.error ? "error" : "success",
        });

        if (!customer._id && !response?.error) {
          setCustomer(defaultCustomer);
        }

        if (!response?.error && updateCustomers !== null) {
          (async () => updateCustomers(await getCustomers()))();
        }
      })
      .finally(() => setLoading(false));
  };

  const isError =
    Object.entries(error).filter((err) => err[1] !== "").length > 0;

  const inputs: InputProps[] = [
    {
      label: "Customer's Name",
      name: "name",
      value: customer.name,
      error: error?.name,
      startIcon: <AccountCircle />,
    },
    {
      label: "Contact Number",
      type: "number",
      name: "number",
      value: customer.number,
      error: error?.number,
      startIcon: <Smartphone />,
    },
    {
      label: "Address",
      type: "textarea",
      name: "address",
      value: customer.address,
      error: error?.address,
      startIcon: <ContactMail />,
    },
    {
      label: "Doctor's Name",
      name: "doctorName",
      value: customer.doctorName,
      error: error?.doctorName,
      startIcon: <AccountCircle />,
    },
    {
      label: "Doctor's Address",
      type: "textarea",
      name: "doctorAddress",
      value: customer.doctorAddress,
      error: error?.doctorAddress,
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
        {/* customer details content */}
        <RenderInputs inputs={inputs} handleChange={handleChange} />
        {/* customer details content end */}

        {/* form submit button */}
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

export default FormCustomer;
