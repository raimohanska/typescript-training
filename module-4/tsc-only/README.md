Building a web application with `tsc` only.

Works, but doesn't bundle or minify. Creates ES Modules that are loaded to the browser using a `<script type="module">`tag.

Usage:

1. Install dependencies `npm install`
2. Start the development server `npm run server`
3. Start compilation in watch mode `npm run watch`
4. Go to http://localhost:3000