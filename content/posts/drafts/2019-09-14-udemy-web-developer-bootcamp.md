---
layout: post
title: "Udemy: Web Developer Bootcamp"
---

# Sublime Text Shortcuts

--|--
Shortcut | Description
Ctrl-U | View page source (chrome)
Ctrl-/ | Comment toggle on / off
Ctrl-Shift-D | Duplicate line
Ctrl-Click multiple places | Multiple cursors

# HTML

* MDN - Super useful resource for HTML, CSS and JavaScript
* Boolean attributes - attribute without a value e.g. `disabled`
* Whitespace - no matter how much whitespace is used (includes spaces and line breaks), the HTML parser reduces each one down to a single space when rendering the code
* MDN element reference - lists all HTML elements (approx 100): https://developer.mozilla.org/en-US/docs/Web/HTML/Element
* MDN attribute reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes

## Tables
* Use `<tr>` with `<th>` for headers. Enclose in `<thead>` and `<tbody>` for HTML5 enhanced semantics.

## Forms
* `<input>` elements have a `type` attribute e.g. `button`, `checkbox`, `color`. See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
* `<form>` will submit to the same page using GET by default (if `action` or `method` are not specified)
* Use the `name` attribute to specify the **key** of the value when submitting
* `<label>` can wrap around `<input>` OR use `for` to target the element with matching `id` attribute
* Use the `name` attribute on `radio` type inputs to group, also used as the key when submitting
* Use the `value` attribute on `radio` type inputs for the value when submitting (default is `on`)
* Use the `name` attribute on `select` type for the key when submitting
* Use the `value` atribute on `select` type to override the text when submitting

# CSS

* All 148 named colours: http://colours.neilorangepeel.com
* Specify colours using hex, rgb or rgba (includes transaprency) e.g. `rgba(255,0,0,.5)`. for 50% transparent red

## Selectors
* Adjacent selector: `h4 + ul` - all `ul`s following `h4`s
* Attribute selector e.g. all inputs of a certain type: `input[type="checkbox"]`
* Nth of type selector: `ul:nth-of-type(3)` or `li:nth-of-type(even)`
* Pseudo class selector: e.g. `a:hover`; `input:checked`

## Specificity
* Specifity calculator: https://specificity.keegan.st
* W3C spec on specifity: https://www.w3.org/TR/selectors-3/#specificity
* id selectors > class, attribute, psuedo-class selectors > type selectors
* Additionally multiple class selectors > a single class selector (total the number of selectors)

## Texts and Fonts

* Common fonts available in different OSes: https://www.cssfontstack.com
* Google fonts - 1000 or so free fonts: https://fonts.google.com
* `em` is relative to the containing element
* `rem` is relative to the root element

## Box model

* margin (orange) > border > padding (green) > content (blue)

# Bootstrap 3 to 4

* Migration docs: https://getbootstrap.com/docs/4.3/migration/
* Main changes:
    - Flexbox is enabled by default
    - Switched from px to rem
    - Global font size changed from 14px to 16px
    - New "utility classes"
    - Grids: New grid tier, class names have changed
    - `card`s replaces `panel`s, `thumbnail`s and `well`s
    - Colours completely revamped
    - Blockquotes revamped

## Utility classes

* Border classes
    - `border` or `border-left` to add borders
    - `border-0` or `border-left-0` to remove existing borders
    - `border-primary` for border colours
    - `rounded-top` for border radius
* Spacing classes (non-responsive)
    - 3 elements in the form `{property}{sides}-{size}`
        + `m` or `p` - margin or padding
        + `t`, `r` etc or `x`, `y` - top, right etc
        + `0` up to `5` for the amount, or `auto`
    - e.g. `mt-0` for margin top of 0; `m-0` for margin all round of 0
* Spacing classes **including** responsive
    - 4 elements: `{property}{sides}-{breakpoint}-{size}`
        + `xs` by default if no breakpoint specified (i.e. all sizes)
        + Adding a breakpoint = that size AND larger

## Navbars

* NEED to specify where the breakpoint between collapsed and expanded using `navbar-expand-{breakpoint}`
* `navbar-light` for light text; `nav-dark` for dark text (**required**) (no more `navbar-default`)
* NEED to specify a background color e.g. `bg-dark`

## Display utility

* Replaces `visible-` and `hidden-`. Sets the css `display` property
* As with spacing without breakpoints specifies for xs and therefore all sizes
* With breakpoint specifies for that size and up
    - Hide on XL: `d-xl-none`
    - Show on LG only: `d-none d-lg-block d-xl-none`

