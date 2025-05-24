import React from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router";

interface NavigationItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isComingSoon?: boolean;
  onClick?: () => void;
}

/**
 * Reusable navigation item component with optional "Coming Soon" badge
 * Integrates with React Router and feature flag system
 */
export function NavigationItem({
  to,
  icon,
  text,
  isComingSoon = false,
  onClick,
}: Readonly<NavigationItemProps>) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  if (isComingSoon) {
    return (
      <ListItemButton
        component={Link}
        to={to}
        onClick={handleClick}
        selected={isActive}
        sx={{
          borderRadius: 0,
          borderLeft: "3px solid transparent",
          paddingTop: 1.25,
          paddingBottom: 1.25,
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            backgroundColor: "rgba(0,0,0,0.04)",
            borderLeftColor: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.08)",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText primary={text} sx={{ flex: 1 }} />
        <Chip
          label={
            <Box component="span">
              Coming
              <br />
              Soon
            </Box>
          }
          size="small"
          variant="outlined"
          color="secondary"
          sx={{
            fontSize: "0.5rem",
            "& .MuiChip-label": {
              px: 1,
            },
            py: 2,
            position: "absolute",
            right: 0,
          }}
        />
      </ListItemButton>
    );
  }
  return (
    <ListItemButton
      component={Link}
      to={to}
      onClick={handleClick}
      selected={isActive}
      sx={{
        borderRadius: 0,
        borderLeft: "3px solid transparent",
        paddingTop: 1.25,
        paddingBottom: 1.25,
        mb: 0.5,
        transition: "all 0.2s ease",
        "&.Mui-selected": {
          backgroundColor: "rgba(0,0,0,0.04)",
          borderLeftColor: "primary.main",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.08)",
          },
        },
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.04)",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}
