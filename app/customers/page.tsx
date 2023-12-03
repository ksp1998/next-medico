import Header from "@/components/Header";
import ManageCustomers from "@/components/customer/ManageCustomers";
import { Metadata } from "next";
import { People } from "@mui/icons-material";

export const metadata: Metadata = {
  title: "Customers | Medico",
};

const CustomersPage = () => {
  return (
    <>
      <Header
        icon={<People sx={{ fontSize: 64 }} />}
        heading="Customers"
        subHeading="Manage Customers"
      />

      <ManageCustomers />
    </>
  );
};

export default CustomersPage;
