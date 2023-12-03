"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AdminProfileProps, ErrorProps } from "@/utils/props";
import { boxStyle, getNotice, validate } from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent, Skeleton } from "@mui/material";
import RenderInputs from "../RenderInputs";
import {
  AccountCircle,
  ContactMail,
  Email,
  LocalHospital,
  Smartphone,
} from "@mui/icons-material";
import LoadingIcon from "../LoadingIcon";

interface Props {
  currentAdmin: AdminProfileProps;
  errorMessage?: string;
}

const FormAdminProfile = ({ currentAdmin, errorMessage = "" }: Props) => {
  const [admin, setAdmin] = useState(currentAdmin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(getNotice(errorMessage, "error"));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setAdmin((prev) => ({ ...prev, [name]: value }));
    const error = validate(value, name);
    setError((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (form: FormEvent) => {
    form.preventDefault();
    setLoading(true);
    setNotice(getNotice());

    fetch(`/api/admins?action=profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    })
      .then((response) => response.json())
      .then((response) => {
        setNotice({
          message: response?.error || response?.message,
          severity: response?.error ? "error" : "success",
        });

        setLoading(false);
      });
  };

  const inputs = [
    {
      label: "Pharmacy's Name",
      name: "name",
      value: admin?.name,
      error: error?.name,
      startIcon: <LocalHospital />,
    },
    {
      label: "Username",
      name: "username",
      value: admin?.username,
      error: error?.username,
      startIcon: <AccountCircle />,
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      value: admin?.email,
      error: error?.email,
      startIcon: <Email />,
    },
    {
      label: "Contact Number",
      type: "number",
      name: "number",
      value: admin?.number,
      error: error?.number,
      startIcon: <Smartphone />,
    },
    {
      label: "Address",
      type: "textarea",
      name: "address",
      value: admin?.address,
      error: error?.address,
      startIcon: <ContactMail />,
    },
  ];

  return (
    <Box sx={boxStyle()}>
      <h4 className="mb-4">Basic Details</h4>
      <form onSubmit={handleSubmit}>
        <RenderInputs inputs={inputs} handleChange={handleChange} />

        {/* form submit button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading && <LoadingIcon />}
        >
          Update
        </Button>

        {notice.message && (
          <Alert className="mt-4" severity={notice.severity}>
            {notice.message}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default FormAdminProfile;
