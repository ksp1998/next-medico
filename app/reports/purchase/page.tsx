import Header from "@/components/Header";
import { Metadata } from "next";
import { Assessment } from "@mui/icons-material";
import PurchaseReport from "@/components/reports/PurchaseReport";

export const metadata: Metadata = {
  title: "Purchases | Medico",
};

const PurchasesPage = () => {
  return (
    <>
      <Header
        icon={<Assessment sx={{ fontSize: 64 }} />}
        heading="Purchase Report"
        subHeading="Reports"
      />

      <PurchaseReport />
    </>
  );
};

export default PurchasesPage;
