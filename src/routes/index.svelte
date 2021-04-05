<script>
  import Donate from '$lib/SvelteNanoDonate.svelte'
</script>

<main>
  <Donate
    amount=5
    currency=usd
    address=nano_1hfmyyjtm4muiudw1m8dz54jry13jx8xykp9kz1mx3uqe4dtsb3yrdkjgy6g
    theme={{colour: 'rgb(48, 67, 73)'}}
  />
</main>

<style>
  :root {
    background-color: white;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      background-color: black;
    }
  }
</style>
