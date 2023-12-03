import FormSupplier from "@/components/supplier/FormSupplier";
import Header from "@/components/Header";
import { Metadata } from "next";
import GroupsIcon from "@mui/icons-material/Groups";

export const metadata: Metadata = {
  title: "Add Supplier | Medico",
};

export default function Page() {
  return (
    <>
      <Header
        icon={<GroupsIcon sx={{ fontSize: 64 }} />}
        heading="Add Supplier"
        subHeading="Suppliers"
      />

      <FormSupplier />
    </>
  );
}
