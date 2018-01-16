---
layout: post
title: Treehouse Project Framework Basics
tagline: Bootstrap et al
---
## Overview

Will check out two of the most common frameworks:
* Twitter Bootstrap
* Zurb Foundation

Most frameworks can be divided into either simple frameworks or complete frameworks. Simple frameworks will help reset the css or provide a simple grid system. A complete framework offers a complete set of tools including grid, styles, typography, UI components (buttons, forms) and some javascript components.

Furthermore frameworks tend to use common best practises. Dry, reusable, predictable, maintainable and scaleable. Good documentation. Valuable learning tool.

Not to be used as a crutch. Only use a framework if you already know html, css etc. Best used if you have limited time, budget or limited design or coding skills.

Still need to learn how to use how the framework works.

## Introduction to Bootstrap

Currently powers over 1% of the web. Built from the ground up in 2011 by the engineers at Twitter. One of the most complete frameworks. Cross browser. Built with the LESS CSS preprocessor so takes advantage of variables, mixins and nesting. Also contains common jQuery javascript plugins.

## Downloading Bootstrap

* Download from the compiled version from the <http://getbootstrap.com>
* Checkout from original files from GitHub at <https://github.com/twbs/bootstrap>
* Download using a package manager such as <http://bower.io>
* Reference the CDN versions

## Basic tags

`class="container"` can be used on the main content div to centre the content and setup breakpoints to ensure the design is responsive
`class="page-header"` segments off the header
`class="nav"` sets up the main navigation styling, additionally style with 'nav-tabs' or 'nav-pills'
`class="jumbotron"` gives a section a light grey background and larger font
`class="lead"` around a piece of text will ensure it is seperated a little from surrounding content
`class="btn"` gives a button appearance, with button modifier classes to change colour, size etc
Alternatively use button groups to group buttons together with `class="btn-group"`

## Using the grid system

There are 12 grid columns. All columns have to be contained within a `class="row"`. Column classes specify the number of grid columns they span e.g. `class="col-2"` and also have a size component to specify the behaviour at different size breakpoints. Bootstrap caters for 4 main device sizes and therefore 4 main breakpoints: phone, tablet, desktop and large desktop. `class="col-xs-2` will ensure columns are always stacked horizontally whereas `class="col-md-2` will stack columns vertical at phone and tablet size, but stack columns horizontally at desktop and large desktop size.

### Offset

`col-md-offset-4` will offset a column further to the right if required and leave a gap.

### Nested rows and columns

Rows can be nested inside columns. The column widths will still be specified in terms of 12 grid columns, but will only have the width of the column containing the row.

### Responsive images

Images don't always scale to fill their container and may overflow. This can usually be resolved by adding the style `width: 100%; height: auto;`. With bootstrap the equivalent class is `class="img-responsive"` applied to the img tag.

### Push and pull

Similar to offset, columns can be pushed to the right and pulled to the left, which can again be controlled according to breakpoint size. e.g. `class="col-md-push-6` will push a column right 6 grid columns at device sizes medium and large. 

### Showing and hiding content

In order to show only some content at smaller device sizes, the `visible` and `hidden` sets of classes can be used. e.g. `class="visible-lg`, `class="hidden-xs`. Bootstrap documentation details the exact results.

### Navigation

The navbar needs to be placed outside of the container div in order to span the whole width of the page. An inner div marked up with the class `container` can then be used to ensure the content of the nav is the same width as the contents of the page.