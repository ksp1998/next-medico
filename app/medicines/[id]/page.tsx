import FormMedicine from "@/components/medicine/FormMedicine";
import Header from "@/components/Header";
import { Medication } from "@mui/icons-material";
import { Metadata } from "next";
import { defaultMedicine, siteURL } from "@/utils/defaults";
import { apiFetch } from "@/utils/functions";

interface Props {
  params: {
    id?: String;
  };
}

export const metadata: Metadata = {
  title: "Edit Medicine | Medico",
};

const EditMedicinePage = async ({ params }: Props) => {
  const { data: medicine, notice } = await apiFetch(
    `${siteURL}/api/medicines/${params.id}`,
    defaultMedicine
  );

  return (
    <>
      <Header
        icon={<Medication sx={{ fontSize: 64 }} />}
        heading="Edit Medicine"
        subHeading="Medicines"
      />

      <FormMedicine
        initialMedicine={medicine}
        initialNotice={notice}
        btnLabel="Update"
      />
    </>
  );
};

export default EditMedicinePage;
