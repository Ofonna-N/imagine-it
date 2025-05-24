import React from "react";
import { ComingSoonPage } from "~/components/coming_soon_page";

export default function MyDesignsComingSoon() {
  const handleNotifyMe = () => {
    // Track interest in the feature
    console.log("User interested in: My Designs");
    alert("We'll notify you when My Designs launches!");
  };

  return (
    <ComingSoonPage
      featureName="My Designs"
      description="Save, organize, and reuse your favorite designs across multiple products. Build your own library of creative assets."
      estimatedLaunch="Coming in the next update"
      onNotifyMe={handleNotifyMe}
    />
  );
}
