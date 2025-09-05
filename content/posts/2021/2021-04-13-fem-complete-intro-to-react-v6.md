---
layout: post
title: "Frontend Masters: Complete Intro to React v6"
---

## Introduction

- Course notes: https://btholt.github.io/complete-intro-to-react-v6/
- v3 of the course is useful for webpack and react router
- Git repo: https://github.com/btholt/complete-intro-to-react-v6
- Other git repo: https://github.com/btholt/citr-v6-project/
- Recommended course on GIT: https://frontendmasters.com/courses/git-in-depth/

MVC - Model View Controller is great for backend projects. React combines everything into components which seems to translate better for front end projects.

## No Frills React

- Include script files for React directly in `index.html` from unpkg
- Add a stylesheet and link into `index.html`
- `<body><div id="root">not rendered</div><script src="App.js"></script></body>`

```js
// define the App component
const App = () => {
	return React.createElement("div", {}, React.createElement("h1", {}, "Adopt Me!"));
};
// render the App component to the DOM
ReactDOM.render(React.createElement(App), document.getElementById("root"));
```

- NOTE casing is important - components need to start with an uppercase letter e.g. `App` so that React knows this is your custom component. Anything starting with a lowercase letter is assumed to be an HTML element

`[1, 2, 3, ...[1, 2, 3, 4], 5, 6]` - the `...` spread operator "spreads" or merges the inner array into the outer array i.e. becomes `[1, 2, 3, 1, 2, 3, 4, 5, 6]`

## JavaScript Tools

### Prettier

- Install prettier `npm i -D prettier`
- Add a script to format: `"format": "prettier --write \"src/**/*.{js,jsx,html}\""`
- Create `.prettierrc` and at least add `{}`
- Install the prettier vs code extension, format on save, only if config file

### eslint

- Install `eslint` for linting and `eslint-config-prettier` to tell eslint prettier is being used for formatting: `npm i -D eslint@7.18.0 eslint-config-prettier@8.1.0`
- Install the eslint vs code extension
- Create `.eslintrc.json` with the following

```json
{
	"extends": ["eslint:recommended", "prettier", "prettier/react"], // recommended is a set of rules, could also use standard, airbnb
	"plugins": [],
	"parserOptions": {
		"ecmaVersion": 2021,
		"sourceType": "module", // use import / export / es modules
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"env": {
		"es6": true, // async, await, map
		"browser": true, // setTimeout, window, fetch
		"node": true // http, process, require
	}
}
```

- Add a script `"lint": "eslint src/**/*.{js,jsx} --quiet"`
- By default using unpkg references in index.html, eslint will now complain about React.createElement and ReactDOM.render etc because it doesn't know what React is (e.g. no import statement at the top of the js file). Can supress this by adding `/_ global React ReactDOM _/` to the top of the corresponding file e.g. `App.js`

### Git

- Create a `.gitignore`

```bash
node_modules/
.cache/
dist/
.env
.DS_Store
coverage/
.vscode/
```

### Parcel

- Install parcel: `npm i -D parcel@1.12.3` (used to be parcel-bundler)
- Add a script: `"dev": "parcel src/index.html"`

NOTE: npm knows what `parcel` is due to the hidden `node_modules/.bin/` directory which contains these executables

#### Install NPM packages automatically

Type an import statement for a package which isn't yet installed and Parcel on save (which builds the project if currently running) will automatically install the npm package for you

### Babel

Babel is already working under the hood e.g. transpiling ES6 to work for IE. If using Parcel 2, probably won't have to do this, but parcel will automatically read the `.babelrc` and update how its working (necessary for < 2). Add some config to make it use the latest version of JSX (`runtime: automatic`)

- Create `.babelrc`
- `npm install -D @babel/core@7.12.16 @babel/preset-react@7.12.13`

### browserslist

See: https://browserslist.dev

```json
  "browserslist": [
    "last 2 versions"
  ]
```

## Core React Components

### JSX

