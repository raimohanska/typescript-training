Building a web application with [snowpack](https://www.snowpack.dev/).

- An experiment with Snowpack
    - Dev server 
    - Minimized production build, powered by [esbuild](https://github.com/evanw/esbuild) 
    - No TypeScript type checking as of yet. You'd need toadd the [TypeScript plugin](https://www.npmjs.com/package/@snowpack/plugin-typescript) for this.
    - No transpilation down to ES5 (esbuild doesn't support that, you could plug in webpack as bundler...)
    - Quite certainly doesn't add polyfills either
    - No cache busting via hashed filename
- Setup
    - Install Node.js and NPM
    - In this directory: `npm install`
- Snowpack "unbundled development"
    - `npm run start`
    - Open http://localhost:8080
- Snowpack production build, bundled using [esbuild](https://github.com/evanw/esbuild) 
    - `npm run build && npm run server`
    - Open http://localhost:3000
    - Build in watch mode using `(npm run watch &) && npm run server`