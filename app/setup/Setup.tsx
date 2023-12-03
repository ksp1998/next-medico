"use client";

import {
  Alert,
  AlertColor,
  Box,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { getNotice, validate } from "@/utils/functions";
import RenderInputs from "@/components/RenderInputs";
import {
  AccountCircle,
  ContactMail,
  Email,
  LocalHospital,
  Lock,
  Smartphone,
} from "@mui/icons-material";
import { AdminProfileProps, ErrorProps } from "@/utils/props";
import LoadingIcon from "@/components/LoadingIcon";
import { useRouter } from "next/navigation";

const defaultAdmin: AdminProfileProps = {
  name: "",
  username: "",
  email: "",
  number: "",
  password: "",
  confirmPassword: "",
  address: "",
};

const Setup = () => {
  const [admin, setAdmin] = useState(defaultAdmin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorProps>({});
  const [notice, setNotice] = useState(getNotice());

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
    const error = validate(value, name);
    setError((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (form: FormEvent) => {
    form.preventDefault();
    setLoading(true);
    setNotice(getNotice());

    fetch(`/api/admins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    })
      .then((response) => response.json())
      .then((response) => {
        let message, severity: AlertColor | undefined;
        if (response.error) {
          message = `${response.error} ${response?.message}`.trim();
          severity = "error";
        } else {
          message = response.message;
          severity = "success";
        }

        setNotice({ message, severity });

        if (!response?.error) {
          router.push("/login");
          router.refresh();
        }
        setLoading(false);
      });
  };

  const inputs = [
    {
      label: "Medico Title",
      name: "name",
      value: admin.name,
      error: error.name,
      startIcon: <LocalHospital />,
    },
    {
      label: "Address",
      type: "textarea",
      name: "address",
      value: admin.address,
      error: error.address,
      startIcon: <ContactMail />,
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      value: admin.email,
      error: error.email,
      startIcon: <Email />,
    },
    {
      label: "Contact Number",
      type: "number",
      name: "number",
      value: admin.number,
      error: error.number,
      startIcon: <Smartphone />,
    },
    {
      label: "Username",
      name: "username",
      value: admin.username,
      error: error.username,
      startIcon: <AccountCircle />,
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      value: admin.password,
      error: error.password,
      startIcon: <Lock />,
    },
    {
      label: "Confirm Password",
      type: "password",
      name: "confirmPassword",
      value: admin.confirmPassword,
      error: error.confirmPassword,
      startIcon: <Lock />,
    },
  ];

  return (
    <div className="form-container setup-form">
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
              <span>One</span> <span>Time</span> <span>Setup</span>
            </h2>
            <p style={{ textAlign: "center" }}>
              Enter necessary medico details
            </p>
          </div>

          <RenderInputs inputs={inputs} handleChange={handleChange} />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading && <LoadingIcon />}
          >
            Start
          </Button>

          {notice.message && (
            <Alert className="mt-4" severity={notice.severity}>
              {notice.message}
            </Alert>
          )}
        </form>
      </Box>
    </div>
  );
};

export default Setup;
