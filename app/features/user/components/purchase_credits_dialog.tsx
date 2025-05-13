import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Stack,
  Paper,
  useTheme,
} from "@mui/material";
import { useMutatePurchaseCredits } from "../hooks/use_mutate_purchase_credits";
import {
  PayPalButtons,
  type PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";
import { useQueryCreditPackages } from "../hooks/use_query_credit_packages";
import { TAX_RATE, calculateTax } from "~/utils/tax";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
}

const PurchaseCreditsDialog: React.FC<PurchaseCreditsDialogProps> = ({
  open,
  onClose,
  onPurchaseSuccess,
}) => {
  const { data, isLoading, error: packagesError } = useQueryCreditPackages();
  const [selected, setSelected] = useState(0);
  const {
    mutate,
    isPending,
    isSuccess,
    error,
    data: purchaseData,
  } = useMutatePurchaseCredits({
    onSuccess: () => {
      if (onPurchaseSuccess) onPurchaseSuccess();
    },
  });

  const creditPackages = data?.packages || [];
  const selectedPackage = creditPackages[selected] || creditPackages[0];
  const tax = selectedPackage ? calculateTax(selectedPackage.price) : 0;
  const total = selectedPackage ? +(selectedPackage.price + tax).toFixed(2) : 0;

  const paypalContainerBgColor = useTheme().palette.background.paper;
  const [isDebitCardExpanded, setIsDebitCardExpanded] = useState(false);
  // Instead of sending credits and price, send only packageId and paymentId to the backend
  const handleApprove: PayPalButtonsComponentProps["onApprove"] = async (
    data
  ) => {
    if (data.orderID && selectedPackage) {
      mutate({
        packageId: String(selectedPackage.id),
        paymentId: data.orderID,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Buy Credits</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>Select a credit package:</Typography>
          {isLoading && <Typography>Loading packages...</Typography>}
          {packagesError && (
            <Alert severity="error">{packagesError.message}</Alert>
          )}
          {creditPackages.map((pkg, idx) => (
            <Button
              key={pkg.id}
              variant={selected === idx ? "contained" : "outlined"}
              onClick={() => setSelected(idx)}
              fullWidth
              sx={{ justifyContent: "space-between" }}
            >
              <span>{pkg.credits} credits</span>
              <span>${pkg.price.toFixed(2)}</span>
            </Button>
          ))}
          {/* PayPal Button Integration */}
          {selectedPackage && (
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Subtotal: ${selectedPackage.price.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tax ({(TAX_RATE * 100).toFixed(2)}%): ${tax.toFixed(2)}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ fontWeight: 600 }}
              >
                Total: ${total.toFixed(2)}
              </Typography>
            </Stack>
          )}
          {selectedPackage && (
            <Paper
              id="paypal-button-container"
              component={"div"}
              style={{
                colorScheme: "none",
                backgroundColor: isDebitCardExpanded
                  ? "#ffff"
                  : paypalContainerBgColor,
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "blue",
                  height: 30,
                  label: "pay",
                }}
                createOrder={(_data, actions) => {
                  if (_data.paymentSource === "card") {
                    setIsDebitCardExpanded(true);
                  } else {
                    setIsDebitCardExpanded(false);
                  }

                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          value: total.toFixed(2),
                          currency_code: "USD",
                          breakdown: {
                            item_total: {
                              value: selectedPackage.price.toFixed(2),
                              currency_code: "USD",
                            },
                            tax_total: {
                              value: tax.toFixed(2),
                              currency_code: "USD",
                            },
                          },
                        },
                        description: `${selectedPackage.credits} credits for Imagine It`,
                      },
                    ],
                  });
                }}
                onApprove={handleApprove}
                onError={(err) => {
                  // Optionally handle PayPal errors
                  console.error("PayPal error", err);
                }}
                onCancel={() => {
                  setIsDebitCardExpanded(false);
                }}
              />
            </Paper>
          )}
          {error && <Alert severity="error">{error.message}</Alert>}
          {isSuccess && (
            <Alert severity="success">
              Purchase successful! New balance: {purchaseData?.newBalance}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseCreditsDialog;
