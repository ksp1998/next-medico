import { CustomerProps, InvoiceItemRowProps, MedicineProps, MedicineRowProps, SupplierProps } from "./props";

export const siteURL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.SITE_URL;

export const defaultCustomer: CustomerProps = {
    name: "",
    number: "",
    address: "",
    doctorName: "",
    doctorAddress: "",
};

export const defaultSupplier: SupplierProps = {
    name: "",
    number: "",
    email: "",
    address: "",
};

export const defaultMedicine: MedicineProps = {
    name: "",
    packing: "",
    genericName: "",
    supplier: "",
};

export const defaultInvoiceItem: InvoiceItemRowProps = {
    medicine: "",
    stock: "",
    availableQuantity: 0,
    expiry: "",
    quantity: 0,
    mrp: 0,
    rate: 0,
    discount: 0,
};

export const defaultMedicineStock: MedicineRowProps = {
    id: "",
    name: "",
    packing: "",
    batchId: "",
    expiry: "",
    quantity: "",
    mrp: "",
    rate: "",
    genericName: "",
};

export const defaultPaymentStatusesOptions = [
    {
        id: "due",
        label: "Due",
    },
    {
        id: "paid",
        label: "Paid",
    },
];

export const defaultPaymentTypeOptions = [
    {
        id: "cash",
        label: "Cash",
    },
    {
        id: "card",
        label: "Card",
    },
    {
        id: "online",
        label: "Online",
    },
];

export const defaultTableParams: Record<string, any> = {
    limit: 8,
    order: "asc",
    page: 0,
    orderBy: "name",
    search: "",
    start: "",
    end: "",
    invoiceNumber: "",
    customer: "",
    supplier: "",
    invoiceDate: "",
};

export const defaultTableStyle = {
    borderTop: "1px solid #ff5252",
    borderBottom: "2px solid #ff5252",
    boxShadow: "none",
}

export const defaultRowsPerPageLengths = [5, 8, 10, 25, 50, 100];