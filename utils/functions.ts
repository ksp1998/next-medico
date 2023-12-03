import { AlertColor } from "@mui/material";
import { NextResponse } from "next/server";
import { NoticeProps } from "./props";
import { redirect } from "next/navigation";
import { defaultPaymentStatusesOptions, defaultPaymentTypeOptions } from "./defaults";

export const boxStyle = (styles = {}) => ({
  ...styles,
  m: 3,
  p: 3,
  position: "relative",
  borderRadius: "4px",
  // overflow: "hidden",
  backgroundColor: "#FFF",
});

export const getID = () => Number((Date.now() - 1698796800000) / 1000).toFixed(0)

export const getRandomKey = () => `${Math.random()}`.replace("0.", "");

export const newInvoiceDetails = (invoiceNumber: string) => ({
  invoiceNumber,
  paymentType: "cash",
  date: new Date().toISOString().split("T").at(0),
  paidAmount: 0,
});

export const slugify = (string: string) => {
  // Convert the string to lowercase.
  string = string.toLowerCase();
  // Replace all non-alphanumeric characters with hyphens.
  string = string.replace(/[^a-zA-Z0-9]/g, "-");
  // Remove any consecutive hyphens.
  string = string.replace(/--/g, "-");

  return string;
};

export const sendResponseSuccess = (
  message: string,
  data = {},
  status = 200
) => {
  return NextResponse.json(
    { message, ...data },
    { status }
  );
};

export const sendResponseError = (error: string, data = {}, status = 200) => {
  return NextResponse.json(
    { error, ...data },
    { status }
  );
};

export const sendServerError = (error: any | unknown) => {
  return NextResponse.json(
    { error: `Server error, Please try again! ${error?.message ?? ''}`.trim() },
    { status: 500 }
  );
};

export const getNotice = (
  message: string = "",
  severity: AlertColor | undefined = undefined
) => {
  const notice: NoticeProps = {
    message: message,
    severity: severity,
  };
  return notice;
};

export const validate = (value: string, name: string, emptyCheck = true) => {

  if (emptyCheck) {
    const emptyCheckFor = ["name", "doctorName", "username", "email", "invoiceNumber", "password"]

    if (emptyCheckFor.includes(name) && value.trim() === "") {
      return "Must be filled out!";
    }
  }

  switch (name) {
    case "name":
    case "doctorName":
      if (!/^[-.a-zA-Z0-9\s]+$/.test(value)) {
        return "Must contain valid characters!";
      }
      break;
    case "number":
      if (!/^\d{10}$/.test(value)) {
        return "Must contain 10 digits!";
      }
      break;
    case "email":
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) {
        return "Invalid email address!";
      }
      break
    case "invoiceNumber":
      if (!/^\d{1,20}$/.test(value)) {
        return "Must contain only digits!";
      }
      break;
    case "address":
    case "doctorAddress":
      if (value.length < 10) {
        return "Please enter more specific address!";
      }
      break;
    case "paymentStatus":
      if (!defaultPaymentStatusesOptions.map(option => option.id).includes(value)) {
        return "Invalid payment status!";
      }
      break;
    case "paymentType":
      if (!defaultPaymentTypeOptions.map(option => option.id).includes(value)) {
        return "Invalid payment type!";
      }
      break;
    case "date":
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return "Must be in MM/DD/YYYY!";
      }
      break;
    case "expiry":
      if (!/^\d{1,2}\/\d{2}$/.test(value)) {
        return "Must be in MM/YY!";
      }
      break;
    case "quantity":
      if (Number(value) <= 0) {
        return "Minimum 1 required!";
      }
      break;
    case "discount":
      if (Number(value) <= 0) {
        return "Mustn't be negative!";
      }
      break;
    case "mrp":
    case "rate":
      if (Number(value) <= 0) {
        return "Must be positive!";
      }
      break;
    case 'password':
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
        return "Password must contain minimum 8 and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      }
      break;
  }

  return "";
};

export const getCustomers = async () => {
  const response = await fetch("/api/customers?limit=1000");
  const json = await response.json();

  return json.customers.map((customer: any) => ({
    id: customer._id,
    label: customer.name,
    ...customer
  }));
};

export const getSuppliers = async () => {
  const response = await fetch("/api/suppliers?limit=1000");
  const json = await response.json();

  return json.suppliers.map((supplier: any) => ({
    id: supplier._id,
    label: supplier.name,
  }));
};

export const getMedicines = async () => {
  const response = await fetch("/api/medicines?limit=1000");
  const json = await response.json();

  return json.medicines?.map((medicine: any) => ({
    id: medicine._id,
    label: medicine.name,
  })) ?? [];
};

export const apiGet = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint);
    return await response.json();
  } catch (error: any | unknown) {
    return { error: error?.message };
  }
};