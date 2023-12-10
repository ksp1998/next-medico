"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import {
  AdminProfileProps,
  ErrorProps,
  InputProps,
  NoticeProps,
} from "@/utils/props";
import { boxStyle, getNotice, validate } from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import RenderInputs from "../RenderInputs";
import { Key, Lock } from "@mui/icons-material";
import LoadingIcon from "../LoadingIcon";

interface Props {
  currentAdmin: AdminProfileProps;
  initialNotice: NoticeProps;
}

const FormChangePassword = ({ currentAdmin, initialNotice }: Props) => {
  const [admin, setAdmin] = useState(currentAdmin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(initialNotice);

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

    fetch(`/api/admins?action=password`, {
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

  const inputs: InputProps[] = [
    {
      label: "Old Password",
      name: "oldPassword",
      value: admin?.oldPassword,
      error: error?.oldPassword,
      startIcon: <Key />,
    },
    {
      label: "New Password",
      name: "password",
      value: admin?.password,
      error: error?.password,
      startIcon: <Lock />,
    },
    {
      label: "Confirm New Password",
      type: "password",
      name: "confirmPassword",
      value: admin?.confirmPassword,
      error: error?.confirmPassword,
      startIcon: <Lock />,
    },
  ];

  return (
    <Box sx={boxStyle()} id="change-password">
      <h4 className="mb-4">Change Password</h4>
      <form onSubmit={handleSubmit}>
        {/* admin details content */}
        <RenderInputs inputs={inputs} handleChange={handleChange} />
        {/* admin details content end */}

        {/* form submit button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading && <LoadingIcon />}
        >
          Update Password
        </Button>

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

export default FormChangePassword;
