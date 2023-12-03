import FormMedicine from "@/components/medicine/FormMedicine";
import Header from "@/components/Header";
import { Medication } from "@mui/icons-material";
import { Metadata } from "next";

interface Props {
  params: {
    id?: String;
  };
}

export const metadata: Metadata = {
  title: "Edit Medicine | Medico",
};

const EditMedicinePage = ({ params }: Props) => {
  return (
    <>
      <Header
        icon={<Medication sx={{ fontSize: 64 }} />}
        heading="Edit Medicine"
        subHeading="Medicines"
      />

      <FormMedicine medicineId={params.id} btnLabel="Update" />
    </>
  );
};

export default EditMedicinePage;
