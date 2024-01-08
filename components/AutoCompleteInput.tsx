import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ReactNode, SyntheticEvent } from "react";
import { OptionProps } from "@/utils/props";
import { FormHelperText } from "@mui/material";

interface Props {
  freeSolo?: boolean;
  noOptionsText?: string;
  label?: string;
  value?: string | null;
  setInputOption?: (value: string) => void;
  setOption?: (option: any) => void;
  options: OptionProps[];
  startIcon?: ReactNode;
  error?: string;
}

const AutoCompleteInput = ({
  freeSolo = false,
  noOptionsText = "No options",
  label = "Options",
  value = null,
  setOption,
  setInputOption,
  options,
  startIcon,
  error = "",
}: Props) => {
  return (
    <div className="mb-4">
      <Autocomplete
        freeSolo={freeSolo}
        noOptionsText={noOptionsText}
        disablePortal
        onInputChange={(e, value: string) => {
          setInputOption && setInputOption(value);
          !setInputOption && setOption && setOption({ id: "", label: value });
        }}
        value={
          (
            options.filter(
              (option: OptionProps) => option.id === value
            )[0] as OptionProps
          )?.label ?? ""
        }
        onChange={(
          e: SyntheticEvent<Element, Event>,
          option: string | OptionProps | null
        ) => setOption && setOption(option)}
        options={options}
        isOptionEqualToValue={(option, value: string | OptionProps) =>
          options.filter((option) => option.id === value).length > 0
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{ ...params.InputProps, startAdornment: startIcon }}
          />
        )}
      />

      {error && (
        <FormHelperText className="text-danger" style={{ marginLeft: "1em" }}>
          {error}
        </FormHelperText>
      )}
    </div>
  );
};

export default AutoCompleteInput;
