import {
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

export default function PaypalProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    disableFunding: "paylater",
    components: ["buttons", "card-fields"],
    enableFunding: "venmo",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
