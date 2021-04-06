const static = require('@sveltejs/adapter-static')
const pkg = require('./package.json')

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
  kit: {
    adapter: static(),

    paths: {
      base: '/demo/svelte-nano-donate/'
    },

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    vite: {
      ssr: {
        noExternal: Object.keys(pkg.dependencies || {})
      }
    }
  }
}
