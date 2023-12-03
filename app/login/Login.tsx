"use client";

import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { getNotice } from "@/utils/functions";
import RenderInputs from "@/components/RenderInputs";
import { AccountCircle, Lock } from "@mui/icons-material";
import Link from "next/link";
import { signIn } from "next-auth/react";
import LoadingIcon from "@/components/LoadingIcon";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(getNotice());
  const [login, setLogin] = useState({ username: "", password: "" });

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (form: FormEvent) => {
    form.preventDefault();
    setLoading(true);
    setNotice(getNotice());

    const response = await signIn("credentials", {
      username: login.username,
      password: login.password,
      redirect: false,
    });

    console.log(response);

    const message = response?.error
      ? "Oops! Invalid Username or Password!"
      : "You are logged in successfully!";

    setNotice({
      message,
      severity: response?.error ? "error" : "success",
    });

    if (!response?.error && response?.ok) {
      router.push("/");
      router.refresh();
    }

    setLoading(false);
  };

  const inputs = [
    {
      label: "Username",
      name: "username",
      value: login.username,
      startIcon: <AccountCircle />,
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      value: login.password,
      startIcon: <Lock />,
    },
  ];

  return (
    <div className="form-container login-form">
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
              <span>kMedical</span>
            </h1>
            <h2>
              <span>Admin</span> <span>Login</span>
            </h2>
          </div>

          <RenderInputs inputs={inputs} handleChange={handleChange} />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={loading && <LoadingIcon />}
          >
            Login
          </Button>

          {notice.message && (
            <Alert className="mt-4" severity={notice.severity}>
              {notice.message}
            </Alert>
          )}
        </form>
        <div className="form-card-footer">
          <Link className="link" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </Box>
    </div>
  );
};

export default Login;
