<p align="center"><img src="https://i.imgur.com/X7dSE68.png"></p>

## Usage

### Create an App

```
# with npx
$ npx create-nextron-app my-app --example basic-javascript

# with yarn
$ yarn create nextron-app my-app --example basic-javascript

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-javascript
```

### Install Dependencies

```
$ cd my-app

# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install --shamefully-hoist

```

### Use it

```
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

we can change the script of dev with `"dev": "cross-env OPENAI_API_KEY=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 nextron"`

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```
