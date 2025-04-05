import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
} from "@mui/material";
import { FiChevronDown, FiPackage, FiMail } from "react-icons/fi";
import { Link } from "react-router";

// Mock orders data
const orders = [
  {
    id: "ORD-1001",
    date: "2023-11-15",
    status: "Delivered",
    total: 64.97,
    items: [
      { name: "T-Shirt with Mountain Design", quantity: 2, price: 24.99 },
      { name: "Mug with Abstract Pattern", quantity: 1, price: 14.99 },
    ],
    shippingAddress: "123 Main St, Anytown, AN 12345",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-1002",
    date: "2023-11-25",
    status: "Processing",
    total: 39.99,
    items: [
      { name: "Hoodie with Space Explorer Design", quantity: 1, price: 39.99 },
    ],
    shippingAddress: "123 Main St, Anytown, AN 12345",
    trackingNumber: null,
  },
];

export default function Orders() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            You haven't placed any orders yet
          </Typography>
          <Button variant="contained" href="/products" sx={{ mt: 2 }}>
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <>
                  <TableRow key={order.id}>
                    <TableCell component="th" scope="row">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "Delivered"
                            ? "success"
                            : order.status === "Shipped"
                            ? "info"
                            : order.status === "Processing"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Accordion
                        sx={{
                          boxShadow: "none",
                          "&:before": { display: "none" },
                        }}
                      >
                        <AccordionSummary expandIcon={<FiChevronDown />}>
                          <Typography variant="body2">Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="subtitle2" gutterBottom>
                            Items
                          </Typography>
                          {order.items.map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {item.name} x {item.quantity}
                              </Typography>
                              <Typography variant="body2">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          ))}

                          <Divider sx={{ my: 2 }} />

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Shipping Address
                              </Typography>
                              <Typography variant="body2">
                                {order.shippingAddress}
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Tracking
                              </Typography>
                              {order.trackingNumber ? (
                                <>
                                  <Typography variant="body2">
                                    {order.trackingNumber}
                                  </Typography>
                                  <Button
                                    size="small"
                                    startIcon={<FiPackage />}
                                    sx={{ mt: 1 }}
                                  >
                                    Track Package
                                  </Button>
                                </>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Tracking will be available when your order
                                  ships
                                </Typography>
                              )}
                            </Grid>
                          </Grid>

                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button startIcon={<FiMail />} size="small">
                              Contact Support
                            </Button>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
