---
layout: post
title: "FreeCodeCamp"
tags: [notes, courses]
---
## Basic HTML and CSS

### Radio buttons

```html
<label><input type="radio" name="indoor-outdoor" value="indoor" checked> Indoor</label>
<label><input type="radio" name="indoor-outdoor" value="outdoor"> Outdoor</label>
```

* Use the `name` attribute to group radio buttons
* Use the `value` attribute to use this as the value when POSTing the form (default is simply `on`) e.g. `indoor-outdoor=indoor`

### Checkboxes

```html
<label><input type="checkbox" name="personality" checked> Loving</label>
<label><input type="checkbox" name="personality"> Lazy</label>
<label><input type="checkbox" name="personality"> Energetic</label>
```

### Import a google font 

    <link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>

### Make circular images with border-radius

Use the css: `border-radius: 50%;`

### Button tags

    <button type='submit'>Submit</button>

### Required

With HTML5 use a `required` attribute to ensure a field is completed

### CSS variables

Available inside the selector specified AND that selectors decendants. Therefore often defined in the `:root` element (a psuedo selector which matches the root element, usually `html`). Can be overriden by redefining further down e.g. within a media query

```css
:root {
    --penguin-size: 300px;
}
@media (max-width: 350px) {
    :root {
        --penguin-size: 200px;
    }
}
```

* Define: `--penguin-skin: grey;`
* Use: `background: var(--penguin-beak);`
* Use with fallback: `background: var(--penguin-beak, orange);` (useful for debugging)
* For compatibility with browsers which don't implement variables, good pratice to specify a fallback color explicitly using normal syntax

### position: absolute

One nuance with absolute positioning is that it will be locked relative to its closest positioned ancestor. If you forget to add a position rule to the parent item, (typically done using `position: relative;`), the browser will keep looking up the chain and ultimately default to the body tag.

### position: fixed

One key difference between the fixed and absolute positions is that an element with a fixed position won't move when the user scrolls.

### z-index

Elements are drawn on top of each other as the HTML is parsed.

* Must be an integer
* 0 z-index is implicitly applied 
* Add a positive `z-index` to keep earlier elements in the DOM on top of later elements 
* Add a negative `z-index` to keep later elements in the DOM underneath earlier elements

### margin: auto

Centre a div on the page using `margin: auto`

### repeating-linear-gradient()

```
background: repeating-linear-gradient(
  45deg,
  yellow 0px,
  yellow 40px,
  black 40px,
  black 80px
);
```

### transform

* `transform: scale(2);`
* `transform: skewX(24deg);`

### CSS animations

* Define name and duration on an element `animation-name: wat; animation-duration: 5s`
* Define keyframes for a given animation:

```
@keyframes wat {
    0% { width: 20px; }
    100% { width: 40px; }
}
```

* If only 100% is specified, 0% is assumed as the current state
* Keep the effect of the animation after it has finished: `animation-fill-mode: forwards;`
* Elements must have `position` explicitly set to apply movement animations
* Specify number of iterations using: `animation-iteration-count` to e.g `3` or `infinite`
* `animation-timing-function` is used to specify the easing
    - `ease` (default) - starts slowly, speeds up, slows down again
    - `ease-out` - fast at the beginning, slows down
    - `ease-in` - slow at the beginning, speeds up
    - `linear` - constant speed
    - `cubic-bezier(0.25, 0.25, 0.75, 0.75)` to apply a bezier curve for better control
    - `cubic-bezier(0.311, 0.441, 0.444, 1.649)` for juggling motion (y value can be > 1)

## Responsive Design with Bootstrap

`img-responsive` class to make images responsive
`text-center` to center text e.g. a heading
`btn` class on a button
`btn-block` class on a button to change display to block
`row` class on a div to arrange elements in rows
`col-xxx` class on a div to arrange elements in columns inside of rows e.g. `col-xs-4` to take up 4 parts of a 12 col layout
`text-primary` class to set a primary colour
`<i class="fa fa-thumbs-up"></i>` to use font awesome to add "like" icon image
`<i class="fa fa-info-circle"></i>` for an info circle
`<i class="fa fa-trash"></i>` for a trash can
`<i class="fa fa-paper-plane"></i>` for a paper plane

## jQuery