JSX is translated to React code via a tool called [babel](https://babeljs.io/). Thus

```javascript
return React.createElement("div", {}, [React.createElement("h1", {}, name), React.createElement("h2", {}, animal)]);
```

can equivalently be written using JSX with:

```javascript
return (
	<div>
		<h1>{name}</h1>
		<h2>{animal}</h2>
		<h2>{breed}</h2>
	</div>
);
```

Within the curly braces, any JavaScript expression can be used (i.e. anything which can be to the right on an `=` sign). Components can be specified in JSX using markup e.g. `<Pet name="brenda" />`.

### ESLint & React

- `npm i react@17.0.1 react-dom@17.0.1`
- Remove previously added script Elements
- Add any required import statements to App.js
- Refactor to use JSX

#### eslint with JSX

At this point eslint will complain that `React` is being imported but never used (however it IS used, because the JSX is transpiled to `React.createElement`).

- `npm install -D eslint-plugin-import@2.22.1 eslint-plugin-jsx-a11y@6.4.1 eslint-plugin-react@7.22.0`

  - `babel-eslint` allows eslint to be augmented by babel so it can understand react better
  - `eslint-plugin-import` gives new rules around importing and exporting
  - `eslint-plugin-jsx-a11y` (accessibility) introduces several no brainers for accessibility
  - `eslint-plugin-react` for additional react rules

* Update the eslint config:

```json
{
	"extends": [
		"eslint:recommended",
		"plugin:import/errors",
		"plugin:react/recommended",
		"plugin:jsx-a11y/recommended",
		"prettier"
	],
	"rules": {
		"react/prop-types": 0,
		"react/react-in-jsx-scope": 0,
		"no-console": 1
	},
	"plugins": ["react", "import", "jsx-a11y"],
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"env": {
		"es6": true,
		"browser": true,
		"node": true
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	}
}
```

### Hooks

See: https://frontendmasters.com/courses/complete-react-v5/setting-state-with-hooks/

There are various hooks including: `useState`, `useEffect`, `useCallback`, `useMemo`. (Always start with `use`). Hooks are a way of creating stateful logic in React. This supplants the old way of using `setState` in React (described later).

#### Create a new hook

`const [location, setLocation] = useState("Seattle, WA");`

- `useState` creates a hook, and is passed the initial value, it returns an array of two objects (which can be named anything)
  - `location` is the current value of the state
  - `setLocation` is the updater function for that piece of state

#### Using a hook

`onChange={e => setlocation(e.targetValue)}`

- `e` is an event which happened on the input
- Call `setLocation` (the updater) with whatever is inside that particular event i.e. the value of the input. This will then update the value of the state.
- A rerender will be triggered which will have the new value of `location` and will set the input to this value (i.e. the same as before)

#### Full cycle walkthrough

1. Initial render of the page renders the `App` component and the child `SearchParams` component
2. At the first render of `SearchParams`, the hook is created with the default state specified. The state and updater variables returned.
3. Input HTML element is rendered with the value of location (currently the initial value)
4. When a user types in the input box this triggers an event and two things are listening:
   1. The `onChange` event on the input box is triggered which calls `setLocation()` and updates the value of the `location` variable
   2. The rerender React cycle happens which rerenders the `SearchParams` component with the new value

```javascript
import React, { useState } from "react";

const SearchParams = () => {
	const [location, setLocation] = useState("Seattle, WA");
	return (
		<div className="search-params">
			<form>
				<label htmlFor="location">
					<input id="location" value={location} placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
				</label>
				<button>Submit</button>
			</form>
		</div>
	);
};

export default SearchParams;
```

### Rules of Hooks

##### Don't use `if` or `for` with hooks

**IMPORTANT**. You cannot specify `useState` within an `if` statement or in a `for` loop etc. React keeps track of the order in which hooks are created and uses this to assign the correct values and functions. Therefore if the hooks are called out of order, the wrong state will be assigned to the wrong variable. Therefore, you must continue to call them even if you don't need the result. There is an eslint rule to enforce this: `npm i -D eslint-plugin-react-hooks`

##### Accessiblity

Always use `onBlur` with `onChange` since some screen readers do not trigger `onChange`. The JSX accessibility plugin (`eslint-plugin-jsx-a11y`) configured should highlight this if missed out.

### ESLint and hooks

The react team write some eslint rules which help with developing hooks, so useful to add them e.g. don't use hooks within an `if` etc

- `npm i -D eslint-plugin-react-hooks@4.2.0`
- Add `"plugin:react-hooks/recommended", ` to `.eslintrc.json` to the `extends` array (anywhere before prettier - this one has to be last)

### Using `<select>` and `<options>`s with React

```javascript
<label htmlFor={id}>
	{label}
	<select
		id={id}
		value={state}
		onChange={(e) => setState(e.target.value)}
		onBlur={(e) => setState(e.target.value)}
		disabled={options.length === 0}
	>
		<option>All</option>
		{options.map((item) => (
			<option key={item} value={item}>
				{item}
			</option>
		))}
	</select>
</label>
```

Every time something changes, React reruns the render function i.e. `SearchParams`. If the dropdown is sortable and the order of items changed, React would see that that as something having changed and would then rerender everything. It is more performant to set a `key` to something unique for each item in an `<option>` so that React can keep track that when e.g. elements are sorted, so that when nothing has really changed - elements are not created or destroyed - then rerender cycles do not need to be rerun.

### useEffect and Fetching API Data

Effects take the place of several of the lifecycle hooks, e.g.

- `componentDidMount`
- `componentWillUnmount`
- `componentDidUpdate`

The following `useEffect` statement defined within a component is disconnected from the render. It is scheduled to run **after** the initial render happens (potentially not immediately afterwards).

This is required in order to render something to the screen immediately and THEN do long running work e.g. calling an API

```javascript
useEffect(() => {
	// calls the API and gets the breeds for the given animal
	pet.breeds("dog").then(console.log, console.error);
});
```

#### Declaring effect dependencies

Although the effect is disconnected from the render, it will still run every single time that render runs UNLESS the dependencies are declared.

```javascript
useEffect(() => {
	setBreeds([]);
	setBreed("");

	// calls the API and gets the breeds for the given animal
	pet.breeds(animal).then((data) => {
		setBreeds(data.breeds.map((b) => b.name));
	}, console.error);
}, [animal, setBreeds, setBreed]);
```

If the value of `animal` changes, then only then will this effect be triggered after a rerender. eslint also requires that `setBreeds` and `setBreed` are added to the dependency list (although those function definitions will never change).

To run once only on first render, specify the dependency array to be empty (i.e. no dependencies). E.g. set up integration with D3.

To run EVERY SINGLE TIME, don't specify **any** dependency array (likely to get an infinite loop in this case).

#### Full cycle walkthrough

1. `App()` is called which in turn means `SearchParams()` is called
2. All hooks are initialised
3. `UseEffect` is scheduled but not run immediately
4. All markup is returned and rendered in the DOM - user sees the markup
5. The scheduled effect is run, which calls `setBreeds`, calls `setBreed`, then calls the API to get the breeds for the currently selected animal. Newly emptied dropdowns etc are rendered to the DOM.
6. The API returns and the promise callback is called, `breeds` is updated and the dropdown is rerendered with the list of breeds
7. Since `breeds` is NOT in the list of the dependencies the effect is not then rerun after this render

`useState` and `useEffect` are by far the most common hooks that will be used (e.g. 90% of the time). `useRef` may also get used a little. Other hooks tend to be used far less often.

### Custom hooks

Can be used to create reusable functionality e.g. dropdown with state. `useDropdown.js`.
Note. This is the code from v5 of the course. v6 of the course didn't really seem to extract the common functionality from the two dropdowns into something reusable, so not entirely sure of the point of that.

```javascript
// useDropdown.js
import React, { useState } from "react";

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  const id = `use-dropdown-${label.replace(" ", "").toLowerCase()}`;
  const DropDown = () => {
    return (
      <label htmlFor={id}>
        {label}
        <select id={id} value={state}
          onChange={e => setState(e.target.value);}
          onBlur={e => setState(e.target.value);}
          disabled={options.length === 0}
        >
          <option>All</option>
          {options.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
    );
  };
  return [state, DropDown, setState];
};
export default useDropdown;

// SearchParams.js
const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [animal, AnimalDropdown, setAnimal] = useDropdown("Animal", "dog", ANIMALS);
  return (
    <div className="search-params">
    // ...
    <AnimalDropdown />
```

### Handling User Input

Better to use the `<form onSubmit>` rather than the submit button's `<button onClick>` handler so that e.g. pressing enter in a form's input box will ALSO submit the form.

List of events supported in React: https://reactjs.org/docs/events.html#supported-events

Note. These are not the actual browser event objects but `SyntheticEvent`s which wrap the browser's event and standardise any differences between browsers.

### Component Composition

Don't use `{...pet}` when passing pet details into the `<Pet>` component. It becomes impossible to understand which parameters `<Pet>` is using and which it isn't without looking at the `<Pet>` component code.

### NODE_ENV

Environment variable `NODE_ENV=development` is automatically set by Parcel when running `parcel <entry point>` for dev. Using `parcel build <entry point>` then sets `NODE_ENV=production`. (4x larger and 40x slower when using the develop environment - famously missed by Slack)

### Strict mode

`<StrictMode></StrictMode>` component can be used to wrap all or some of your components to enable strict mode which gives additional warnings about using any deprecated parts of React (use `import {StrictMode} from 'react'`)

### React Dev tools

Firefox and Chrome both have a set of Dev Tools for React which allow you to

- Inspect React components
- Syncs the usual DOM inspector the the React component inspector
- Search for components
- Use `$r` in the console to manipulate the currently selected component (mirrors the usual `$0` for the regular DOM)

## React Capabilities

### React Router Route

- `npm i react-router-dom@5.2.0`

```js
import { BrowserRouter, Route } from "react-router-dom";

...
        <BrowserRouter>
          <Route path="/details/:id">
            <Details />
          </Route>
          <Route path="/">
            <SearchParams />
          </Route>
        </BrowserRouter>
```

- can use `<Switch>` to ensure only one link gets chosen (or use `exact="true"`)
- use the Higher Order Component `withRouter` to wrap a component which wants to make use of the router info e.g. `export default withRouter(Details)`

### Class Components

For the most part you can do everything with function components, but a few things you can only do with class components. For the most part they are simply an alternative way of writing React (and the only way of writing React previously).

- merge state in using `setState`. To merge all properties from one object in as is, use `Object.assign` e.g.

```js
this.setState(
	Object.assign(
		{
			loading: false,
		},
		json.pets[0]
	)
);
```

!!! note
`Object.assign` copies all "enumerable own properties" from the source to the target and returns the target.

### Class Properties

In order to use class properties instead of setting the state in the constructor, need to set up babel.

- `npm i -D @babel/plugin-proposal-class-properties@7.13.0 @babel/preset-env@7.13.5 @babel/eslint-parser@7.13.4`

* `.babelrc` becomes

```js
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ],
    "@babel/preset-env"
  ],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

- Then add the following to the `.eslintrc.json` to keep ESLint happy - it has its own babel config, but if you are using super recent features, it is useful to tell ESLint to use your own babel config rather than its default one.

`"parser": "@babel/eslint-parser"`

Now just write: `state = { loading: true };`.

### Manage State in a Class Component

- `props` is state passed in from the parent - read only
- `state` is mutable state managed by this component
- `defaultProps` is a static property object which will automatically be used if `props` doesn't have a value for a particular property
  - class components: use `static defaultProps = {images = ["https://i.com/i.jpg]}` and `props.images` will contain this value IF nothing passed in from the parent.
  - function components: use `MyComponent.defaultProps = {x: 1}` outside the function definition
  - typescript versions, see: https://blog.bitsrc.io/understanding-react-default-props-5c50401ed37d

### Interactive Class Component

### getDerivedStateFromProps

`getDerivedStateFromProps` is a useful method which takes props, filters and returns state. Must be `static`.

```javascript
  static getDerivedStateFromProps({media}) {
    let photos = ['http://placecorgi.com/600/600'];
    if (media.length) {
      photos = media.map(({large}) => large);
    }
    return {photos};
  }
```

### Context

Be SUPER CAREFUL with event listener functions and functions which get passed into children, because the `this` will NOT be correct UNLESS you use an arrow function (lexically sets `this` which, since it is in the class code will set `this` to the class. If you use a regular function, `this` will be determined by what invokes the function which WON'T be the correct thing).

```javascript
  handleClick = (e) => {
    this.setState({...this.state, active: e.target.dataset.index});
  };

  render() {
    const { active, photos, maxWidth } = this.state;
    return (
      <div className="carousel" style={% raw %}{{width: maxWidth}}{% endraw %} >
        <img src={photos[active]} alt="animal" />
        <div className="carousel-smaller">
          {photos.map((photo, index) => (
            // eslint-disable-next-line
            <img key={photo} src={photo} alt="animal" data-index={index} onClick={this.handleClick} onKeyUp={this.handleClick} />
          ))}
        </div>
      </div>
    )
  }
}
```

## Error Boundaries

Need to be careful when calling APIs with errors. For further info see the docs: https://reactjs.org/docs/error-boundaries.html.

- Need to use full class components (not function components)
- Can't use with async / await
- Requires either `didComponentCatch` or `static getDerivedStateFromError` to be defined
  - Use `getDerivedStateFromError` to control state, which the render can use to show a fallback UI
  - Use `didComponentCatch` to log errors
- Doesn't catch errors in this component only child components and otherwise acts as a simple passthrough (use `return this.props.children` if no errors)
- Generally a component which is declared once and used throughout the application
- Try / catch only works for imperative code e.g. `showButton()`; error boundary classes are required for declarative code such as inclusion of a child component in a parent
- Error boundaries are not necessary for (and don't work with) event handlers. Simply use a try catch in the event handler function, set some state and then check that state in the `render()` method

`{...props}` - useful way of passing all props from parent to child, but don't use this willy nilly - makes your code harder to read.

```js
class ErrorBoundary extends Component {
	state = { hasError: false };

	static getDerivedStateFromError(e) {
		return { hasError: true };
	}
	componentDidCatch(error, info) {
		// log to Sentry, Azure Monitor, New Relic, Track JS
		console.error(`ErrorBoundary caught an error ${error} ${info}`);
	}
	render() {
		if (this.state.hasError) {
			return (
				<h1>
					Error. <Link to="/">Return to home.</Link>
				</h1>
			);
		}
		return this.props.children;
	}
}
export default ErrorBoundary;
```

```javascript
export default function DetailsWithErrorBoundary(props) {
	return (
		<ErrorBoundary>
			<Details {...props} />
		</ErrorBoundary>
	);
}
```

#### Redirecting

Either use `<Redirect>` from BrowserRouter.

```javascript

// note wouldn't catch errors if thrown in VERY FIRST render
componentDidUpdate() {
  if (this.state.hasError) {
    setTimeout(() => this.setState({ redirect: true }), 5000);
  }
}
render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    //...
```

### componentDidMount

`componentDidMount` gets run every single time either state OR props changes (similar to effects, but they only run when the declared dependencies change)

## Context

Context is new to React, similar to component state, but available globally. A data store for the whole application. This mostly replaces Redux. Useful, but a double edged sword / sledgehammer. React makes the flow of data obvious and having global state bypasses this. However, saves having to pass in state from component to component to component.

### Context with hooks

```javascript
import { createContext } from "react";
// "green" is the default version - typescript reads this and types your context for you
const ThemeContext = createContext("green");
// here the default value is a "hook"
// the second thing in a hook is always a function e.g. setState
// the function will never be used, but signifies to typescript what will be here
const ThemeContext = createContext(["green", () => {}]);
export default ThemeContext;
```

Add `ThemeContext` to the app tree using `ThemeContext.Provider` so that all components which require it are inside. In a component which wants to use the `ThemeContext`, add a `useContext` hook to make it available, and then use as required.

```js
const App = () => {
  const themeHook = useState("darkblue");
  return (
    <!-- here we are passing the hook - a set containing a value and a function to change that value -->
    <ThemeContext.Provider value={themeHook}>
     <!-- rest of app component tree -->
```

```javascript
// the hook is destructured, so 'theme' here is the value
const [theme] = useContext(ThemeContext);
//...
<button style={% raw %}{{ backgroundColor: theme }}{% endraw %}>Submit</button>;
```

### Context with Classes

Can't use hooks with classes, so has to be done a different way.

```javascript
// without destructuring
<ThemeContext.Consumer>
  {(themeHook) => <button style={% raw %}{{ backgroundColor: themeHook[0] }}{% endraw %}>Adopt Me</button>}
</ThemeContext.Consumer>
// with destructuring
<ThemeContext.Consumer>
  {([theme]) => <button style={% raw %}{{ backgroundColor: theme }}{% endraw %}>Adopt Me</button>}
</ThemeContext.Consumer>
```

## Portal

Want to be able to show a modal which is shown over the whole page. Therefore needs to be seperate to the react app, but useable from within in. Also need to be careful not to create memory leaks by ensuring we hold a reference to the modal we create and tearing it down afterwards.

1. Add new `<div id="modal"></div>` to index.js
2. Add `Modal.js` which creates a single element for the modal and appends this to the `<div>` in index.js via `useEffect`. Add dependency list `[]` to ensure it only runs once. The function it returns will be used when the component is unmounted.

```javascript
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

const Modal = ({ children }) => {
	// ensure we never lose the element we create by getting a "reference"
	let elementRef = useRef(null);
	if (!elementRef.current) {
		elementRef.current = document.createElement("div");
	}

	useEffect(() => {
		modalRoot.appendChild(elementRef.current);
		return () => modalRoot.removeChild(elementRef.current);
	}, []);

	return createPortal(<div>{children}</div>, elementRef.current);
};

export default Modal;
```

3. Use the modal in another component e.g.

```javascript
if (this.state.showModal) {
	return (
		<Modal>
			<button onClick={this.toggleModal}>Close</button>
		</Modal>
	);
}
```
