import Header from "@/components/Header";
import { Metadata } from "next";
import { Analytics } from "@mui/icons-material";
import FormPurchase from "@/components/purchase/FormPurchase";

export const metadata: Metadata = {
  title: "Add Purchase | Medico",
};

export default function Page() {
  return (
    <>
      <Header
        icon={<Analytics sx={{ fontSize: 64 }} />}
        heading="Add Purchase"
        subHeading="Purchases"
      />

      <FormPurchase />
    </>
  );
}
