import { Loop } from "@mui/icons-material";

const LoadingIcon = () => {
  return (
    <Loop
      sx={{
        animation: "spin 2s linear infinite",
        "@keyframes spin": {
          "0%": {
            transform: "rotate(360deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
      }}
    />
  );
};

export default LoadingIcon;
