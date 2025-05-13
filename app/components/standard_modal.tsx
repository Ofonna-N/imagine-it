import React from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button, { type ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface StandardModalAction {
  label: string;
  onClick: () => void;
  buttonProps?: {
    color?: ButtonProps["color"];
    disabled?: boolean;
    // Add more MUI Button props as needed
  };
}

interface StandardModalProps {
  open: boolean;
  onClose: () => void;
  dialogProps?: {
    title?: string;
    maxWidth?: DialogProps["maxWidth"];
    fullWidth?: boolean;
  };
  status?: "idle" | "pending" | "success" | "error";
  actions?: StandardModalAction[];
  children?: React.ReactNode;
}

/**
 * StandardModal - a reusable dialog/modal for feedback, status, and actions.
 * Optionally shows a loading spinner for 'pending' status.
 * Props are grouped for clarity: dialogProps, buttonProps, etc.
 */
const StandardModal: React.FC<StandardModalProps> = ({
  open,
  onClose,
  dialogProps = {},
  status,
  actions = [],
  children,
}) => {
  const { title, maxWidth = "xs", fullWidth = true } = dialogProps;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {status === "pending" && (
          <CircularProgress size={24} sx={{ display: "block", mb: 2 }} />
        )}
        {children}
      </DialogContent>
      {actions.length > 0 && (
        <DialogActions>
          {actions.map((action, idx) => (
            <Button
              key={action.label + idx}
              onClick={action.onClick}
              color={action.buttonProps?.color ?? "primary"}
              disabled={action.buttonProps?.disabled}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default StandardModal;
