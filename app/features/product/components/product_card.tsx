import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router";
import { FiEdit } from "react-icons/fi";
import type { PrintfulV2CatalogProduct } from "~/types/printful/catalog_product_types";

interface ProductCardProps {
  readonly product: PrintfulV2CatalogProduct;
  readonly featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const previewImage = product.image || "";

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "visible",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: "1px",
          background:
            "linear-gradient(45deg, transparent 50%, rgba(121, 40, 202, 0.1) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        },
      }}
    >
      {featured && (
        <Chip
          label="Featured"
          color="secondary"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            fontWeight: 600,
            background: "linear-gradient(45deg, #FF0080, #FFA3CA)",
            color: "#FFF",
            boxShadow: "0 4px 12px rgba(255, 0, 128, 0.3)",
          }}
        />
      )}

      {/* Customize & Buy badge */}
      <Chip
        label="Customize & Buy"
        color="primary"
        size="small"
        icon={<FiEdit size={12} />}
        sx={{
          position: "absolute",
          top: featured ? 40 : 8,
          right: 8,
          zIndex: 10,
          fontWeight: 600,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(121, 40, 202, 0.9)"
              : "rgba(182, 101, 255, 0.9)",
          color: "#FFF",
          boxShadow: "0 4px 12px rgba(121, 40, 202, 0.3)",
        }}
      />

      <CardActionArea
        component={Link}
        to={`/products/${product.id}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "4px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "4px",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <CardMedia
            component="img"
            image={previewImage}
            alt={product.name}
            sx={{
              objectFit: "contain",
              bgcolor: "background.paper",
              p: { xs: 1, sm: 1.5 },
              transition: "transform 0.4s cubic-bezier(0.3, 0, 0.3, 1)",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "40%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.05), transparent)",
              opacity: 0.5,
            }}
          />
        </Box>
        <CardContent
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 2 },
            pb: { xs: 1.5, sm: 1.5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle1"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              lineHeight: 1.4,
              minHeight: "2.8em",
              mb: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {product.name}
          </Typography>

          <Box>
            {/* Product type display */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                textAlign: "center",
                fontSize: "0.75rem",
                fontWeight: 500,
                px: 1,
                py: 0.25,
                mx: "auto",
                borderRadius: "4px",
                width: "fit-content",
                mb: 0.75,
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.04)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              {product.type}
            </Typography>

            {/* Customize hint text */}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                color: "text.secondary",
                fontStyle: "italic",
                fontSize: "0.7rem",
              }}
            >
              Click to customize with your design
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
