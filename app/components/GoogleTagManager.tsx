import { useAnalytics } from "@shopify/hydrogen";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const PRODUCT_PAGE_DATA = {
  pagePostType: "product",
  pagePostType2: "single-product",
  pagePostAuthor: "admin",
  productRatingCounts: {
    2: 1,
    3: 1,
    5: 30,
  },
  productAverageRating: 4.84,
  productReviewCount: 32,
  productType: "simple",
  productIsVariable: 0,
};

const GTM_START_EVENT = {
  "gtm.start": 1719422875302,
  event: "gtm.js",
  "gtm.uniqueEventId": 1,
};

const PRODUCT_VIEW_EVENT = {
  ecommerce: {
    currency: "UAH",
    value: 135,
    items: [
      {
        item_id: 163262,
        item_name: "Перехідник HDMI to VGA гнучкий/77205",
        sku: "163262",
        price: 135,
        stocklevel: null,
        stockstatus: "instock",
        google_business_vertical: "retail",
        item_category: "HDMI - VGA",
        id: 163262,
      },
    ],
  },
  event: "view_item",
  "gtm.uniqueEventId": 6,
};

const ITEM_LIST_VIEW_EVENT = {
  event: "view_item_list",
  ecommerce: {
    currency: "UAH",
    items: [
      {
        item_id: 163084,
        item_name: "Перехідник HDMI to VGA Cablexpert (A-HDMI-VGA-02)",
        sku: "163084",
        price: "306.00",
        stocklevel: null,
        stockstatus: "instock",
        google_business_vertical: "retail",
        item_category: "HDMI - VGA",
        id: 163084,
        item_list_name: "Upsell Products",
        index: 1,
        product_type: "simple",
        item_brand: "",
      },
      {
        item_id: 180304,
        item_name: "Перехідник HDMI to VGA/ додаткове живлення/аудіо 77286",
        sku: "164128",
        price: "195.00",
        stocklevel: null,
        stockstatus: "instock",
        google_business_vertical: "retail",
        item_category: "HDMI - VGA",
        id: 180304,
        item_list_name: "Upsell Products",
        index: 2,
        product_type: "simple",
        item_brand: "",
      },
      {
        item_id: 163089,
        item_name: "Перехідник HDMI у VGA з аудіо входом 3.5 мм; 77036",
        sku: "163089",
        price: "170.00",
        stocklevel: null,
        stockstatus: "instock",
        google_business_vertical: "retail",
        item_category: "HDMI - VGA",
        id: 163089,
        item_list_name: "Upsell Products",
        index: 3,
        product_type: "simple",
        item_brand: "",
      },
      {
        item_id: 163533,
        item_name: "SODIMM DDR3L 8Gb 1600MHz Samsung M471B1G73DB0-YK0",
        sku: "163533",
        price: "500.00",
        stocklevel: null,
        stockstatus: "instock",
        google_business_vertical: "retail",
        item_category: "Пам'ять оперативна",
        id: 163533,
        item_list_name: "General Product List",
        index: 1,
        product_type: "simple",
        item_brand: "",
      },
      {
        item_id: 163193,
        item_name: "SODIMM DDR3L 8Gb 1600 MHz Samsung M471B1G73QH0-YK0",
        sku: "163193",
        price: "550.00",
        stocklevel: null,
        stockstatus: "instock",
        google_business_vertical: "retail",
        item_category: "Пам'ять оперативна",
        id: 163193,
        item_list_name: "General Product List",
        index: 2,
        product_type: "simple",
        item_brand: "",
      },
    ],
  },
  "gtm.uniqueEventId": 8,
};

const GTM_DOM_EVENT = {
  event: "gtm.dom",
  "gtm.uniqueEventId": 10,
};

const GTM_LOAD_EVENT = {
  event: "gtm.load",
  "gtm.uniqueEventId": 16,
};

export function GoogleTagManager() {
  const { subscribe, register } = useAnalytics();
  const { ready } = register("Google Tag Manager");

  useEffect(() => {
    window.dataLayer.push(PRODUCT_PAGE_DATA);
    window.dataLayer.push(GTM_START_EVENT);
    window.dataLayer.push(PRODUCT_VIEW_EVENT);
    window.dataLayer.push(ITEM_LIST_VIEW_EVENT);
    window.dataLayer.push(GTM_DOM_EVENT);
    window.dataLayer.push(GTM_LOAD_EVENT);

    subscribe("product_viewed", () => {
      window.dataLayer.push({
        event: "viewed-product",
        productId: "test-id",
        productName: "test-name",
        productPrice: "test-price",
        productCategory: "test-category",
      });
    });

    ready();
  }, []);

  return null;
}
