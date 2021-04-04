<script>
  import { onMount } from 'svelte'
  import QRious from 'qrious'

  // Props. Pass these to the component.
  export let address
  export let amount = 3  // (optional)

  // Mnano = 10³⁰ raw
  const Mnano = 1000000000000000000000000000000

  let qrCodeView
  let qrCode
  let exchangeRates
  let localCurrency
  let paymentLink
  let paymentMessage = ''

  onMount (async () => {
    localCurrency = 'eur'

    // Get the current exchange rates for nano at the start.
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd,idr,twd,eur,krw,jpy,rub,cny,aed,ars,aud,bdt,bhd,bmd,brl,cad,chf,clp,czk,dkk,gbp,hkd,huf,ils,inr,kwd,lkr,mmk,mxn,myr,ngn,nok,nzd,php,pkr,pln,sar,sek,sgd,thb,try,uah,vef,vnd,zar,xdr')
    const responseJson = await response.json()
    exchangeRates = responseJson.nano

    qrCode = new QRious({
      element: qrCodeView,
      value: '',
      size: 1600
    })

    update()
  })

  function update () {
    const priceOfCurrencyInNano = exchangeRates[localCurrency]
    const amountInNANO = amount / priceOfCurrencyInNano
    const amountInRaw = amountInNANO * Mnano

    paymentLink = `nano://${address}?amount=${amountInRaw.toLocaleString('fullwide', { useGrouping: false })}`
    console.log(paymentLink)

    paymentMessage = `Send ${amountInNANO.toFixed(6)} NANO`
    qrCode.value = paymentLink
  }
</script>

<form id='patronageForm' on:submit|preventDefault >
  <div id='nanoPayment'>
    <fieldset>
      <div class='nanoAmount'>
        <legend class='visually-hidden'>Amount of donation (nano)</legend>
        <div class='option'>
          <input id='amount' type='number' min='1' bind:value={amount} on:input={update}>
          <label class='nanoPaymentNumberButtonLabel unselectable visually-hidden' for='amount'>Amount</label>
        </div>
        <div class='option currency'>
          <select name="localCurrency" id="localCurrency" bind:value={localCurrency} on:change={update}>
            <option value="usd">US Dollar ($)</option>
            <option value="idr">Indonesian Rupiah (Rp)</option>
            <option value="twd">New Taiwan Dollar (NT$)</option>
            <option value="eur">Euro (€)</option>
            <option value="krw">South Korean Won (₩)</option>
            <option value="jpy">Japanese Yen (¥)</option>
            <option value="rub">Russian Ruble (₽)</option>
            <option value="cny">Chinese Yuan (¥)</option>
            <option value="aed">United Arab Emirates Dirham (د.إ)</option>
            <option value="ars">Argentine Peso ($)</option>
            <option value="aud">Australian Dollar ($)</option>
            <option value="bdt">Bangladeshi Taka (৳)</option>
            <option value="bhd">Bahraini Dinar (.د.ب)</option>
            <option value="bmd">Bermudian Dollar ($)</option>
            <option value="brl">Brazil Real (R$)</option>
            <option value="cad">Canadian Dollar ($)</option>
            <option value="chf">Swiss Franc (Fr.)</option>
            <option value="clp">Chilean Peso ($)</option>
            <option value="czk">Czech Koruna (Kč)</option>
            <option value="dkk">Danish Krone (Kr.)</option>
            <option value="gbp">British Pound Sterling (£)</option>
            <option value="hkd">Hong Kong Dollar ($)</option>
            <option value="huf">Hungarian Forint (Ft)</option>
            <option value="ils">Israeli New Shekel (₪)</option>
            <option value="inr">Indian Rupee (₹)</option>
            <option value="kwd">Kuwaiti Dinar (د.ك)</option>
            <option value="lkr">Sri Lankan Rupee (රු)</option>
            <option value="mmk">Burmese Kyat (K)</option>
            <option value="mxn">Mexican Peso ($)</option>
            <option value="myr">Malaysian Ringgit (RM)</option>
            <option value="ngn">Nigerian Naira (₦)</option>
            <option value="nok">Norwegian Krone (kr)</option>
            <option value="nzd">New Zealand Dollar ($)</option>
            <option value="php">Philippine Peso (₱)</option>
            <option value="pkr">Pakistani Rupee (₨)</option>
            <option value="pln">Polish Zloty (zł)</option>
            <option value="sar">Saudi Riyal (ر.س)</option>
            <option value="sek">Swedish Krona (kr)</option>
            <option value="sgd">Singapore Dollar ($)</option>
            <option value="thb">Thai Baht (฿)</option>
            <option value="try">Turkish Lira (₺)</option>
            <option value="uah">Ukrainian hryvnia (₴)</option>
            <option value="vef">Venezuelan bolívar fuerte (Bs)</option>
            <option value="vnd">Vietnamese đồng (₫)</option>
            <option value="zar">South African Rand (R)</option>
            <option value="xdr">IMF Special Drawing Rights (XDR)</option>
          </select>
          <label class='nanoPaymentCurrencyButtonLabel unselectable visually-hidden' for='localCurrency'>Currency</label>
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
  /*
  Funding page styles.
*/

