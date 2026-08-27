/* =========================================================
   TEST 2 — PRODUCT CARD
   ========================================================= */

(function () {
  'use strict';


  /* =======================================================
     UPDATE CART COUNT
     ======================================================= */

  function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll(
      '.cart-count-bubble, [data-cart-count], .cart-count'
    );

    cartCountElements.forEach(function (element) {
      const countBubble =
        element.closest('.cart-count-bubble') || element;

      if (count > 0) {
        countBubble.textContent = count;
        countBubble.hidden = false;
      } else {
        countBubble.textContent = '';
        countBubble.hidden = true;
      }
    });
  }


  /* =======================================================
     REFRESH CART
     ======================================================= */

  async function refreshCart() {
    try {
      const response = await fetch('/cart.js', {
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        return;
      }

      const cart = await response.json();

      updateCartCount(cart.item_count);

      /*
       * Tell the theme that the cart changed.
       */
      document.dispatchEvent(
        new CustomEvent('cart:refresh', {
          bubbles: true,
          detail: {
            cart: cart
          }
        })
      );

    } catch (error) {
      console.error('Cart refresh failed:', error);
    }
  }



  
  /* =======================================================
     SELECT VARIANT
     ======================================================= */

  function selectVariant(swatch) {

    const card = swatch.closest('[data-product-card]');

    if (!card) {
      return;
    }

    const variantId = swatch.dataset.variantId;

    if (!variantId) {
      return;
    }


    /* =====================================================
       VARIANT DATA
       ===================================================== */

    const available =
      swatch.dataset.variantAvailable === 'true';

    const variantUrl =
      swatch.dataset.variantUrl;

    const imageUrl =
      swatch.dataset.variantImage;

    const imageAlt =
      swatch.dataset.variantImageAlt ||
      card.dataset.productHandle;


    /* =====================================================
       CARD ELEMENTS
       ===================================================== */

    const imageLink =
      card.querySelector('[data-product-link]');

    const image =
      card.querySelector('.test-2-card__image');

    const placeholder =
      card.querySelector('.test-2-card__image-placeholder');

    const quickAdd =
      card.querySelector('[data-quick-add]');

    const soldOutMessage =
      card.querySelector('[data-sold-out-message]');

    const currentPrice =
      card.querySelector('.test-2-card__current-price');

    const comparePrice =
      card.querySelector('[data-compare-price]');

    const priceContainer =
      card.querySelector('[data-price]');


    /* =====================================================
       UPDATE SELECTED SWATCH
       ===================================================== */

    card
      .querySelectorAll('.test-2-card__swatch')
      .forEach(function (item) {

        const selected =
          item === swatch;

        item.classList.toggle(
          'is-selected',
          selected
        );

        item.setAttribute(
          'aria-pressed',
          selected ? 'true' : 'false'
        );

      });


    /* =====================================================
       UPDATE IMAGE
       ===================================================== */

    if (imageUrl && image) {

      image.src = imageUrl;

      image.removeAttribute('srcset');

      image.alt = imageAlt;

      image.hidden = false;

      if (placeholder) {
        placeholder.hidden = true;
      }

    } else if (!imageUrl) {

      if (image) {
        image.hidden = true;
      }

      if (placeholder) {
        placeholder.hidden = false;
      }

    }


    /* =====================================================
       UPDATE PRODUCT URL
       ===================================================== */

    card
      .querySelectorAll('[data-product-link]')
      .forEach(function (link) {

        if (variantUrl) {
          link.href = variantUrl;
        }

      });


    /* =====================================================
       UPDATE QUICK ADD
       ===================================================== */

    if (quickAdd) {

      quickAdd.dataset.variantId =
        variantId;

      quickAdd.disabled =
        !available;

      quickAdd.setAttribute(
        'aria-label',
        available
          ? 'Add selected variant to cart'
          : 'Selected variant is sold out'
      );

    }


    /* =====================================================
       UPDATE SOLD OUT
       ===================================================== */

    if (soldOutMessage) {

      soldOutMessage.hidden =
        available;

    }

    card.classList.toggle(
      'is-unavailable',
      !available
    );


    /* =====================================================
       UPDATE PRICE
       ===================================================== */

    if (currentPrice) {

      if (swatch.dataset.variantPriceFormatted) {

        currentPrice.textContent =
          swatch.dataset.variantPriceFormatted;

      }

    }


    /* =====================================================
       UPDATE COMPARE AT PRICE
       ===================================================== */

    const compareValue =
      Number(
        swatch.dataset.variantComparePrice || 0
      );

    const compareFormatted =
      swatch.dataset.variantComparePriceFormatted;


    if (comparePrice) {

      if (
        compareValue > 0 &&
        compareFormatted
      ) {

        comparePrice.textContent =
          compareFormatted;

        comparePrice.hidden = false;

        if (priceContainer) {
          priceContainer.classList.add(
            'test-2-card__price--sale'
          );
        }

      } else {

        comparePrice.textContent = '';

        comparePrice.hidden = true;

        if (priceContainer) {
          priceContainer.classList.remove(
            'test-2-card__price--sale'
          );
        }

      }

    }


    /* =====================================================
       UPDATE BROWSER URL
       ===================================================== */

    if (variantUrl) {

      try {

        const url =
          new URL(
            variantUrl,
            window.location.origin
          );

        window.history.replaceState(
          {},
          '',
          url.pathname + url.search
        );

      } catch (error) {

        console.warn(
          'Could not update URL',
          error
        );

      }

    }

  }


  /* =======================================================
     QUICK ADD
     ======================================================= */

  async function quickAdd(button) {

    const card =
      button.closest('[data-product-card]');

    if (!card) {
      return;
    }

    const variantId =
      button.dataset.variantId;

    if (!variantId) {
      return;
    }


    /*
     * Prevent double-click / duplicate requests.
     */

    if (
      button.disabled ||
      button.classList.contains('is-loading')
    ) {
      return;
    }


    const errorElement =
      card.querySelector(
        '[data-quick-add-error]'
      );


    if (errorElement) {
      errorElement.hidden = true;
      errorElement.textContent = '';
    }


    button.classList.add('is-loading');

    const originalLabel =
      button.getAttribute('aria-label');

    button.setAttribute(
      'aria-label',
      'Adding to cart'
    );


    try {

      /* =================================================
         ADD VARIANT TO SHOPIFY CART
         ================================================= */

      const response =
        await fetch(
          '/cart/add.js',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json'
            },

            body: JSON.stringify({
              items: [
                {
                  id: Number(variantId),
                  quantity: 1
                }
              ]
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.description ||
          data.message ||
          'Unable to add this product to cart.'
        );

      }


      /* =================================================
         SUCCESS
         ================================================= */

      button.classList.remove(
        'is-loading'
      );

      button.classList.add(
        'is-added'
      );

      button.setAttribute(
        'aria-label',
        'Added to cart'
      );


      /*
       * Refresh Shopify cart.
       */

    //   await refreshCart();


    //   /*
    //    * Reset button after a short delay.
    //    */

    //   window.setTimeout(function () {

    //     button.classList.remove(
    //       'is-added'
    //     );

    //     button.setAttribute(
    //       'aria-label',
    //       originalLabel ||
    //       'Add product to cart'
    //     );

    //   }, 1200);



    await refreshCart();

/*
 * Successfully added.
 * Now take the customer to Shopify's cart page.
 */
window.location.href = '/cart';

    } catch (error) {

      console.error(
        'Quick add failed:',
        error
      );


      button.classList.remove(
        'is-loading'
      );


      button.setAttribute(
        'aria-label',
        originalLabel ||
        'Add product to cart'
      );


      if (errorElement) {

        errorElement.textContent =
          error.message ||
          'Something went wrong. Please try again.';

        errorElement.hidden = false;

      }


      window.setTimeout(function () {

        if (errorElement) {
          errorElement.hidden = true;
        }

      }, 4000);

    }

  }


  /* =======================================================
     EVENT DELEGATION
     ======================================================= */

  document.addEventListener(
    'click',
    function (event) {


      /* =================================================
         COLOUR SWATCH CLICK
         ================================================= */

      const swatch =
        event.target.closest(
          '[data-variant-id].test-2-card__swatch'
        );


      if (swatch) {

        event.preventDefault();

        /*
         * Allow sold-out variants to be selected.
         * This lets the user see the sold-out state.
         */

        selectVariant(swatch);

        return;
      }


      /* =================================================
         QUICK ADD CLICK
         ================================================= */

      const quickAddButton =
        event.target.closest(
          '[data-quick-add]'
        );


      if (quickAddButton) {

        event.preventDefault();

        quickAdd(quickAddButton);

      }

    }
  );


  /* =======================================================
     SHOPIFY THEME EDITOR SUPPORT
     ======================================================= */

  document.addEventListener(
    'shopify:section:load',
    function () {

        
    }
  );

})();