# Shopify Theme Development Assignment

Implementation of the two requested Figma tests as reusable Shopify theme sections on a Dawn-based development store.

## Tests

### Test 1 — Landing Page
Built as three independent Shopify sections:

- **Test 1 - Hero**
  - Full-bleed background image
  - Headline image or text
  - Collection CTA
  - Reviews tab
  - Merchant-controlled Reviews behavior: Display, Popup, or Link
  - Popup reviews are merchant-editable
  - Responsive and keyboard accessible

- **Test 1 - Drop Teaser**
  - Two-panel layout
  - Pattern background
  - Script heading
  - Real-time countdown
  - Merchant-configurable countdown date/time
  - Completion state when countdown reaches zero
  - Shopify customer/newsletter form for email capture
  - Success and error states
  - Merchant-editable copy and imagery

- **Test 1 - Display Text**
  - Real text with image/video-style fill using CSS text clipping
  - Fallback styling so text remains visible where clipping is unsupported
  - Merchant-editable text and image

### Test 2 — Product Grid
Built as a reusable collection grid with a reusable product-card snippet.

- Real Shopify product and variant data
- Colour swatches
- Variant image switching
- Variant price and compare-at-price updates
- Variant-specific product URLs
- Sold-out state handling
- Clearance and Final Sale badges from product tags
- Vendor and product-type display controls
- Overflow indicator for additional colours
- Quick add using Shopify's cart endpoint
- Double-click protection and error handling
- Custom cart page and product template for the development store

## Theme Structure

```text
assets/
  test-1.css
  test-1.js
  test-2-product-card.css
  test-2-product-card.js

sections/
  test-1-hero.liquid
  test-1-drop-teaser.liquid
  test-1-display-text.liquid
  test-2-product-grid.liquid
  test-2-product-page.liquid
  test-2-cart.liquid

snippets/
  test-2-product-card.liquid

templates/
  index.json
  product.json
  cart.json
```

## Merchant Configuration

The sections are designed to be added, reordered and configured from the Shopify theme editor. Settings use merchant-facing labels rather than implementation-oriented names.

## Responsive Behaviour

Desktop is matched to the supplied Figma design width. Tablet/mobile layouts collapse multi-column content, reduce typography and control spacing so content remains usable without horizontal overflow.

Primary mobile breakpoint: **749px**. A secondary small-device adjustment is used around **420px** where needed.

## Accessibility

- Keyboard-reachable interactive controls
- Visible focus states
- Meaningful image alt text
- Semantic headings and buttons
- ARIA labels for variant controls and dialogs
- Reduced-motion handling
- Sold-out states are exposed to assistive technology

## Assets and Fonts

Images were prepared for web delivery and referenced through Shopify Liquid image helpers where applicable.

Where the exact display font could not be reliably depended on as a web-licensed font, a system/serif fallback is used. This is documented in the implementation rather than bundling unlicensed font files.

## Notes / Assumptions

- The Figma file is treated as the visual specification.
- The Reviews popup is an enhancement controlled by the merchant while preserving the original vertical Reviews-tab treatment.
- Countdown input uses separate date and time controls so merchants do not need to enter an ISO timestamp manually.
- Product colour behaviour relies on real Shopify variant data and variant-associated media. If a variant has no dedicated image, the card retains the product image rather than showing a broken image.
- Test products in the development store are intentionally configured to exercise multiple colours, sold-out states, compare-at pricing, long titles and missing-image handling.

## Local Development

Run the theme locally with Shopify CLI:

```bash
shopify theme dev --store hoddisa.myshopify.com
```

## QA Checklist

Before submission:

- Both Test 1 and Test 2 visible on one page
- Product colour swatches work
- Variant image/price/link updates work
- Quick Add works and handles repeated clicks/errors
- Cart page works
- Countdown reaches zero correctly
- Newsletter form shows success/error states
- Theme editor add/reorder/edit works
- No browser console errors
- Shopify Theme Check passes

## Repository

GitHub: https://github.com/maazkh10/shopify-ass
