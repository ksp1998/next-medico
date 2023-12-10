import FormCustomer from "@/components/customer/FormCustomer";
import Header from "@/components/Header";
import { defaultCustomer, siteURL } from "@/utils/defaults";
import { apiFetch } from "@/utils/functions";
import { CustomerProps } from "@/utils/props";
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

const EditCustomerPage = async ({ params }: Props) => {
  const { data: customer, notice } = await apiFetch(
    `${siteURL}/api/customers/${params.id}`,
    defaultCustomer
  );

  return (
    <>
      <Header
        icon={<People sx={{ fontSize: 64 }} />}
        heading="Edit Customer"
        subHeading="Customers"
      />

      <FormCustomer
        initialCustomer={customer}
        initialNotice={notice}
        btnLabel="Update"
      />
    </>
  );
};

export default EditCustomerPage;
