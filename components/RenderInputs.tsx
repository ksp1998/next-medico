import { ChangeEvent } from "react";
import FormInput from "./FormInput";
import { InputProps } from "@/utils/props";
import { SelectChangeEvent } from "@mui/material";

interface Props {
  inputs: InputProps[];
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => void;
}

const RenderInputs = ({ inputs, handleChange }: Props) => {
  return inputs.map((input) => (
    <FormInput
      key={input.name}
      type={input?.type ?? "text"}
      startIcon={input.startIcon}
      label={input.label}
      name={input.name}
      value={input.value ?? ""}
      onChange={handleChange}
      error={input.error}
      options={input?.options ?? []}
      disabled={input?.disabled ?? false}
    />
  ));
};

export default RenderInputs;
