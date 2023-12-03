import FormMedicine from "@/components/medicine/FormMedicine";
import Header from "@/components/Header";
import { Medication } from "@mui/icons-material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Customer | Medico",
};

export default function Page() {
  return (
    <>
      <Header
        icon={<Medication sx={{ fontSize: 64 }} />}
        heading="Add Medicine"
        subHeading="Medicines"
      />

      <FormMedicine />
    </>
  );
}
