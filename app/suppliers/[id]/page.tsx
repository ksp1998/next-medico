import FormSupplier from "@/components/supplier/FormSupplier";
import Header from "@/components/Header";
import GroupsIcon from "@mui/icons-material/Groups";
import { Metadata } from "next";
import { defaultSupplier, siteURL } from "@/utils/defaults";
import { apiFetch } from "@/utils/functions";

export const metadata: Metadata = {
  title: "Edit Supplier | Medico",
};

interface Props {
  params: {
    id?: String;
  };
}

const EditSupplierPage = async ({ params }: Props) => {
  const { data: supplier, notice } = await apiFetch(
    `${siteURL}/api/suppliers/${params.id}`,
    defaultSupplier
  );

  return (
    <>
      <Header
        icon={<GroupsIcon sx={{ fontSize: 64 }} />}
        heading="Edit Supplier"
        subHeading="Suppliers"
      />

      <FormSupplier
        initialSupplier={supplier}
        initialNotice={notice}
        btnLabel="Update"
      />
    </>
  );
};

export default EditSupplierPage;
