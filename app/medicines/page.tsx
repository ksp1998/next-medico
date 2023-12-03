import MedicationIcon from "@mui/icons-material/Medication";
import Header from "@/components/Header";
import ManageMedicines from "@/components/medicine/ManageMedicines";

const MedicinesPage = () => {
  return (
    <>
      <Header
        icon={<MedicationIcon sx={{ fontSize: 64 }} />}
        heading="Medicines"
        subHeading="Manage Medicines"
      />

      <ManageMedicines />
    </>
  );
};

export default MedicinesPage;
