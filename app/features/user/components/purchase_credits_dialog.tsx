import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useMutatePurchaseCredits } from "../hooks/use_mutate_purchase_credits";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
}

const CREDIT_PACKAGES = [
  { credits: 20, price: 0.99 },
  { credits: 60, price: 2.49 },
  { credits: 150, price: 4.99 },
  { credits: 400, price: 9.99 },
];

const PurchaseCreditsDialog: React.FC<PurchaseCreditsDialogProps> = ({
  open,
  onClose,
  onPurchaseSuccess,
}) => {
  const [selected, setSelected] = useState(0);
  const [paymentId, setPaymentId] = useState(""); // In real app, this comes from payment provider
  const { mutate, isPending, isSuccess, error, data } =
    useMutatePurchaseCredits({
      onSuccess: () => {
        if (onPurchaseSuccess) onPurchaseSuccess();
      },
    });

  const handlePurchase = () => {
    // In production, integrate with PayPal/Stripe and get paymentId
    mutate({
      credits: CREDIT_PACKAGES[selected].credits,
      paymentId: paymentId || "test-payment-id",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Buy Credits</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>Select a credit package:</Typography>
          {CREDIT_PACKAGES.map((pkg, idx) => (
            <Button
              key={pkg.credits}
              variant={selected === idx ? "contained" : "outlined"}
              onClick={() => setSelected(idx)}
              fullWidth
              sx={{ justifyContent: "space-between" }}
            >
              <span>{pkg.credits} credits</span>
              <span>${pkg.price.toFixed(2)}</span>
            </Button>
          ))}
          {/* Simulate payment ID input for demo/testing */}
          <TextField
            label="Payment ID (simulate)"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            fullWidth
            size="small"
          />
          {error && <Alert severity="error">{error.message}</Alert>}
          {isSuccess && (
            <Alert severity="success">
              Purchase successful! New balance: {data?.newBalance}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handlePurchase}
          variant="contained"
          disabled={isPending}
        >
          Buy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseCreditsDialog;
