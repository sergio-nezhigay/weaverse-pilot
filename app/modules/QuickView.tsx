import { useFetcher } from "@remix-run/react";
import type { Jsonify } from "@remix-run/server-runtime/dist/jsonify";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { getExcerpt } from "~/lib/utils";
import { ProductDetail } from "~/sections/product-information/product-detail";
import { AddToCartButton } from "./AddToCartButton";
import { ProductMedia } from "./product-form/product-media";
import { Quantity } from "./product-form/quantity";
import { ProductVariants } from "./product-form/variants";
import type { ProductData } from "~/lib/products";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function QuickView(props: { data: Jsonify<ProductData> }) {
  const { data } = props;

  let themeSettings = useThemeSettings();
  let swatches = themeSettings?.swatches || {
    configs: [],
    swatches: {
      imageSwatches: [],
      colorSwatches: [],
    },
  };
  let { product, variants: _variants, storeDomain, shop } = data || {};

  let [selectedVariant, setSelectedVariant] = useState<any>(
    product?.selectedVariant,
  );

  let variants = _variants?.product?.variants;
  let [quantity, setQuantity] = useState<number>(1);
  let {
    addToCartText,
    soldOutText,
    unavailableText,
    showShippingPolicy,
    showRefundPolicy,
    hideUnavailableOptions,
    showThumbnails,
    numberOfThumbnails,
    spacing,
  } = themeSettings;
  let handleSelectedVariantChange = (variant: any) => {
    setSelectedVariant(variant);
  };
  console.log("🚀 ~ QuickView ~ selectedVariant:", selectedVariant);
  useEffect(() => {
    if (variants?.nodes?.length) {
      if (!selectedVariant) {
        setSelectedVariant(variants?.nodes?.[0]);
      } else if (selectedVariant?.id !== product?.selectedVariant?.id) {
        setSelectedVariant(product?.selectedVariant);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const { shippingPolicy, refundPolicy } = shop;

  const { title, vendor, descriptionHtml } = product;
  let atcText = selectedVariant?.availableForSale
    ? addToCartText
    : selectedVariant?.quantityAvailable === -1
      ? unavailableText
      : soldOutText;
  return (
    <div className="p-10 rounded-md bg-background w-[80vw] max-w-[1200px]">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
        <ProductMedia
          media={product?.media.nodes}
          selectedVariant={selectedVariant}
          showThumbnails={showThumbnails}
          numberOfThumbnails={numberOfThumbnails}
          spacing={spacing}
        />
        <div className="flex flex-col justify-start space-y-5">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-medium tracking-tighter sm:text-5xl">
                {title}
              </h2>
            </div>
            <p className="text-xl md:text-2xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed flex gap-3">
              {selectedVariant && selectedVariant.compareAtPrice && (
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.compareAtPrice}
                  className="text-label-sale line-through"
                  as="span"
                />
              )}

              {selectedVariant ? (
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.price}
                  as="span"
                />
              ) : null}
            </p>
            <ProductVariants
              product={product}
              selectedVariant={selectedVariant}
              onSelectedVariantChange={handleSelectedVariantChange}
              swatch={swatches}
              variants={variants}
              options={product?.options}
              handle={product?.handle}
              hideUnavailableOptions={hideUnavailableOptions}
            />
          </div>
          <Quantity value={quantity} onChange={setQuantity} />
          <AddToCartButton
            disabled={!selectedVariant?.availableForSale}
            lines={[
              {
                merchandiseId: selectedVariant?.id,
                quantity,
                selectedVariant,
              },
            ]}
            data-test="add-to-cart"
            className="w-[360px]"
          >
            <span> {atcText}</span>
          </AddToCartButton>
          {selectedVariant?.availableForSale && (
            <ShopPayButton
              width="100%"
              variantIdsAndQuantities={[
                {
                  id: selectedVariant?.id,
                  quantity,
                },
              ]}
              storeDomain={storeDomain}
            />
          )}
          <p
            className="max-w-[600px] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />
          <div className="grid gap-4 py-4">
            {showShippingPolicy && shippingPolicy?.body && (
              <ProductDetail
                title="Shipping"
                content={getExcerpt(shippingPolicy.body)}
                learnMore={`/policies/${shippingPolicy.handle}`}
              />
            )}
            {showRefundPolicy && refundPolicy?.body && (
              <ProductDetail
                title="Returns"
                content={getExcerpt(refundPolicy.body)}
                learnMore={`/policies/${refundPolicy.handle}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickViewTrigger(props: { productHandle: string }) {
  let [quickAddOpen, setQuickAddOpen] = useState(false);
  const { productHandle } = props;
  let { load, data, state } = useFetcher<ProductData>();
  useEffect(() => {
    if (quickAddOpen && !data && state !== "loading") {
      load(`/api/query/products?handle=${productHandle}`);
    }
  }, [quickAddOpen, data, load, state]);
  return (
    <>
      <div className="mt-2 absolute bottom-4 hidden lg:group-hover:block py-5 px-3 w-full opacity-100 bg-[rgba(238,239,234,0.10)] backdrop-blur-2xl">
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickAddOpen(true);
          }}
          loading={state === "loading"}
          className="w-full"
        >
          Select options
        </Button>
      </div>
      {quickAddOpen && data && (
        <Modal cancelLink="" onClose={() => setQuickAddOpen(false)}>
          <QuickView data={data} />
        </Modal>
      )}
    </>
  );
}
