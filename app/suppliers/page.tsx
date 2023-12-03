import GroupsIcon from "@mui/icons-material/Groups";
import Header from "@/components/Header";
import { Metadata } from "next";
import ManageSuppliers from "@/components/supplier/ManageSuppliers";

export const metadata: Metadata = {
  title: "Suppliers | Medico",
};

const ManageSuppliersPage = () => {
  return (
    <>
      <Header
        icon={<GroupsIcon sx={{ fontSize: 64 }} />}
        heading="Suppliers"
        subHeading="Manage Suppliers"
      />

      <ManageSuppliers />
    </>
  );
};

export default ManageSuppliersPage;
