import React from "react";
import { Typography, Box, Chip } from "@mui/material";

interface CreditsBalanceProps {
  credits: number | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Displays the current user's credit balance.
 */
const CreditsBalance: React.FC<CreditsBalanceProps> = ({
  credits,
  isLoading,
  error,
}) => {
  if (isLoading) return <Typography>Loading credits...</Typography>;
  if (error)
    return <Typography color="error">Failed to load credits</Typography>;

  console.log("Credits:", credits);
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="subtitle2">Credits:</Typography>
      <Chip label={credits ?? 0} color="primary" size="small" />
    </Box>
  );
};

export default CreditsBalance;
