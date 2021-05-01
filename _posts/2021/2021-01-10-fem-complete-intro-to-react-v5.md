---
layout: post
title: "Frontend Masters: Complete Intro to React v5"
---

## Introduction

- Course notes: https://btholt.github.io/complete-intro-to-react-v5/
- v3 of the course is useful for webpack and react router
- Git repo: https://github.com/btholt/complete-intro-to-react-v5
- Recommended course on GIT: https://frontendmasters.com/courses/git-in-depth/

## Pure React

### Simple React App

Start by writing react using pure JavaScript without JSX, babel, webpack etc, to understand what the tools are adding.

1. Create a boilerplate `index.html` and load the react libraries (NOTE: not a good way to load libraries, but useful for quick POCs)

```javascript
  <script src="https://unpkg.com/react@16.8.4/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16.8.4/umd/react-dom.development.js"></script>
```

2. Open `index.html` in a browser. Checking the console both `React` and `ReactDOM` are both loaded and available.
3. Create a "rubberstamp" called "App" (note, haven't yet USED the stamp yet). Whenever "App" gets called, a `div` will be stamped with an `h1` inside each one. A react component is just something which creates markup.

```javascript
  <script>
    const App = () => {
      return React.createElement(
        "div",
        {},
        React.createElement("h1", {}, "Adopt Me!")
      );
    }
  </script>
```

4. To use the stamp, we need to render the results to the DOM

```javascript
ReactDOM.render(React.createElement(App), document.getElementById("root"));
```

5. Refresh index.html and the div and h1 will be rendered to the DOM. This is the most basic react app.

### Composability

Power of react is the ability to make components, which can be put inside of components, which are put inside of components etc. A composability model.

`App` here is a **composite component** (i.e. a component we create). The `createElement` method takes 3 arguments, a DOM element or a component (e.g. `h1` or `App`), a list of attributes, and the children, either singular, multiple parameters or an array.

React is not prescriptive or opinionated about how the project is organised, but usually create one file per component. Create a new file `App.js` and move the code into this.

### Props

Pass values into a component using `props` e.g.:

```javascript
const Pet = (props) => {
  return React.createElement("div", {}, [
    React.createElement("h1", {}, props.name),
    React.createElement("h2", {}, props.animal),
    React.createElement("h2", {}, props.breed),
  ]);
};
React.createElement(Pet, { name: "Harry", animal: "Horse", breed: "Piebald" });
```

Same component using destructuring:

```javascript
const Pet = ({name, animal, breed}) => {
  return React.createElement("div", {}, [
    React.createElement("h1", {}, name),
    React.createElement("h2", {}, animal),
    React.createElement("h2", {}, breed),
  ]);
};
React.createElement(Pet, { name: "Harry", animal: "Horse", breed: "Piebald" });
```

## Tools

### Prettier

- Install prettier `npm i -D prettier`
- Add a script to format: `"format": "prettier src/**/*.{js,html} --write"`
- Install the prettier vs code extension, format on save, only if config file
- Create `.prettierrc` and at least add `{}`

### eslint

- Install `eslint` for linting and `eslint-config-prettier` to tell eslint prettier is being used for formatting: `npm i -D eslint eslint-config-prettier`

- Install the eslint vs code extension
- Create `.eslintrc.json` with the following

```json
{
  "extends": ["eslint:recommended", "prettier", "prettier/react"], // recommended is a set of rules, could also use standard, airbnb
  "plugins": [],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module", // use import / export / es modules
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "es6": true, // won't choke on async await
    "browser": true, // setTimeout, window
    "node": true // won't choke on http and require
  }
}
```

- Add a script `"lint": "eslint src/**/*.{js,jsx} --quiet"`

### Parcel

- Install parcel: `npm i -D parcel-bundler`
- Add a script: `"dev": "parcel src/index.html"`

NOTE: npm knows what `parcel` is due to the hidden `node_modules/.bin/` directory which contains these executables

#### Install NPM packages automatically

Type an import statement for a package which isn't yet installed and Parcel on save (which builds the project if currently running) will automatically install the npm package for you

#### NODE_ENV

Environment variable `NODE_ENV=development` is automatically set by Parcel when running `parcel <entry point>` for dev. Using `parcel build <entry point>` then sets `NODE_ENV=production`. (4x larger and 40x slower when using the develop environment - famously missed by Slack)

### React

- `npm i react react-dom`
- Remove previously added script Elements

#### Strict mode

`<React.StrictMode></React.StrictMode>` component can be used to wrap all or some of your components to enable strict mode which gives additional warnings about using any deprecated parts of React.

### Dev tools

Firefox and Chrome both have a set of Dev Tools for React which allow you to
* Inspect React components
* Syncs the usual DOM inspector the the React component inspector
* Search for components
* Use `$r` in the console to manipulate the currently selected component (mirrors the usual `$0` for the regular DOM)

## JSX

JSX is translated to React code via a tool called [babel](https://babeljs.io/). Thus

```javascript
return React.createElement("div", {}, [
  React.createElement("h1", {}, name),
  React.createElement("h2", {}, animal),
]);
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

#### eslint with JSX

At this point eslint will complain that `React` is being imported but never used (however it IS used, because the JSX is transpiled to `React.createElement`).

- `npm install -D babel-eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`
  - `babel-eslint` allows eslint to be augmented by babel so it can understand react better
  - `eslint-plugin-import` gives new rules around importing and exporting
  - `eslint-plugin-jsx-a11y` (accessibility) introduces several no brainers for accessibility
  - `eslint-plugin-react` for additional react rules

* Update the eslint config:

```
{
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
    "prettier/react"
  ],
  "rules": {
    "react/prop-types": 0,
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

## Hooks

See: https://frontendmasters.com/courses/complete-react-v5/setting-state-with-hooks/

There are various hooks including: `useState`, `useEffect`, `useCallback`, `useMemo`. (Always start with `use`). Hooks are a way of creating stateful logic in React. This supplants the old way of using `setState` in React (described later).

### Create a new hook

`const [location, setLocation] = useState("Seattle, WA");`

- `useState` creates a hook, and is passed the initial value, it returns an array of two objects (which can be named anything)
  - `location` is the current value of the state
  - `setLocation` is the updater function for that piece of state

### Using a hook

`onChange={e => setlocation(e.targetValue)}`

- `e` is an event which happened on the input
- Call `setLocation` (the updater) with whatever is inside that particular event i.e. the value of the input. This will then update the value of the state.
- A rerender will be triggered which will have the new value of `location` and will set the input to this value (i.e. the same as before)

### Full cycle walkthrough

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
          <input
            id="location"
            value={location}
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default SearchParams;
```

### Best practises for hooks

#### Don't use `if` or `for` with hooks

**IMPORTANT**. You cannot specify `useState` within an `if` statement or in a `for` loop etc. React keeps track of the order in which hooks are created and uses this to assign the correct values and functions. Therefore if the hooks are called out of order, the wrong state will be assigned to the wrong variable. Therefore, you must continue to call them even if you don't need the result. There is an eslint rule to enforce this: `npm i -D eslint-plugin-react-hooks`

#### Accessiblity

Always use `onBlur` with `onChange` since some screen readers do not trigger `onChange`. The JSX accessibility plugin (`eslint-plugin-jsx-a11y`) configured should highlight this if missed out.

#### Using `<select>` and `<options>`s with React

```javascript
<label htmlFor={id}>{label}
  <select id={id} value={state}
    onChange={e => setState(e.target.value)}
    onBlur={e => setState(e.target.value)}
    disabled={options.length === 0}
  >
    <option>All</option>
    {options.map(item => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>
</label>
```

Every time something changes, React reruns the render function i.e. `SearchParams`. If the dropdown is sortable and the order of items changed, React would see that that as something having changed and would then rerender everything. It is more performant to set a `key` to something unique for each item in an `<option>` so that React can keep track that when e.g. elements are sorted, so that when nothing has really changed - elements are not created or destroyed  - then rerender cycles do not need to be rerun.

### Custom hooks

Can be used to create reusable functionality e.g. dropdown with state. `useDropdown.js`.

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

## Effects

Effects take the place of several of the lifecycle hooks, e.g.
* `componentDidMount`
* `componentWillUnmount`
* `componentDidUpdate`

The following `useEffect` statement defined within a component is disconnected from the render. It is scheduled to run **after** the initial render happens (potentially not immediately afterwards).

This is required in order to render something to the screen immediately and THEN do long running work e.g. calling an API

```javascript
  useEffect(() => {
    // calls the API and gets the breeds for the given animal
    pet.breeds("dog").then(console.log, console.error);
  });
```

### Declaring effect dependencies

Although the effect is disconnected from the render, it will still run every single time that render runs UNLESS the dependencies are declared.

```javascript
  useEffect(() => {
    setBreeds([]);
    setBreed("");

    // calls the API and gets the breeds for the given animal
    pet.breeds(animal).then(data => {
      setBreeds(data.breeds.map(b => b.name));
    }, console.error);
  }, [animal, setBreeds, setBreed]);
```

If the value of `animal` changes, then only then will this effect be triggered after a rerender. eslint also requires that `setBreeds` and `setBreed` are added to the dependency list (although those function definitions will never change).

To run once only on first render, specify the dependency array to be empty (i.e. no dependencies). E.g. set up integration with D3.

To run EVERY SINGLE TIME, don't specify **any** dependency array (likely to get an infinite loop in this case).

### Full cycle walkthrough

1. `App()` is called which in turn means `SearchParams()` is called
2. All hooks are initialised
3. `UseEffect` is scheduled but not run immediately
4. All markup is returned and rendered in the DOM - user sees the markup
5. The scheduled effect is run, which calls `setBreeds`, calls `setBreed`, then calls the API to get the breeds for the currently selected animal. Newly emptied dropdowns etc are rendered to the DOM.
6. The API returns and the promise callback is called, `breeds` is updated and the dropdown is rerendered with the list of breeds
7. Since `breeds` is NOT in the list of the dependencies the effect is not then rerun after this render

`useState` and `useEffect` are by far the most common hooks that will be used (e.g. 90% of the time). `useRef` may also get used a little. Other hooks tend to be used far less often.

## Async and Routing

### Async code without effects

Async code can be handled in React with effects, useful when data changes and you need to react OR when setting up / tearing down a component. An alternative for e.g. when a user clicks a button / submits a form etc is to simply use an async function wired up to the event handler. 

### Mock API

1. Install `cross-env` to ensure environment vars work in both windows and mac (dev dependency since this is in order to use a mock API)
2. In package.json: `"dev-mock": "cross-env PET_MOCK=mock npm run dev"`

### One-Way data flow

Data flows from parent to child and from that child to its child. This is a common pattern and since the child has no knowledge of the parent, then there is no way that a problem with the child can affect the parent.

It is possible, but intentially difficult to reverse this flow (mainly used by library authors).

### Routers

There are two main routers: React router and Reach router (also now a third, Navi). Reach router handles accessibility better and is very a11y focussed (v3 of the course uses React router, this version uses Reach router).

Wrap `<Router>` around the components to be routed, giving each one a `path` attribute.

```javascript
const App = () => {
  return (
    <React.StrictMode>
      <div>
        <header>
          <Link to="/">Adopt Me!</Link>
        </header>{" "}
        <Router>
          <SearchParams path="/" />
          <Details path="/details/:id" />
        </Router>
      </div>
    </React.StrictMode>
  );
};
```
* React router will render ALL matching routes (unless you use "switch" in which case the first which matches)
* Reach router will render the most specific matching route (using a scoring system - one of its main claims to fame)

With Reach router, can also have multiple routers on the same page e.g. a seperate router to render the navigation.

Snazzy debugging technique to write an object to the DOM e.g. here useful to see props passed in by the router (a fair bit of information):

```javascript
<pre>
  <code>{JSON.stringify(props, null, 2)}</code>
</pre>
```

Useful to see how state and props are changing over time (though can of course use the browser tools).

#### Link
Note also the example above of using `Link` from Reach router to link the header on the back of each page to the homepage: `<Link to="/">Adopt Me!</Link>`

## Class Components

So far have only used "function components". Can also use class components.

```javascript
import react from 'React';
class Details extends React.Component {
  render() {

  }
}
export default Details;
```
* Must have a render method
* Can't use hooks with classes e.g. `useState`, `useEffect` etc
* `componentDidMount` - similar to effects but only runs on start up and then never again. Useful for AJAX requests.
* use `this.setState` to update the objects private state - this does a shallow merge - matching attributes will get overwritten (so if its an object the whole object will get overwritten)

### Class Properties

Instead of writing out the constructor and `setState` can instead just write: `state = { loading: true };`.

### getDerivedStateFromProps

`getDerivedStateFromProps`  is a useful method which takes props, filters and returns state. Must be `static`.

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

Be SUPER CAREFUL with event listener functions and functions which get passed into children, because the `this` with NOT be correct UNLESS you use an arrow function (lexically sets `this` which, since, it is in the class code will set `this` to the class. If you use a regular function, `this` will be determined by what invokes the function which WON'T be the correct thing).

```javascript
  handleClick = (e) => {
    this.setState({...this.state, active: e.target.dataset.index});
  };

  render() {
    const { active, photos, maxWidth } = this.state;
    return (
      <div className="carousel" style={{width: maxWidth}} >
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

* Need to use full class components (not function components)
* Can't use with async / await
* Requires either `didComponentCatch` or `static getDerivedStateFromError` to be defined
  * Use `getDerivedStateFromError` to control state, which the render can use to show a fallback UI
  * Use `didComponentCatch` to log errors
* Doesn't catch errors in this component only child components and otherwise acts as a simple passthrough (use `return this.props.children` if no errors)
* Generally declared once and used throughout the application
* Try / catch only works for imperative code e.g. `showButton()`; error boundary classes are required for declartive code such as inclusion of a child component in a parent
* Error boundaries are not necessary for (and don't work with) event handlers. Simply use a try catch in the event handler function, set some state and then check that state in the `render()` method

`{...props}` - useful way of passing all props from parent to child, but don't use this willy nilly - makes your code harder to read.

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
Either use `<Redirect>` or `nagivate()`, both from ReachRouter.

```javascript
componentDidUpdate() {
  if (this.state.hasError) {
    setTimeout(() => this.setState({ redirect: true }), 5000);
    //OR JUST setTimeout(() => navigate("/"));
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

Context is new to React, similar to component state, but available globally. A data store for the whole application. This mostly replaces Redux. Useful, but a double edged sword. React makes the flow of data obvious and having global state bypasses this. However, saves having to pass in state from component to component to component.

### Context with hooks

```javascript
import React from "react";
const ThemeContext = React.createContext(["green"], () => {});
export default ThemeContext;
```

Add `ThemeContext` to the app tree so that all components which require it are inside. In a component which wants to use the `ThemeContext` (using `ThemeContext.Provider`), add a `useContext` hook to make it available, and then use as required.

```javascript
  const [theme] = useContext(ThemeContext);
  //...
  <button style={{ backgroundColor: theme }}>Submit</button>
```
### Context with Classes
Can't use hooks with classes, so has to be done a different way. 

```javascript
// without destructuring
<ThemeContext.Consumer>
  {(themeHook) => <button style={{ backgroundColor: themeHook[0] }}>Adopt Me</button>}
</ThemeContext.Consumer>
// with destructuring
<ThemeContext.Consumer>
  {([theme]) => <button style={{ backgroundColor: theme }}>Adopt Me</button>}
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