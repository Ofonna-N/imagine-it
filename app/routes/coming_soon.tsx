import React from "react";
import { useLocation } from "react-router";
import { ComingSoonPage } from "~/components/coming_soon_page";
import { APP_ROUTES } from "~/constants/route_paths";

export default function ComingSoon() {
  const location = useLocation();

  // Determine which feature based on current path
  const getFeatureInfo = () => {
    switch (location.pathname) {
      case APP_ROUTES.MY_DESIGNS:
        return {
          featureName: "My Designs",
          description:
            "Save, organize, and reuse your favorite designs across multiple products.",
          estimatedLaunch: "Coming in the next update",
        };
      case APP_ROUTES.IMAGE_GENERATION:
        return {
          featureName: "Design Playground",
          description:
            "Create and experiment with AI images in a dedicated workspace before applying to products.",
          estimatedLaunch: "Coming soon",
        };
      default:
        return {
          featureName: "New Feature",
          description: "We're working on something amazing for you!",
        };
    }
  };

  const featureInfo = getFeatureInfo();

  const handleNotifyMe = () => {
    // Track interest in the feature
    // Could integrate with email signup or analytics
    console.log(`User interested in: ${featureInfo.featureName}`);
    // TODO: Show success message
    alert("We'll notify you when this feature launches!");
  };

  return <ComingSoonPage {...featureInfo} onNotifyMe={handleNotifyMe} />;
}
