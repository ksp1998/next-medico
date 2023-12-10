"use client";

import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { getNotice, validate } from "@/utils/functions";
import RenderInputs from "../../components/RenderInputs";
import { Key } from "@mui/icons-material";
import Link from "next/link";
import { ErrorProps } from "@/utils/props";

const defaultFields = {
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
};

const ForgotPassword = () => {
  const [fields, setFields] = useState(defaultFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(getNotice());

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields((prev) => ({ ...prev, [name]: value }));
    const error = validate(value, name);
    setError((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (form: FormEvent) => {
    form.preventDefault();
    setNotice({
      message: (
        <>
          Oops! Failed to send OTP on email <b>{fields.email}</b>
        </>
      ),
      severity: "error",
    });
  };

  const inputs = [
    {
      label: "Email",
      name: "email",
      value: fields.email,
      error: error.email,
      startIcon: <Key />,
    },
    // {
    //   label: "Enter OTP",
    //   name: "number",
    //   value: fields.otp,
    //   error: error.otp,
    //   disabled: true,
    //   startIcon: <Numbers />,
    // },
    // {
    //   label: "New Password",
    //   name: "password",
    //   value: fields.password,
    //   error: error.password,
    //   startIcon: <Lock />,
    // },
    // {
    //   label: "Confirm New Password",
    //   type: "password",
    //   name: "confirmPassword",
    //   value: fields.confirmPassword,
    //   error: error.confirmPassword,
    //   startIcon: <Lock />,
    // },
  ];

  return (
    <div className="form-container forgot-password-form">
      <Box className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="logo">
            <Image
              className="img"
              src="/images/prof.jpg"
              width={100}
              height={100}
              alt=""
            />
            <h1>
              <span>Medico</span>
            </h1>
            <h2>
              <span>Forgot</span> <span>Password</span>
            </h2>
          </div>

          <RenderInputs inputs={inputs} handleChange={handleChange} />

          <Button type="submit" variant="contained" disabled={loading}>
            Get OTP
          </Button>

          {notice.message && (
            <Alert className="mt-4" severity={notice.severity}>
              {notice.message}
            </Alert>
          )}
        </form>
        <div className="form-card-footer">
          <Link className="link" href="/login">
            Login here
          </Link>
        </div>
      </Box>
    </div>
  );
};

export default ForgotPassword;
