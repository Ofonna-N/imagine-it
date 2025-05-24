import React from "react";
import { ComingSoonPage } from "~/components/coming_soon_page";

export default function ImageGenerationComingSoon() {
  const handleNotifyMe = () => {
    // Track interest in the feature
    console.log("User interested in: Design Playground");
    alert("We'll notify you when the Design Playground launches!");
  };

  return (
    <ComingSoonPage
      featureName="Design Playground"
      description="Create and experiment with AI images in a dedicated workspace before applying to products. Perfect for exploring creative ideas."
      estimatedLaunch="Coming soon"
      onNotifyMe={handleNotifyMe}
    />
  );
}
