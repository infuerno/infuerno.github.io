---
layout: post
title: "Frontend Masters: Brian Holt Fox Game"
---

## References

- Course notes: https://btholt.github.io/project-fox-game-site/

### Stretch

- Code in alternative framework
- Write tests
- Rewrite using TypeScript
- Model using xstate

## Front End Infrastructure

### npm

- `npm list -g --depth=0` lists all top-level packages with versions
- `npm list -g --parseable --depth=0` lists with paths
- `npm init -y` start a node project with all the defaults

### Bundlers

**Webpack** is one of the most well known bundlers. Course by Sean Larkin - https://frontendmasters.com/courses/webpack-fundamentals/.

- reliable
- configurable
- robust
- BUT difficult to set up

Other bundlers include:

- [Browserify](http://browserify.org/) - lets you `require('modules')` in the browser by bundling up all of your dependencies.
- [Snowpack](https://www.snowpack.dev/)
- [Rollup](https://rollupjs.org/guide/en/) - Next-generation ES module bundler
- [Microbundle]() - The zero-configuration bundler for tiny modules, powered by Rollup
- [Parcel](https://v2.parceljs.org/) - zero configuration, works out of the box

`npm i -D parcel-bundler` to install parcel to the dev dependencies
`npm i -D parcel-bundler@1.12.4` to install a particular version

### Emmet

- `html:5` to get the emmet code snippet for html in vs code

### Parcel

- Use `parcel src/index.html` to build your project. Parcel will create a `.cache` directory AND a `dist` directory with all the output. These should NOT be commited to the git repo.
- Create an npm script in package.json e.g. `dev` so that `npm run dev` runs this script

### Prettier

- `npm i -D prettier`
- Create a file at the route `.prettierrc` with contents `{}` which configures prettier for the project but with all the default rules
- Install Esben Petersen's VS Code extension (the most popular one)
- In Settings, ensure "Editor: Format On Save" is selected
- In Settings, ensure "Prettier: Require Config" is also selected, if there is no `.prettierrc` or `.editorconfig`, the prettier extension will not screw around with the project

In `package.json` add the following script definitions:

```json
"format": "prettier --ignore-path ./.gitignore --write \"./**/*.{html,json,js,ts,css}\"",
"format:check": "prettier --ignore-path ./.gitignore --check \"./**/*.{html,json,js,ts,css}\""
```

The first actually fixes the code, the second checks the code and throws an error if anything found (useful for automated build pipelines).

### Editorconfig

Most editors understand `.editorconfig` so it is a good file to have in projects especially working with other team members. (So why do we need an extension in VS Code then?)

Create a `.editorconfig` file with the following contents and ensure the "EditorConfig for VS Code" extension is installed

```yaml
root = true # this is the root most .editorconfig file

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_size = 2
indent_style = space
```

Prettier will also use the settings in `.editorconfig`

### ESLint

Overlaps prettier to some extent, but has more focus on enforcing good code syntax

- `npm i -D eslint eslint-plugin-import eslint-config-prettier`
- Create `.eslintrc.json` in the root directory

```json
{
  "extends": [
    "eslint:recommended", // all the rules which eslint itself recommends
    "plugin:import/errors", // uses the eslint-plugin-import package to detect issues with plugins
    "prettier" // let prettier worry about things like bad indentation and TURN OFF these rules for eslint
  ],
  "rules": {
    "no-console": 1 // warn about console.log (rather than the default which is to error) - note 0 turns off altogether
  },
  "plugins": ["import"], // there is a plugin called import
  "parserOptions": {
    "ecmaVersion": 2018,
    "style": "module" // since using ES6 style modules
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  }
}
```

Similar script definitions to add to `package.json`:

```json
"lint": "eslint --ignore-path ./.gitignore --fix \"./**/*.{js,ts}\"",
"lint:check": "eslint --ignore-path ./.gitignore --quiet \"./**/*.{js,ts}\"",
```

- Install the Dirk Baeumer's ESLint extension

### Testing

Testing frameworks include:

- Jest
- Jasmine
- Mocha
- AVA

Install e.g. jest using: `npm i -D jest` and update the `test` script in `package.json` to simply say `jest`. Any file named `*.test.js` will now be run when issuing `npm run test`

## Architecture

### Organising your code

There is an endless ocean of good ways to organise your code. They each tend to have different trade offs e.g.:

- searchability
- discoverability
- available from a file explorer

Generally ALL well intentioned and **generally ALL eventually fall apart**.

Recommendation is to optimise for deletability (Ryan Florence), which means it needs to be modular, which then forces you into good practices.

### Start

First file `init.js`. Always try to have one defined entry to the app which the browser loads. Everything else behind it are then modules. All the garbage e.g. GA goes in the `init.js` which is not going to be tested.

#### Clock loop which runs the game every 3 seconds

`setTimeout` can be used, but it asks the browser to drop everything and run the code right there and then. `requestAnimationFrame(methodToRun)` instead lets the browser run the code as soon as it isn't busy (which will be at most 1 to 2ms)

#### init.js:9 Uncaught ReferenceError: regeneratorRuntime is not defined

Parcel is targetting older browsers, but they don't understand `async` SO within `package.json` add `browserslist`

```json
  "browserslist": [
    "last 2 Chrome versions"
  ]
```

However, should not write code which only target the last 2 Chrome versions, so therefore, can't use `async` in shippable code?

#### Other issues

If any issues, try resetting parcel using `rm -f .cache dist` and then running `npm run dev` again.

### (Finite) State Machine (FSM)

Methodology of writing code which prevents lots of different types of bugs.
