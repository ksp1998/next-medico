"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ErrorProps, InvoiceItemRowProps } from "@/utils/props";
import {
  boxStyle,
  getNotice,
  getCustomers,
  validate,
  getRandomKey,
  getID,
  newInvoiceDetails,
} from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import {
  ContactMail,
  DateRange,
  Numbers,
  Payment,
  People,
  Smartphone,
} from "@mui/icons-material";

import FormInput from "../FormInput";
import AddModal from "../AddModal";
import FormCustomer from "../customer/FormCustomer";
import AutoCompleteInput from "../AutoCompleteInput";
import InvoiceItemRow from "./InvoiceItemRow";
import {
  defaultCustomer,
  defaultInvoiceItem,
  defaultPaymentTypeOptions,
} from "@/utils/defaults";
import LoadingIcon from "../LoadingIcon";

interface Props {
  btnLabel?: String;
}

const FormInvoice = ({ btnLabel = "Save Invoice" }: Props) => {
  const [customer, setCustomer] = useState(defaultCustomer);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(getNotice());
  const [saved, setSaved] = useState(false);

  const [invoiceDetails, setInvoiceDetails] = useState(
    newInvoiceDetails(getID())
  );
  const [invoiceError, setInvoiceError] = useState<ErrorProps>({});

  const [customers, setCustomers] = useState([]);

  const key = getRandomKey();
  const [items, setItems] = useState({ [key]: defaultInvoiceItem });
  const [itemsError, setItemsError] = useState<{
    [key: string]: ErrorProps;
  }>({
    [key]: {},
  });

  useEffect(() => {
    (async () => setCustomers(await getCustomers()))();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setInvoiceDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = validate(value, name);
    setInvoiceError((prev) => ({ ...prev, [name]: error }));
  };

  const addItemRow = () => {
    const key = getRandomKey();
    setItems((prev) => ({
      ...prev,
      [key]: defaultInvoiceItem,
    }));
  };

  const removeItemRow = (key: string) => {
    if (Object.keys(items).length === 1) {
      return;
    }
    setItems((prev) => {
      delete prev[key];
      return { ...prev };
    });
  };

  const handleSubmit = (form: FormEvent) => {
    form.preventDefault();

    setLoading(true);
    setNotice(getNotice());

    fetch(`/api/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        invoiceDetails,
        items,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setNotice({
          message: response?.message || response?.error,
          severity: response?.error ? "error" : "success",
        });
        setLoading(false);
      });
  };

  return (
    <Box sx={boxStyle()}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* <!-- customer details content --> */}
          <div className="col col-12 row">
            <div className="col col-12 col-md-6 col-lg-4 col-xl-3 form-group">
              <AutoCompleteInput
                label="Customer"
                noOptionsText="No customers"
                value={customer?._id}
                options={customers}
                setOption={setCustomer}
                error={invoiceError?.customer}
                startIcon={<People />}
              />
            </div>
            <div className="col col-12 col-md-6 col-lg-4 col-xl-3 form-group">
              <FormInput
                label="Address"
                disabled={true}
                value={customer?.address}
                startIcon={<ContactMail />}
              />
            </div>
            <div className="col col-6 col-md-4 col-lg-3 col-xl-2 form-group">
              <FormInput
                label="Invoice Number"
                name="invoiceNumber"
                value={invoiceDetails.invoiceNumber}
                error={invoiceError?.invoiceNumber}
                disabled={true}
                startIcon={<Numbers />}
              />
            </div>
            <div className="col col-6 col-md-4 col-lg-4 col-xl-2 form-group">
              <FormInput
                label="Payment Type"
                type="select"
                name="paymentType"
                value={invoiceDetails.paymentType}
                onChange={handleChange}
                options={defaultPaymentTypeOptions}
                error={invoiceError?.paymentType}
                startIcon={<Payment />}
              />
            </div>
            <div className="col col-12 col-md-4 col-lg-4 col-xl-2 form-group">
              <FormInput
                label="Invoice Date"
                type="date"
                name="date"
                value={invoiceDetails.date}
                onChange={handleChange}
                error={invoiceError?.date}
                startIcon={<DateRange />}
              />
            </div>
          </div>
          {/* <!-- customer details content end --> */}

          {/* <!-- new user button --> */}
          <div className="col col-12 row">
            <div className="col-8 col-md-4 form-group mb-4">
              <AddModal
                btnLabel="New Customer"
                btnVariant="contained"
                form={
                  <FormCustomer
                    formTitle="Add New Customer"
                    updateCustomers={setCustomers}
                  />
                }
              />
            </div>
            <div className="col form-group"></div>
            <div className="col col-12 col-md-6 col-lg-4 form-group">
              <FormInput
                label="Contact Number"
                type="number"
                value={customer?.number}
                name="number"
                disabled={true}
                startIcon={<Smartphone />}
              />
            </div>
          </div>
          {/* <!-- closing new user button --> */}

          <hr style={{ paddingBottom: "1em" }} />

          {/* <!-- start items --> */}
          {Object.entries(items).map(([key, item]) => (
            <InvoiceItemRow
              key={key}
              dataKey={key}
              item={item}
              setItems={setItems}
              itemError={itemsError[key]}
              setItemsError={setItemsError}
              addRowCallback={addItemRow}
              removeRowCallback={removeItemRow}
              disableDeleteButton={Object.keys(items).length === 1}
            />
          ))}
          {/* <!-- end items --> */}

          <hr style={{ paddingBottom: "1em" }} />

          <div className="row col col-12">
            <div className="col col-12 col-lg-3 form-group"></div>
            <div className="col col-6 col-md-4 col-lg-3 form-group">
              <FormInput
                label="Total Amount"
                type="number"
                value={Object.values(items)
                  .reduce(
                    (total: number, item: InvoiceItemRowProps) =>
                      total + item.quantity * item.mrp,
                    0
                  )
                  .toFixed(2)}
                disabled={true}
                error={invoiceError?.totalAmount}
              />
            </div>
            <div className="col col-6 col-md-4 col-lg-3 form-group">
              <FormInput
                label="Total Discount"
                type="number"
                value={Object.values(items)
                  .reduce(
                    (total: number, item: InvoiceItemRowProps) =>
                      item.discount
                        ? total +
                          (item.quantity * item.mrp * item.discount) / 100
                        : total,
                    0
                  )
                  .toFixed(2)}
                disabled={true}
                error={invoiceError?.totalDiscount}
              />
            </div>
            <div className="col col-12 col-md-4 col-lg-3 form-group">
              <FormInput
                label="Net Total"
                type="number"
                value={Object.values(items)
                  .reduce((total: number, item: InvoiceItemRowProps) => {
                    const totalAmount = item.quantity * item.mrp;
                    return item.discount
                      ? total +
                          totalAmount -
                          (totalAmount * item.discount) / 100
                      : total + totalAmount;
                  }, 0)
                  .toFixed(2)}
                disabled={true}
                error={invoiceError?.netTotal}
              />
            </div>
          </div>

          <hr style={{ paddingTop: "1em" }} />

          <div className="row col col-12">
            <div className="col col-12 col-md-4 col-lg-3 form-group mb-4">
              <div className="d-flex gap-3">
                {!saved && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={loading && <LoadingIcon />}
                    disabled={loading}
                  >
                    {btnLabel}
                  </Button>
                )}

                {saved && (
                  <>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => {
                        const key = getRandomKey();
                        setCustomer(defaultCustomer);
                        setInvoiceDetails(newInvoiceDetails(getID()));
                        setItems({ [key]: defaultInvoiceItem });
                        setNotice(getNotice());
                        setInvoiceError({});
                        setItemsError({});
                        setSaved(false);
                      }}
                    >
                      New Invoice
                    </Button>
                    <Button variant="contained" color="warning">
                      Print
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="col col-12 col-lg-3 form-group"></div>

            <div className="col col-6 col-md-4 col-lg-3 form-group">
              <FormInput
                label="Paid Amount"
                type="number"
                name="paidAmount"
                value={invoiceDetails.paidAmount.toString()}
                onChange={handleChange}
                error={invoiceError?.paidAmount}
              />
            </div>
            <div className="col col-6 col-md-4 col-lg-3 form-group">
              <FormInput
                label="Change"
                type="number"
                value={(
                  invoiceDetails.paidAmount &&
                  invoiceDetails.paidAmount -
                    Object.values(items).reduce(
                      (total: number, item: InvoiceItemRowProps) => {
                        const totalAmount = item.quantity * item.mrp;
                        const netTotal = item.discount
                          ? total +
                            totalAmount -
                            (totalAmount * item.discount) / 100
                          : total + totalAmount;
                        return netTotal;
                      },
                      0
                    )
                ).toFixed(2)}
                disabled={true}
                error={invoiceError?.changeAmount}
              />
            </div>
          </div>

          {/* result message */}
          {notice.message && (
            <Alert className="mt-4" severity={notice.severity}>
              {notice.message}
            </Alert>
          )}
        </div>
      </form>
    </Box>
  );
};

export default FormInvoice;
