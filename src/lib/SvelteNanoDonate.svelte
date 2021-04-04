<script>
  import { onMount } from 'svelte'
  import QRious from 'qrious'
  import CurrencyOptions from './CurrencyOptions.svelte'

  // Props. Pass these to the component.
  export let address
  export let amount = 3        // (optional)
  export let currency = 'eur'  // (optional)

  // Mnano = 10³⁰ raw
  const Mnano = 1000000000000000000000000000000

  let qrCodeView
  let qrCode
  let exchangeRates
  let paymentLink
  let paymentMessage = ''

  onMount (async () => {
    // Get the current exchange rates for nano at the start.
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd,idr,twd,eur,krw,jpy,rub,cny,aed,ars,aud,bdt,bhd,bmd,brl,cad,chf,clp,czk,dkk,gbp,hkd,huf,ils,inr,kwd,lkr,mmk,mxn,myr,ngn,nok,nzd,php,pkr,pln,sar,sek,sgd,thb,try,uah,vef,vnd,zar,xdr')
    exchangeRates = (await response.json()).nano

    // Initialise the QRCode (nice and large so it looks good on
    // high-resolution displays).
    qrCode = new QRious({
      element: qrCodeView,
      value: '',
      size: 1600
    })

    // Update the view.
    updateModel()
  })

  function updateModel () {
    const priceOfCurrencyInNano = exchangeRates[currency]
    const amountInNANO = amount / priceOfCurrencyInNano
    const amountInRaw = amountInNANO * Mnano

    paymentLink = `nano://${address}?amount=${amountInRaw.toLocaleString('fullwide', { useGrouping: false })}`
    paymentMessage = `Send ${amountInNANO.toFixed(6)} NANO`
    qrCode.value = paymentLink
  }
</script>

<form id='patronageForm' on:submit|preventDefault>
  <div id='nanoPayment'>
    <fieldset>
      <div class='nanoAmount'>
        <legend class='visually-hidden'>Amount of donation (NANO)</legend>
        <div class='option'>
          <input id='amount' type='number' min='1' bind:value={amount} on:input={updateModel}>
          <label class='nanoPaymentNumberButtonLabel unselectable visually-hidden' for='amount'>Amount</label>
        </div>
        <div class='option currency'>
          <select name="currency" id="currency" bind:value={currency} on:change={updateModel}>
            <CurrencyOptions />
          </select>
          <label class='nanoPaymentCurrencyButtonLabel unselectable visually-hidden' for='currency'>Currency</label>
        </div>
      </div>
    </fieldset>
    <p id='amountInNanoDisplay'>
      <a href={paymentLink}>{paymentMessage}</a>
    </p>
    <canvas bind:this={qrCodeView}></canvas>
    <p><small>Exchange rates courtesy of <a href='https://www.coingecko.com/en/api'>CoinGecko API</a>.</small></p>
  </div>
</form>

<style>
  form {
    /* give form a max-width and center when it exceeds that width */
    margin: 1em auto;
    max-width: 21em;
  }
  /* Disable the default fieldset styles (border + spacing) */

  fieldset {
    border: none;
    margin: 0 0 1em 0; /* spacing between rows of buttons (overridden when there’s grid) */
    padding: 0;
  }


  /* treat nano payment amount and currency like other labels so focus styles match */
  #amount,
  #currency {
    border-width: 0.16rem;
    border-style: solid;
  }

  #amount:before {
    border-radius: 0.4rem;
    content: "";
    display: block;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
  }

  /* center Nano payment link */
  #amountInNanoDisplay {
    text-align: center;
  }

  /* space between QR code and text below */
  canvas {
    margin-bottom: 0.5em;
    max-width: 21em;
  }

  /* -------------------------------------------------------------------------
  Grid layout (when grid is supported by the browser) */

  @supports (display: grid) {
    /* remove spacing required for hierarchy when there’s no grid */

    fieldset {
      margin-bottom: 0.5em;
    }

    .nanoAmount {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-gap: 0.2em;
    }

    .nanoAmount .option {
      grid-column: span 1; /* donation tier options and nano amount option span one column */
      grid-row: span 1; /* donation tier options span one row */
    }

    /* Type of donation and payment type */

    .nanoAmount .option.currency {
      grid-column: span 3; /* make nano currency span three columns of grid */
    }
  } /* end @supports display: grid; */

  #patronageForm p small {
    color: #7d7d7d;
    font-size: 1em;
    display: block;
    font-style: italic;
    text-align: center;
  }

  /* Courtesy: https://stackoverflow.com/a/2310809 */
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* a class for hiding items both visually and from assistive technology */
  .hidden {
    display: none;
  }

  /* A class for hiding items visually while keeping them visible to assistive technology.
    Use with caution and avoid where the content can be happily shown. */
  /* this class is also used in the theme’s CSS for the rest of the site */

  .visually-hidden {
    border: 0 !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
    -webkit-clip-path: inset(50%) !important;
    clip-path: inset(50%) !important;
    height: 1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: absolute !important;
    width: 1px !important;
    white-space: nowrap !important;
  }
</style>