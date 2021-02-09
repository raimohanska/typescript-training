Node.js application example in TypeScript and ES Modules.

In package.json we use `type:module` to indicate that this is an ES Module instead of CommonJS.
This way node.js is able to load it as ES modules that TypeScript is compiled to.

Try it:

1. Build the library at `../library/build` first
2. Install dependencies `npm install`
3. Run in watch mode: `npm run start:dev`