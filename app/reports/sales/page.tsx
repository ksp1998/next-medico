import Header from "@/components/Header";
import { Metadata } from "next";
import { Assessment } from "@mui/icons-material";
import SalesReport from "@/components/reports/SalesReport";

export const metadata: Metadata = {
  title: "Sales Report | Medico",
};

const SalesReportPage = () => {
  return (
    <>
      <Header
        icon={<Assessment sx={{ fontSize: 64 }} />}
        heading="Sales Report"
        subHeading="Reports"
      />

      <SalesReport />
    </>
  );
};

export default SalesReportPage;
