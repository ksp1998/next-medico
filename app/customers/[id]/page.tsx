import FormCustomer from "@/components/customer/FormCustomer";
import Header from "@/components/Header";
import { People } from "@mui/icons-material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Customer | Medico",
};

interface Props {
  params: {
    id?: String;
  };
}

const EditCustomerPage = ({ params }: Props) => {
  return (
    <>
      <Header
        icon={<People sx={{ fontSize: 64 }} />}
        heading="Edit Customer"
        subHeading="Customers"
      />

      <FormCustomer customerId={params.id} btnLabel="Update" />
    </>
  );
};

export default EditCustomerPage;
