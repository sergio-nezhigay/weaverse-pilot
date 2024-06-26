import { useAnalytics } from "@shopify/hydrogen";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const TEST_DATA = {
  productId: "test-id",
  productName: "test-name",
  productPrice: "test-price",
  productCategory: "test-category",
};

export function GoogleTagManager() {
  const { subscribe, register } = useAnalytics();
  const { ready } = register("Google Tag Manager");

  useEffect(() => {
    subscribe("product_viewed", () => {
      // Triggering a custom event in GTM when a product is viewed
      window.dataLayer.push({
        event: "viewed-product",
        ...TEST_DATA,
      });
    });

    ready();
  }, []);

  return null;
}
