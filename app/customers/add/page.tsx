import FormCustomer from "@/components/customer/FormCustomer";
import Header from "@/components/Header";
import { People } from "@mui/icons-material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Customer | Medico",
};

export default function Page() {
  return (
    <>
      <Header
        icon={<People sx={{ fontSize: 64 }} />}
        heading="Add Customer"
        subHeading="Customers"
      />

      <FormCustomer />
    </>
  );
}
