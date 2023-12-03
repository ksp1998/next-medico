import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FormInput from "../FormInput";
import { Add, Delete, Medication } from "@mui/icons-material";
import { Button, SelectChangeEvent } from "@mui/material";
import { getMedicines, validate } from "@/utils/functions";
import AutoCompleteInput from "../AutoCompleteInput";
import { MedicineRowProps, OptionProps } from "@/utils/props";

interface Props {
  dataKey: string;
  medicine: MedicineRowProps;
  setMedicines: Dispatch<SetStateAction<{ [key: string]: MedicineRowProps }>>;
  addRowCallback: () => void;
  removeRowCallback: (key: string) => void;
  disableDeleteButton?: boolean;
  medicineError: MedicineRowProps;
  setMedicinesError: Dispatch<
    SetStateAction<{ [x: string]: MedicineRowProps }>
  >;
}

const PurchaseMedicineRow = ({
  dataKey,
  medicine,
  setMedicines,
  addRowCallback,
  removeRowCallback,
  disableDeleteButton = false,
  medicineError,
  setMedicinesError,
}: Props) => {
  const [medicineOptions, setMedicineOptions] = useState([]);

  useEffect(() => {
    (async () => setMedicineOptions(await getMedicines()))();
  }, []);

  const setMedicineIdName = (option: OptionProps) => {
    setMedicines((prev) => ({
      ...prev,
      [dataKey]: {
        ...medicine,
        id: option?.id ?? "",
        name: option?.label ?? "",
      },
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setMedicines((prev) => ({
      ...prev,
      [dataKey]: { ...medicine, [name]: value },
    }));
    let error = validate(value, name);
    setMedicinesError((prev) => ({
      ...prev,
      [dataKey]: { ...medicineError, [name]: error },
    }));

    // if (name == "mrp" || name == "rate") {
    //   let mrpError = "",
    //     rateError = "";
    //   if (Number(medicine.mrp) <= Number(medicine.rate)) {
    //     mrpError = "MRP should be greater than Rate!";
    //     rateError = "Rate should be less than MRP!";
    //   }
    //   setMedicinesError((prev) => ({
    //     ...prev,
    //     [dataKey]: {
    //       ...medicineError,
    //       mrp: mrpError,
    //       rate: rateError,
    //     },
    //   }));
    // }
  };

  return (
    <>
      <div className="row col col-md-12">
        <div className="col col-md-2">
          <AutoCompleteInput
            freeSolo={true}
            label="Medicine"
            value={
              (
                medicineOptions.filter(
                  (option: OptionProps) => option.id === medicine.name
                )[0] as OptionProps
              )?.label
            }
            // setInputOption={setMedicineName}
            setOption={setMedicineIdName}
            options={medicineOptions}
            startIcon={<Medication />}
            error={medicineError?.name}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Packing"
            name="packing"
            value={medicine.packing}
            onChange={handleChange}
            placeholder="e.g. 10 TAB"
            error={medicineError?.packing}
          />
        </div>
        <div className="col col-md-2">
          <FormInput
            label="Batch ID"
            name="batchId"
            value={medicine.batchId}
            onChange={handleChange}
            placeholder="e.g. M123"
            error={medicineError?.batchId}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Expiry"
            name="expiry"
            value={medicine.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
            error={medicineError?.expiry}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Quantity"
            name="quantity"
            value={medicine.quantity}
            onChange={handleChange}
            type="number"
            error={medicineError?.quantity}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="MRP"
            name="mrp"
            value={medicine.mrp}
            onChange={handleChange}
            type="number"
            error={medicineError?.mrp}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Rate"
            name="rate"
            value={medicine.rate}
            onChange={handleChange}
            type="number"
            error={medicineError?.rate}
          />
        </div>
        <div className="row col col-md-3">
          <div className="col col-md-7">
            <FormInput
              label="Amount"
              value={(
                Number(medicine.quantity) * Number(medicine.rate)
              ).toFixed(2)}
              onChange={handleChange}
              disabled={true}
            />
          </div>
          <div className="col col-md-5 d-flex gap-2">
            <Button
              variant="contained"
              sx={{ height: "67.5%" }}
              onClick={addRowCallback}
            >
              <Add />
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ height: "67.5%" }}
              onClick={() => removeRowCallback(dataKey)}
              disabled={disableDeleteButton}
            >
              <Delete />
            </Button>
          </div>
        </div>
      </div>
      <br />
      {!medicine?.id && medicine?.name && (
        <div className="row col col-md-8">
          <div className="col col-md-8">
            <FormInput
              label="New Medicine, Generic Name?"
              name="genericName"
              value={medicine.genericName}
              onChange={handleChange}
              placeholder="Generic Name"
              error={medicineError?.genericName}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseMedicineRow;
