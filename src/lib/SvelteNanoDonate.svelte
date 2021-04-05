<script>
  import { onMount } from 'svelte'
  import QRious from 'qrious'
  import CurrencyOptions from './CurrencyOptions.svelte'
  import { lighten } from './QuickAndDirtyColour.js'

  // Props. Pass these to the component.
  export let address
  export let amount = 3        // (optional)
  export let currency = 'eur'  // (optional)
  export let theme = null

  // Mnano = 10³⁰ raw
  const Mnano = 1000000000000000000000000000000

  let qrCodeView
  let qrCode
  let exchangeRates
  let paymentLink
  let paymentMessage = ''

  onMount (async () => {
    if (theme !== null) {
      // Apply any CSS variables that were provided in the style property.
      Object.keys(theme).forEach(cssVariable => {
        document.documentElement.style.setProperty(`--${cssVariable}`, theme[cssVariable])

        // Apply intelligent calculations for properties that haven’t been specifically passed.
        switch(cssVariable) {
          case 'colour':
            const borderColour = theme['border-colour'] === undefined ? lighten(theme['colour'], 70) : theme['border-colour']
            const darkModeColour = theme['dark-mode-colour'] === undefined ? borderColour : theme['dark-mode-colour']
            document.documentElement.style.setProperty('--border-colour', borderColour)
            document.documentElement.style.setProperty('--dark-mode-colour', darkModeColour)
            document.documentElement.style.setProperty('--dark-mode-border-colour', theme['colour'])
          break

          case 'border-colour':
            const colour = theme['colour'] === undefined ? darken(theme['border-colour'], 70) : theme['colour']
            const darkModeBorderColour = them['dark-mode-border-colour'] === undefined ? colour : theme['dark-mode-border-colour']

            document.documentElement.style.setProperty('--colour', colour)
            document.documentElement.style.setProperty('--dark-mode-border-colour', darkModeBorderColour)
          break
        }
      })

      // Note that in order to have dark mode colours that are overriden, we need to carry out the
      // application of light/dark mode using JavaScript, not CSS. This is because the assingments
      // in the media query in CSS are not reactive.
      const cssColour = document.documentElement.style.getPropertyValue('--colour')
      const cssBorderColour = document.documentElement.style.getPropertyValue('--border-colour')
      const cssBackgroundColour = document.documentElement.style.getPropertyValue('--background-colour')

      const cssDarkModeColour = document.documentElement.style.getPropertyValue('--dark-mode-colour')
      const cssDarkModeBorderColour = document.documentElement.style.getPropertyValue('--dark-mode-border-colour')
      const cssDarkModeBackgroundColour = document.documentElement.style.getPropertyValue('--dark-mode-background-colour')

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      function applyColourScheme (event) {
        if (event.matches) {
          document.documentElement.style.setProperty('--colour', cssDarkModeColour)
          document.documentElement.style.setProperty('--border-colour', cssDarkModeBorderColour)
          document.documentElement.style.setProperty('--background-colour', cssDarkModeBackgroundColour)
        } else {
          document.documentElement.style.setProperty('--colour', cssColour)
          document.documentElement.style.setProperty('--border-colour', cssBorderColour)
          document.documentElement.style.setProperty('--background-colour', cssBackgroundColour)
        }
      }
      mediaQuery.addEventListener('change', applyColourScheme)
      applyColourScheme(mediaQuery)
    }

    // Get the current exchange rates for nano at the start.
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd,idr,twd,eur,krw,jpy,rub,cny,aed,ars,aud,bdt,bhd,bmd,brl,cad,chf,clp,czk,dkk,gbp,hkd,huf,ils,inr,kwd,lkr,mmk,mxn,myr,ngn,nok,nzd,php,pkr,pln,sar,sek,sgd,thb,try,uah,vef,vnd,zar,xdr')

    exchangeRates = (await response.json()).nano

    // Initialise the QRCode (nice and large so it looks good on
    // high-resolution displays).
    qrCode = new QRious({
      element: qrCodeView,
      foreground: 'black',
      background: 'white',
      padding: 40,
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
  :root {
    --colour: rgb(48, 67, 73);
    --border-colour:rgb(215,216,217);
    --background-colour:white;

    /* By default, we flip the colour and border colour in dark mode */
    --dark-mode-colour: rgb(215,216,217);
    --dark-mode-border-colour: rgb(48, 67, 73);
    --dark-mode-background-colour: black;
  }

  section {
    /* give form a max-width and center it when it exceeds that width */
    margin: 1em auto;
    max-width: 21em;
    text-align: center;
    background: var(--background-colour);
  }

  /* Disable the default fieldset styles (border + spacing) */
  fieldset {
    border: none;
    padding: 0;
    display: contents;
  }

  input, select, a {
    color: var(--colour);
  }

  /* treat nano payment amount and currency like other labels so focus styles match */
  input, select {
    border-style: solid;
    background: var(--background-colour);
    border: 0.2em solid var(--border-colour);
    border-radius: 5px;
    box-sizing: border-box;
    padding: 0.5em;
    font-size: 1.25em;
    width: 100%;
  }

  /* space between QR code and text below */
  canvas {
    margin-bottom: 0.5em;
    max-width: 21em;
  }

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

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    :root {
      --colour: var(--dark-mode-colour);
      --border-colour: var(--dark-mode-border-colour);
      --background-colour: var(--dark-mode-background-colour);
    }
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
