import { AlertColor } from "@mui/material";
import { ReactNode } from "react";
import { Url } from "next/dist/shared/lib/router/router";

export interface DashboardSectionProps {
    icon?: ReactNode;
    title: String;
    count?: Number;
    href?: Url;
    api?: String;
}

export interface InputProps {
    startIcon?: ReactNode;
    label: string;
    type?: string;
    name: string;
    value?: string;
    error?: string | undefined;
    disabled?: boolean;
    options?: OptionProps[];
}

export interface OptionProps {
    id: string;
    label: string;
    address?: string;
    number?: number;
    stock?: number;
    sold?: number;
    expiry?: string;
    mrp?: number;
}

export interface ErrorProps {
    [key: string]: string
}

export interface CustomerProps {
    _id?: any;
    name: string;
    number: string;
    address: string;
    doctorName: string;
    doctorAddress: string;
    createdAt?: String;
    updatedAt?: String;
}

export interface SupplierProps {
    _id?: any;
    name: string;
    number: string;
    email: string;
    address: string;
    createdAt?: String;
    updatedAt?: String;
}

export interface MedicineProps {
    _id?: any;
    name: string;
    packing: string;
    genericName: string;
    supplier: string;
    createdAt?: String;
    updatedAt?: String;
}

export interface InvoiceProps {
    _id?: any;
    invoiceNumber: number;
    customer: CustomerProps;
    date: Date;
    paymentType: string;
    subtotal: number;
    discount: number;
    total: number;
    createdAt?: String;
    updatedAt?: String;
}

export interface PurchaseProps {
    _id?: any;
    invoiceNumber: number;
    supplier: SupplierProps;
    date: Date;
    paymentStatus: string;
    amount: number;
    createdAt?: String;
    updatedAt?: String;
}

export interface MedicineStockProps {
    _id?: any;
    medicine: MedicineProps;
    batchId: string;
    expiry: string;
    stock: number;
    mrp: number;
    rate: number;
    purchase: PurchaseProps;
    createdAt?: String;
    updatedAt?: String;
}

export interface MedicineRowProps {
    id: string,
    name: string,
    packing: string,
    batchId: string,
    expiry: string,
    quantity: string,
    mrp: string,
    rate: string,
    genericName: string,
};

export interface InvoiceItemRowProps {
    medicine: string,
    stock: string,
    availableQuantity: number,
    expiry: string,
    quantity: number,
    mrp: number,
    rate: number,
    discount: number,
}

export interface AdminProfileProps {
    _id?: any;
    name: string;
    username: string;
    number: string;
    email: string;
    password: string;
    confirmPassword?: string;
    oldPassword?: string;
    address: string;
    createdAt?: String;
    updatedAt?: String;
}

export interface ColumnProps {
    id: string;
    label: string;
    sortable?: Boolean;
    align?: "center" | "left" | "right" | "inherit" | "justify" | undefined;
    minWidth?: string;
}

export interface NoticeProps {
    message: string | ReactNode;
    severity: AlertColor | undefined;
}
