<script>
  import Donate from '@small-tech/svelte-nano-donate'
</script>

<main>
  <Donate
    amount=10
    currency=usd
    address=nano_1hfmyyjtm4muiudw1m8dz54jry13jx8xykp9kz1mx3uqe4dtsb3yrdkjgy6g
    theme={{colour: '#0062cc'}}
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
