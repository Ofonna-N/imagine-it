import React, { useState } from "react";
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Card,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
  type ChipOwnProps,
} from "@mui/material";
import { FiPlus, FiCreditCard, FiAlertTriangle, FiStar } from "react-icons/fi";
import PurchaseCreditsDialog from "./purchase_credits_dialog";

interface CreditsBalanceProps {
  credits: number | undefined;
  isLoading: boolean;
  error: Error | null;
  showPurchaseButton?: boolean; // Allow disabling purchase button
  onCreditsUpdated?: () => void; // Callback after purchase
  variant?: "compact" | "card" | "minimal"; // Different display variants
  showLabel?: boolean; // Whether to show "Credits:" label
}

/**
 * Displays the current user's credit balance with optional purchase functionality.
 * Features enhanced visual design with gradient effects and better responsive layout.
 */
const CreditsBalance: React.FC<CreditsBalanceProps> = ({
  credits,
  isLoading,
  error,
  showPurchaseButton = true,
  onCreditsUpdated,
  variant = "compact",
  showLabel = true,
}) => {
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Loading credits...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <FiAlertTriangle color={theme.palette.error.main} size={16} />
        <Typography variant="body2" color="error">
          Failed to load credits
        </Typography>
      </Box>
    );
  }

  const handlePurchaseSuccess = () => {
    setPurchaseDialogOpen(false);
    onCreditsUpdated?.();
  };
  // Determine chip color and icon based on credit amount
  const creditCount = credits ?? 0;

  const getCreditLevel = (count: number) => {
    if (count === 0)
      return { level: "empty", color: "error", icon: FiAlertTriangle };
    if (count < 5)
      return { level: "low", color: "warning", icon: FiAlertTriangle };
    if (count < 15)
      return { level: "medium", color: "info", icon: FiCreditCard };
    if (count < 50) return { level: "good", color: "success", icon: FiStar };
    return { level: "excellent", color: "primary", icon: FiStar };
  };

  const creditLevel = getCreditLevel(creditCount);
  const CreditIcon = creditLevel.icon;
  // Get palette colors safely
  const getColorValue = (colorName: string) => {
    const paletteColor = theme.palette[
      colorName as keyof typeof theme.palette
    ] as any;
    return paletteColor?.main ?? theme.palette.primary.main;
  };

  const getDarkColorValue = (colorName: string) => {
    const paletteColor = theme.palette[
      colorName as keyof typeof theme.palette
    ] as any;
    return paletteColor?.dark ?? theme.palette.primary.dark;
  };

  const mainColor = getColorValue(creditLevel.color);
  const darkColor = getDarkColorValue(creditLevel.color);
  // Different variants for different use cases
  if (variant === "minimal") {
    return (
      <>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Chip
            icon={<CreditIcon size={14} />}
            label={creditCount}
            color={creditLevel.color as ChipOwnProps["color"]}
            size="small"
            sx={{
              fontWeight: 600,
              "& .MuiChip-icon": {
                fontSize: "14px !important",
              },
            }}
          />
          {showPurchaseButton && (
            <Tooltip title="Buy more credits">
              <IconButton
                size="small"
                onClick={() => setPurchaseDialogOpen(true)}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <FiPlus size={14} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <PurchaseCreditsDialog
          open={purchaseDialogOpen}
          onClose={() => setPurchaseDialogOpen(false)}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      </>
    );
  }

  if (variant === "card") {
    return (
      <>
        <Card
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${alpha(
              mainColor,
              0.1
            )}, ${alpha(mainColor, 0.05)})`,
            border: `1px solid ${alpha(mainColor, 0.2)}`,
            borderRadius: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${mainColor}, ${darkColor})`,
                  color: "white",
                }}
              >
                <CreditIcon size={16} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {creditCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {creditCount === 1 ? "Credit" : "Credits"} available
                </Typography>
              </Box>
            </Stack>
            {showPurchaseButton && (
              <Tooltip title="Buy more credits">
                <IconButton
                  onClick={() => setPurchaseDialogOpen(true)}
                  sx={{
                    color: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      bgcolor: theme.palette.primary.main,
                      color: "primary.contrastText",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <FiPlus />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Card>
        <PurchaseCreditsDialog
          open={purchaseDialogOpen}
          onClose={() => setPurchaseDialogOpen(false)}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      </>
    );
  }

  // Default 'compact' variant
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        sx={{
          p: 1.5,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(
            mainColor,
            0.08
          )}, ${alpha(mainColor, 0.03)})`,
          border: `1px solid ${alpha(mainColor, 0.15)}`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            border: `1px solid ${alpha(mainColor, 0.3)}`,
            transform: "translateY(-1px)",
            boxShadow: `0 4px 8px ${alpha(mainColor, 0.15)}`,
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${mainColor}, ${darkColor})`,
              color: "white",
            }}
          >
            <CreditIcon size={12} />
          </Box>
          {showLabel && (
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.primary"
            >
              Credits:
            </Typography>
          )}
          <Chip
            label={creditCount}
            color={creditLevel.color as any}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.875rem",
              minWidth: 40,
            }}
          />
        </Box>

        {showPurchaseButton && (
          <Tooltip title="Buy more credits" placement="top">
            <IconButton
              size="small"
              onClick={() => setPurchaseDialogOpen(true)}
              sx={{
                color: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: "primary.contrastText",
                  transform: "scale(1.1)",
                  boxShadow: `0 2px 8px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                },
                transition: "all 0.2s ease-in-out",
                ml: "auto",
              }}
            >
              <FiPlus size={14} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <PurchaseCreditsDialog
        open={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </>
  );
};

export default CreditsBalance;
