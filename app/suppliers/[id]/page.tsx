import FormSupplier from "@/components/supplier/FormSupplier";
import Header from "@/components/Header";
import GroupsIcon from "@mui/icons-material/Groups";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Supplier | Medico",
};

interface Props {
  params: {
    id?: String;
  };
}

const EditSupplierPage = ({ params }: Props) => {
  return (
    <>
      <Header
        icon={<GroupsIcon sx={{ fontSize: 64 }} />}
        heading="Edit Supplier"
        subHeading="Suppliers"
      />

      <FormSupplier supplierId={params.id} btnLabel="Update" />
    </>
  );
};

export default EditSupplierPage;
