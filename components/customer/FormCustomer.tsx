"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CustomerProps, ErrorProps } from "@/utils/props";
import { boxStyle, getCustomers, getNotice, validate } from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent, Skeleton } from "@mui/material";
import { AccountCircle, ContactMail, Smartphone } from "@mui/icons-material";
import RenderInputs from "../RenderInputs";

interface Props {
  initialCustomer?: CustomerProps;
  customerId?: String | undefined;
  btnLabel?: String;
  formTitle?: string;
  updateCustomers?: Dispatch<SetStateAction<never[]>> | null;
}

const defaultCustomer = {
  name: "",
  number: "",
  address: "",
  doctorName: "",
  doctorAddress: "",
};

const FormCustomer = ({
  initialCustomer = defaultCustomer,
  customerId,
  btnLabel = "Add",
  formTitle = "",
  updateCustomers = null,
}: Props) => {
  const [customer, setCustomer] = useState(initialCustomer || defaultCustomer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(getNotice());

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const url = `/api/customers/${customerId}`;
        const response = await fetch(url);
        const customer = await response.json();
        if (!customer.error) {
          setCustomer(customer);
        } else {
          setNotice({
            message: customer.error,
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
    customerId && fetchCustomer();
  }, [customerId]);

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

        if (!customerId && !response?.error) {
          setCustomer(defaultCustomer);
        }

        if (!response?.error && updateCustomers !== null) {
          (async () => updateCustomers(await getCustomers()))();
        }
      });
  };

  const isError =
    Object.entries(error).filter((err) => err[1] !== "").length > 0;

  const inputs = [
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
        {loading &&
          Array.from(Array(5)).map((t, i) => {
            return (
              <Skeleton
                key={i}
                variant="rounded"
                height={i == 2 || i == 4 ? 150 : 50}
                sx={{ mb: 3 }}
              />
            );
          })}

        {/* customer details content */}
        {!loading && (
          <RenderInputs inputs={inputs} handleChange={handleChange} />
        )}
        {/* customer details content end */}

        {/* form submit button */}
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