/* Maximum width on form */

#patronageForm {
  /* give form a max-width and center when it exceeds that width */
  margin: 1em auto;
  max-width: 21em;
}
/* Disable the default fieldset styles (border + spacing) */

#patronageForm fieldset {
  border: none;
  margin: 0 0 1em 0; /* spacing between rows of buttons (overridden when there’s grid) */
  padding: 0;
}

/* Style labels as buttons */

#patronageForm .selectButton + label,
#patronageForm #customDonationLabel {
  background-color: #eee;
   /* rems used for borders so they’re consistent regardless of font size */
  border-radius: 0.55rem;
  border: 0.16rem solid var(--background); /* essentially transparent (same as background colour) until it has focus */
  color: #304349;
  line-height: 1em;
  margin: 0 0 0.25em 0; /* spacing between buttons (when there’s no grid) */
  padding: 0.75em;
  position: relative;
  text-align: center;
}

/* treat nano payment amount and currency like other labels so focus styles match */
#patronageForm #amount,
#patronageForm #localCurrency {
  border-width: 0.16rem;
  border-style: solid;
}

#patronageForm #amount:before {
  border-radius: 0.4rem;
  content: "";
  display: block;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
}

/* tweak custom donation field to better fit space */
#patronageForm #customDonationLabel {
  font-size: 1em;
  line-height: 1;
}

#patronageForm #customDonationLabel input {
  margin-left: 0.5em; /* when there’s no grid */
}

/* center Nano payment link */
#patronageForm #amountInNanoDisplay {
  text-align: center;
}

/* space between QR code and text below */
#patronageForm canvas {
  margin-bottom: 0.5em;
  max-width: 21em;
}

/* -------------------------------------------------------------------------
Grid layout (when grid is supported by the browser) */

@supports (display: grid) {

  /* remove spacing required for hierarchy when there’s no grid */
  #patronageForm .selectButton + label,
  #patronageForm #customDonationLabel {
    margin: 0;
    padding: 0.75em 0.25em;
  }

  #patronageForm fieldset {
    margin-bottom: 0.5em;
  }

  #patronageForm .nanoAmount {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 0.2em;
  }

  #patronageForm .nanoAmount .option {
    grid-column: span 1; /* donation tier options and nano amount option span one column */
    grid-row: span 1; /* donation tier options span one row */
  }

  /* Type of donation and payment type */

  #patronageForm .nanoAmount .option.currency {
    grid-column: span 3; /* make nano currency span three columns of grid */
  }
} /* end @supports display: grid; */

/* -------------------------------------------------------------------------
Messages and notes */

/* Note below button */

#patronageForm p small {
  color: #7d7d7d;
  font-size: 1em;
  display: block;
  font-style: italic;
  text-align: center;
}

/* -------------------------------------------------------------------------
Behaviour-related styles */

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