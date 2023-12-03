import Header from "@/components/Header";
import ManageMedicinesStock from "@/components/medicine/ManageMedicinesStock";
import { Medication } from "@mui/icons-material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Medicines Stock| Medico",
};

const MedicinesStockPage = () => {
  return (
    <>
      <Header
        icon={<Medication sx={{ fontSize: 64 }} />}
        heading="Medicines Stock"
        subHeading="Manage Medicines Stock"
      />

      <ManageMedicinesStock />
    </>
  );
};

export default MedicinesStockPage;
