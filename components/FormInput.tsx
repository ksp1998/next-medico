import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  useState,
} from "react";
import { OptionProps } from "@/utils/props";

interface Props {
  startIcon?: ReactNode;
  label?: String;
  type?: HTMLInputTypeAttribute;
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => void;
  error?: String;
  success?: String;
  options?: OptionProps[];
  disabled?: boolean;
  readOnly?: boolean;
}

const FormInput = ({
  startIcon,
  label,
  type = "text",
  id = "",
  name = "",
  value = "",
  placeholder = "",
  onChange = () => {},
  error = "",
  success = "",
  options = [],
  disabled = false,
  readOnly = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputProps = {
    readOnly,
    startAdornment: startIcon && (
      <InputAdornment position="start">{startIcon}</InputAdornment>
    ),
    endAdornment: type === "password" && (
      <InputAdornment position="end">
        <IconButton
          aria-label="Toggle Password Visibility"
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  };

  let input;
  switch (type) {
    case "autocomplete":
      input = <></>;
      break;
    case "select":
      input = (
        <>
          <InputLabel id={`label-${name}`}>{label}</InputLabel>
          <Select
            name={name}
            label={label}
            labelId={`label-${name}`}
            value={value}
            startAdornment={
              startIcon && (
                <InputAdornment position="start">{startIcon}</InputAdornment>
              )
            }
            onChange={onChange}
            disabled={disabled}
          >
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </>
      );
      break;
    case "mui-date":
      input = <></>;
      break;
    default:
      input = (
        <TextField
          label={label}
          type={type === "password" ? (showPassword ? "text" : type) : type}
          id={id || name}
          name={name}
          placeholder={placeholder}
          value={value}
          InputProps={inputProps}
          onChange={onChange}
          multiline={type === "textarea"}
          rows={type === "textarea" ? 3 : 1}
          disabled={disabled}
          autoComplete={type === "password" ? "off" : "on"}
        />
      );
  }

  return (
    <FormControl fullWidth sx={{ marginBottom: 3 }}>
      {input}

      {error && (
        <FormHelperText sx={{ ml: 0.5 }} className="text-danger">
          {error}
        </FormHelperText>
      )}

      {!error && success && (
        <FormHelperText sx={{ ml: 0.5 }} className="text-success">
          {success}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FormInput;