### Get Started with jQuery

Script tags are not self-closing and should have a type attribute: `<script type="text/javascript" src="script.js"></script>`

#### Selectors

`$()` is used to target jQuery e.g. `$(document)` to target the HTML document using jQuery, and `$(document).ready();` to take some action when the HTML document is ready. 

#### Functions

Add an anonymous function to be executed on document.ready e.g. `$(document).ready(function() { alert("ready"); });`

Target other elements and call functions on them as required e.g.:

    $(document).ready(function() {
        $('div').mouseenter(function() {
            $('div').fadeTo('slow', 1); 
        });
    });

#### jQuery variables

The `$` can be added to the front of any variable name to indicate a $ object e.g. $div = $('div')

#### Compound selectors

Select multiple elements as in css using comma seperated lists e.g. `$('p, li')` to select both `p` and `li` elements.

#### `this`

The `this` keyword generally refers to the jQuery object you are currently doing something with. So when using event handlers e.g. click(), mouseenter(), `$(this)` will target the target of the eventhandler event.

### Harness Dynamic HTML

#### Elements

HTML elements can be created using strings e.g. `$("<h1>hello world</h1>")` creates a new `h1` element.

* `append()`, `prepend()`, `appendTo()` and `prependTo` can be used to insert new elements into the document
* `before()`, `after()` are also options e.g. `$('div#one').after('<p>yo</p>');`
* Existing elements can also be moved using `before()` and `after()`
* `empty()` removes all content from an element
* `remove()` removes the element itself

#### Attributes

* `addClass()` and `removeClass()` add and remove classes from elements and `toggleClass()` adds or removes as req
* `height()` and `width()` are css attributes with their own methods for altering values (since commonly used)
* `css()` can be used to alter any css property passing the property name and value as parameters e.g. `$('p').css('background-color', 'red')`
* These methods can all be chained

#### Content

`.html()` can be used to both get and set the content of elements
`.val()` is used to get the value of form elements e.g. `$('input:checkbox:checked').val();`

### Listen for jQuery Events

    $(document).ready(function() {
        $('thingToTouch').event(function() {
            $('thingToAffect').effect();
        });
    });

* `on()` jQuery parses the DOM on document load, so dynamically elements aren't necessarily found. The `on()` event handler is a general purpose event handler taking the event, selector and action as inputs.

    $(document).on('click', '.item', function() {
        $(this).remove();
    });

* `click()`
* `dblclick()`
* The `hover()` event can take two parameters, the first one for the action done on hover, the second for the action done when no longer hovering.
* Some HTML elements can have `focus()` when someone clicks or tabs to them e.g. textarea and input. Use the `focus()` event to apply actions when an element gets focus e.g. adding an outline colour to an input field.
* `keydown()` takes an optional parameter `key` which holds the key which was pressed. Note: focus needs to be on the current HTML document

### Trigger jQuery Effects

* `animate()` takes, two parameters: the animation to perform and the time in which to do it.
e.g. `('img').animate({left: "-=10px"}, 'fast');`
* `effect()` [requires jQueryUI] takes an initial parameter to indicate the effect e.g. explode, bounce, slide. Depending on the effect further parameters are required to describe the effect e.g. `$('div').effect('bounce', {times:3}, 500);` 
* `accordion()` can be use to expand and collapse inner panels. Additional parameters can be passed to change the default behaviour e.g. `$("#menu").accordion({collapsible: true, active: false});`
* `draggable()` can be called on any element to allow it to be dragged around the page
* `resizable()` once called allows you to resize an element
* `selectable()` allows child elements to have the appearance of being 'selected'
* `sortable()` allows child elements to be 'sorted'

## JavaScript

### Functions

Functions can be defined in one of two ways:

    var divideByThree = function (number) {
        return number / 3;
    };

    function divideByThree(number) {
        return number / 3;
    }

The second _function declaration_ will be parsed prior to running the code, so can be placed anywhere in the file, whereas the first function will by parsed inline, so must come before any usage. (See this reference: <http://eloquentjavascript.net/03_functions.html>)

Local variables used inside function MUST be declared using the `var` keyword, otherwise they will use a global variable of the same name if this exists in the global scope.

`Math.random()` produces a random number between 0 and 1

### For loops


