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
import AutoCompleteInput from "../AutoCompleteInput";
import { getMedicines, validate } from "@/utils/functions";
import {
  ErrorProps,
  InvoiceItemRowProps,
  MedicineStockProps,
  OptionProps,
} from "@/utils/props";

interface Props {
  dataKey: string;
  item: InvoiceItemRowProps;
  setItems: Dispatch<SetStateAction<{ [x: string]: InvoiceItemRowProps }>>;
  addRowCallback: () => void;
  removeRowCallback: (key: string) => void;
  disableDeleteButton?: boolean;
  itemError: ErrorProps;
  setItemsError: Dispatch<SetStateAction<{ [x: string]: ErrorProps }>>;
}

const InvoiceItemRow = ({
  dataKey,
  item,
  setItems,
  addRowCallback,
  removeRowCallback,
  disableDeleteButton = false,
  itemError,
  setItemsError,
}: Props) => {
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [batchIdOptions, setBatchIdOptions] = useState([]);

  useEffect(() => {
    (async () => setMedicineOptions(await getMedicines()))();
  }, []);

  useEffect(() => {
    (async () => {
      if (!item?.medicine) {
        setBatchIdOptions([]);
        return;
      }
      const response = await fetch(
        `/api/medicines/stock?medicine=${item.medicine}`
      );
      const stock = await response.json();
      const itemsStock = stock?.medicinesStock ?? [];

      setBatchIdOptions(
        itemsStock.map((stock: MedicineStockProps) => ({
          id: stock._id,
          label: stock.batchId,
          ...stock,
        }))
      );
    })();
  }, [item.medicine]);

  const setMedicine = (option: OptionProps) => {
    setItems((prev) => ({
      ...prev,
      [dataKey]: { ...item, medicine: option?.id ?? "", stock: "" },
    }));
  };

  const setStock = (option: OptionProps) => {
    setItems((prev) => ({
      ...prev,
      [dataKey]: {
        ...item,
        stock: option?.id ?? "",
        availableQuantity: (option?.stock ?? 0) - (option?.sold ?? 0),
        expiry: option?.expiry ?? "",
        mrp: option?.mrp ?? 0,
      },
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems((prev) => ({
      ...prev,
      [dataKey]: { ...item, [name]: value },
    }));
    let error = validate(value, name);
    setItemsError((prev) => ({
      ...prev,
      [dataKey]: { ...itemError, [name]: error },
    }));
  };

  return (
    <div className="row col col-md-12">
      <div className="row col col-md-12">
        <div className="col-md-2">
          <AutoCompleteInput
            label="Medicine"
            noOptionsText="No items"
            value={item.medicine}
            setOption={setMedicine}
            options={medicineOptions}
            startIcon={<Medication />}
            error={itemError?.medicine}
          />
        </div>
        <div className="col col-md-2">
          <AutoCompleteInput
            label="Batch ID"
            noOptionsText="No stock"
            value={item.stock}
            setOption={setStock}
            options={batchIdOptions}
            error={itemError?.stock}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Ava. Qty."
            type="number"
            value={item.availableQuantity.toString()}
            error={itemError?.availableQuantity}
            disabled={true}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Expiry"
            value={item.expiry}
            error={itemError?.expiry}
            disabled={true}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Quantity"
            type="number"
            name="quantity"
            value={item.quantity.toString()}
            error={itemError?.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="MRP"
            type="number"
            value={item.mrp.toFixed(2)}
            error={itemError?.mrp}
            disabled={true}
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Discount (%)"
            type="number"
            name="discount"
            value={item.discount.toString(2)}
            error={itemError?.discount}
            onChange={handleChange}
            success={
              item.discount
                ? "Discount: " +
                  ((item.quantity * item.mrp * item.discount) / 100).toFixed(2)
                : ""
            }
          />
        </div>
        <div className="col col-md-1">
          <FormInput
            label="Amount"
            type="number"
            value={(item.quantity * item.mrp).toFixed(2)}
            disabled={true}
          />
        </div>
        <div className="col col-md-2 d-flex gap-2">
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
  );
};

export default InvoiceItemRow;
