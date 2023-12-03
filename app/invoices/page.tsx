import Header from "@/components/Header";
import { Metadata } from "next";
import ManageInvoices from "@/components/invoice/ManageInvoices";
import { RequestQuote } from "@mui/icons-material";

export const metadata: Metadata = {
  title: "Invoices | Medico",
};

const InvoicesPage = () => {
  return (
    <>
      <Header
        icon={<RequestQuote sx={{ fontSize: 64 }} />}
        heading="Invoices"
        subHeading="Manage Invoices"
      />

      <ManageInvoices />
    </>
  );
};

export default InvoicesPage;
