import FormInvoice from "@/components/invoice/FormInvoice";
import Header from "@/components/Header";
import { RequestQuote } from "@mui/icons-material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Invoice | Medico",
};

export default function AddInvoicePage() {
  return (
    <>
      <Header
        icon={<RequestQuote sx={{ fontSize: 64 }} />}
        heading="New Invoice"
        subHeading="Invoices"
      />

      <FormInvoice />
    </>
  );
}
