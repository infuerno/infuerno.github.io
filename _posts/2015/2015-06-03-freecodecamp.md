---
layout: post
title: "FreeCodeCamp"
tags: [notes, courses]
---
## Basic HTML and CSS

### Import a google font 

    <link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>

### Make circular images with border-radius

Use the css: `border-radius: 50%;`

### Button tags

    <button type='submit'>Submit</button>

### Required

With HTML5 use a `required` attribute to ensure a field is completed

### Radio buttons

    <label>
      <input type="radio" name="indoor-outdoor">outdoor
    </label>
    <label>
      <input type="radio" name="indoor-outdoor">indoor
    </label>

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


