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

<section>
  <h2>Donate NANO</h2>
  <form on:submit|preventDefault>
    <fieldset id='nanoAmount'>
      <legend class='visually-hidden'>Donate NANO</legend>
      <input type='number' min='1' bind:value={amount} on:input={updateModel}>
      <label class='unselectable visually-hidden' for='amount'>Amount</label>
    <fieldset>

    <fieldset id="currency">
      <select bind:value={currency} on:change={updateModel} on:blur={updateModel}>
        <CurrencyOptions />
      </select>
      <label class='unselectable visually-hidden' for='currency'>Currency</label>
    </fieldset>
  </form>

  <p id='sendNanoLink'>
    <a href={paymentLink}>{paymentMessage}</a>
  </p>

  <canvas bind:this={qrCodeView}></canvas>

  <p><small>Exchange rates courtesy of <a href='https://www.coingecko.com/en/api'>CoinGecko API</a>. Widget by <a href='https://small-tech.org/fund-us'>Small Technology Foundation.</a></small></p>
</section>

<style>
  section {
    /* give form a max-width and center it when it exceeds that width */
    margin: 1em auto;
    max-width: 21em;
    text-align: center;
  }

  /* Disable the default fieldset styles (border + spacing) */
  fieldset {
    border: none;
    padding: 0;
    display: contents;
  }

  /* treat nano payment amount and currency like other labels so focus styles match */
  input, select {
    border-style: solid;
    background: #fff;
    border: 0.2em solid #d8e5ef;
    border-radius: 5px;
    box-sizing: border-box;
    color: rgb(48, 67, 73);
    padding: 0.5em;
    font-size: 1.25em;
    width: 100%;
  }

  /* space between QR code and text below */
  canvas {
    margin-bottom: 0.5em;
    max-width: 21em;
  }

  a { color: rgb(48, 67, 73); }

  p small {
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

  /* Hide items visually while keeping them visible to assistive technology.
    Use with caution and avoid where the content can be happily shown. */
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

  #sendNanoLink {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding: 0;
    width: 100%;
    text-align: center;
    font-size: 1.5em;
  }

  @supports (display: grid) {
    form {
      display: grid;
      grid-template-columns: 30% 1fr;
      grid-template-areas: "amount currency";
      grid-gap: 0.5em;
    }

    #nanoAmount { grid-column: amount; }
    #currency { grid-column: currency; }
  }

  /* Fix the ugly select box arrow in Firefox. */
  /* Courtesy: https://github.com/twbs/bootstrap/issues/16201#issuecomment-498358474 */
  @supports (-moz-appearance:none) {
    select {
      -moz-appearance:none !important;
      background: transparent url('data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==') right center no-repeat !important;
      background-position: calc(100% - 5px) center !important;
    }
  }
</style>
