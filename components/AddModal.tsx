import { Add } from "@mui/icons-material";
import { Button, Modal } from "@mui/material";
import { CSSProperties, ReactNode, useState } from "react";

interface Props {
  btnLabel: string;
  btnVariant?: "text" | "contained" | "outlined" | undefined;
  btnColor?:
    | "primary"
    | "inherit"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  btnStyle?: object;
  form: ReactNode;
}

const AddModal = ({
  btnLabel,
  btnVariant,
  btnColor = "primary",
  btnStyle = { fontWeight: "bold", textTransform: "unset" },
  form,
}: Props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "max(40%, 340px)",
    boxShadow: "24px",
  };

  return (
    <>
      <Button
        variant={btnVariant}
        color={btnColor}
        startIcon={<Add />}
        onClick={handleOpen}
        style={btnStyle}
      >
        {btnLabel}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <div style={style}>{form}</div>
      </Modal>
    </>
  );
};

export default AddModal;
