"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  boxStyle,
  getID,
  getNotice,
  getRandomKey,
  getSuppliers,
  validate,
} from "@/utils/functions";
import { Alert, Box, Button, SelectChangeEvent } from "@mui/material";
import { DateRange, Groups, Numbers, Payment } from "@mui/icons-material";

import FormInput from "../FormInput";
import PurchaseMedicineRow from "./PurchaseMedicineRow";
import AutoCompleteInput from "../AutoCompleteInput";
import AddModal from "../AddModal";
import FormSupplier from "../supplier/FormSupplier";
import { ErrorProps, MedicineRowProps, OptionProps } from "@/utils/props";
import LoadingIcon from "../LoadingIcon";
import {
  defaultMedicineStock,
  defaultPaymentStatusesOptions,
} from "@/utils/defaults";

interface Props {
  purchaseId?: String | undefined;
  btnLabel?: String;
}

const FormPurchase = ({ purchaseId, btnLabel = "Add Purchase" }: Props) => {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(getNotice());
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState({
    supplier: "",
    invoiceNumber: purchaseId ?? getID(),
    paymentStatus: "due",
    date: new Date().toISOString().split("T").at(0),
  });
  const [purchaseError, setPurchaseError] = useState<ErrorProps>({});

  const initialKey = getRandomKey();
  const [medicines, setMedicines] = useState({
    [initialKey]: defaultMedicineStock,
  });
  const [medicinesError, setMedicinesError] = useState({
    [initialKey]: defaultMedicineStock,
  });

  useEffect(() => {
    (async () => setSuppliers(await getSuppliers()))();
  }, []);

  useEffect(() => {
    purchaseId &&
      (async () => {
        try {
          const url = `/api/purchases/${purchaseId}`;
          const response = await fetch(url);
          const purchase = await response.json();
          !purchase.error
            ? setPurchaseDetails({
                ...purchase,
                date: purchase.date?.split("T")?.at(0),
              })
            : setNotice({
                message: purchase.error,
                severity: "error",
              });
        } catch (error: any | unknown) {
          setNotice({
            message: error.message,
            severity: "error",
          });
        }
      })();
  }, [purchaseId, suppliers]);

  const addMedicineRow = () => {
    const key = getRandomKey();
    setMedicines((prev) => ({
      ...prev,
      [key]: defaultMedicineStock,
    }));
  };

  const removeMedicineRow = (key: string) => {
    if (Object.keys(medicines).length === 1) {
      return;
    }
    setMedicines((prev) => {
      delete prev[key];
      return { ...prev };
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setPurchaseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = validate(value, name);
    setPurchaseError((prev) => ({ ...prev, [name]: error }));
  };

  const setSupplier = (option: OptionProps) => {
    setPurchaseDetails((prev) => ({ ...prev, supplier: option?.id }));
  };

  const handleSubmit = (form: FormEvent) => {
    form.preventDefault();

    setLoading(true);
    setNotice(getNotice());

    fetch(`/api/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purchaseDetails,
        medicines,
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
      <form className="row" onSubmit={handleSubmit}>
        <div className="row col col-md-12">
          <div className="col col-md-3 form-group">
            <AutoCompleteInput
              label="Supplier"
              options={suppliers}
              value={purchaseDetails.supplier}
              setOption={setSupplier}
              startIcon={<Groups />}
              error={purchaseError.supplier}
            />
          </div>

          <div className="col col-md-2 form-group">
            <FormInput
              label="Invoice Number"
              name="invoiceNumber"
              disabled={true}
              startIcon={<Numbers />}
              value={purchaseDetails.invoiceNumber.toString()}
              onChange={handleChange}
              error={purchaseError.supplier}
            />
          </div>

          <div className="col col-md-2 form-group">
            <FormInput
              label="Payment Status"
              name="paymentStatus"
              type="select"
              value={purchaseDetails.paymentStatus}
              options={defaultPaymentStatusesOptions}
              onChange={handleChange}
              startIcon={<Payment />}
              error={purchaseError.paymentStatus}
            />
          </div>
          <div className="col col-md-2 form-group">
            <FormInput
              label="Date"
              name="date"
              type="date"
              value={purchaseDetails.date}
              onChange={handleChange}
              startIcon={<DateRange />}
              error={purchaseError.date}
            />
          </div>
        </div>
        {/* <!-- customer details content end --> */}

        {/* <!-- new user button --> */}
        <div className="row col col-md-12">
          <div className="col col-md-2 form-group">
            <AddModal
              btnLabel="New Supplier"
              btnVariant="contained"
              form={
                <FormSupplier
                  formTitle="Add New Supplier"
                  updateSuppliers={setSuppliers}
                />
              }
            />
          </div>
        </div>
        {/* <!-- closing new user button --> */}

        <hr className="my-4" />

        {/* <!-- start medicines --> */}
        {Object.entries(medicines).map(([key, medicine]) => (
          <PurchaseMedicineRow
            key={key}
            dataKey={key}
            medicine={medicine}
            setMedicines={setMedicines}
            medicineError={medicinesError[key]}
            setMedicinesError={setMedicinesError}
            addRowCallback={addMedicineRow}
            removeRowCallback={removeMedicineRow}
            disableDeleteButton={Object.keys(medicines).length === 1}
          />
        ))}
        {/* <!-- end medicines --> */}

        <hr className="mb-4" />

        <div className="row col col-md-12">
          <div className="col col-md-10"></div>
          <div className="col col-md-2 form-group float-end">
            <FormInput
              label="Grand Total"
              value={Object.values(medicines)
                .reduce(
                  (total: number, medicine: MedicineRowProps) =>
                    total + Number(medicine.quantity) * Number(medicine.rate),
                  0
                )
                .toFixed(2)}
              disabled={true}
            />
          </div>
        </div>

        <div className="row col col-md-12">
          <div className="col col-md-10"></div>
          <div className="col col-md-2 float-end">
            <Button
              type="submit"
              variant="contained"
              color="success"
              endIcon={loading && <LoadingIcon />}
              disabled={loading}
            >
              {btnLabel}
            </Button>
          </div>
        </div>

        {/* result message */}
        {notice.message && (
          <Alert className="mt-4" severity={notice.severity}>
            {notice.message}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default FormPurchase;
