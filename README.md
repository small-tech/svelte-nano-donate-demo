# Svelte Nano Donate Demo

A simple SvelteKit project demonstrating how to use the Svelte Nano Donate component.

__Work-in-progress (Mon, Apr 5, 2021).__ I’m using this project to develop the component. It will then be pulled out into its own repository and published on npm.

## Install

```shell
npm init using small-tech/svelte-nano-donate-demo
cd svelte-nano-donate-demo
npm install
```

(Or just fork/clone using git.)

### Basic usage

All you need to use the component is your wallet id:

```html
<script>
  import Donate from '@small-tech/svelte-nano-donate'
</script>

<Donate address=nano_1hfmyyjtm4muiudw1m8dz54jry13jx8xykp9kz1mx3uqe4dtsb3yrdkjgy6g/>
```

Of course, you can also customise the form to specify properties like the initial `amount` and `currency` that’s displayed and even specify a theme comprised of CSS variable values to customise how it looks:

```html
<script>
  import Donate from '@small-tech/svelte-nano-donate'
</script>

<main>
  <Donate
    amount=5
    currency=usd
    address=nano_1hfmyyjtm4muiudw1m8dz54jry13jx8xykp9kz1mx3uqe4dtsb3yrdkjgy6g
    theme={{'colour': '#3399ff'}}
  />
</main>
```

Note that the `colour` value here will be used for the text. The border colours of the form elements will also be automatically calculated as a lighter tint of this colour. For full details, see the theming section.

## Theming

By default, you get a theme with light and dark modes.

You can also apply an entirely custom theme to the component by passing an object to the `theme` property.

The list of valid colour names for a custom `theme` object are shown here and they map to the CSS variables used in the component:

|Name | Default | Description |
|-------|-------| ---------- |
| colour | rgb(48, 67, 73) | Used for text in form elements and links |
| border-colour | rgb(215,216,217) | Used for borders of form elements; 70% lighter than colour |

___Note:__ if you don’t explicitly pass a custom `border-colour` value, it will be calculated automatically from the value of the `colour` property._


## Running/Developing

```shell
npm run dev
```

And hit `http://localhost:3000` in your browser.

Or, do both one step:

```shell
npm run dev -- --open
```

## Like this? Fund us!

[Small Technology Foundation](https://small-tech.org) is a tiny, independent not-for-profit.

We exist in part thanks to patronage by people like you. If you share [our vision](https://small-tech.org/about/#small-technology) and want to support our work, please [become a patron or donate to us](https://small-tech.org/fund-us) today and help us continue to exist.

## Copyright

Copyright &copy; 2021-present [Aral Balkan](https://ar.al), [Small Technology Foundation](https://small-tech.org).

## License

[ISC](./LICENSE).
