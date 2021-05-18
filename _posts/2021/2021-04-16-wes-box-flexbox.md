---
layout: post
title: "Wes Bos: Flexbox"
---

## Flex direction

* `display: flex` makes the element a flex container. Child items automatically become flex items without extra markup
* `display: inline-flex` similar
* `flex-direction: row` **(default)** - main axis is from LEFT to right, cross axis is from TOP to BOTTOM. Flex items stack across the page horizontally
* `flex-direction: column` swaps the main and cross axis. Item now stack from Top to BOTTOM

## Wrapping

* `flex-wrap: nowrap` **(default)** - items do not wrap and fit themselves into the width or height available
* `flex-wrap: wrap` items wrap when not enough space remaining (white space may be left)

## Order

* `order: 0` **(default)** - set on a child item
* `order: 1` applied to a child item orders this after other items if all others still at the default 0
* can use negative indexes

## Alignment and centering
### justify-content

Affects the main axis (LEFT to RIGHT with default `flex-direction: row`).

* `justify-content: flex-start` **(default)** - content is left justified
* `justify-content: flex-end` right justified
* `justify-content: center` centered
* `justify-content: space-between` spread from left to right with gaps between elements
* `justify-content: space-around` spread the space not only between but also around the items e.g. on the left AND right of all items if the main axis is LEFT to RIGHT

### align-items

Affects the cross axis, so if using the default direction of row, this will be from TOP to BOTTOM. Will therefore need height specified for this to work (e.g. `height: 100vh`).

* `align-items: stretch` **(default)**
* `align-items: center` returns items to their natural height and centres them on the cross axis (also `flex-start` and `flex-end`)
* `align-item: baseline` if items are different heights, ensures the text within all items aligns at the base (SUPER USEFUL)

### align-content

Affects the cross axis, and specifies where any extra space should go. Therefore, only has an effect IF there are multiple rows (so probably need to set `wrap`).

This can be confusing, but align-content determines the spacing between lines, while align-items determines how the items as a whole are aligned within the container. When there is only one line, align-content has no effect.

* `align-content: stretch` **(default)**
* `align-content: flex-start` all items are returned to their natural height and at the top
* etc

### align-self

Exactly like `align-item` but applied on an item so you can override the container's `align-items` value.

## Flexbox sizing with `flex`

What do I do with any extra space? What do I do when I don't have enough space?
At what proportion should I scale myself up or down when I have extra space or not enough space.

* `.box {flex: 1;}` make everything the same width
* `.box2 {flex: 2;}` give this box twice as much space as everything else

`flex` combines the following properties: 
* `flex-grow` (what to do with extra space) - default is 0
* `flex-shrink` (what to do when not enough space) - default is 1
* `flex-basis` (what is the default ideal size e.g. 400px) - default is 0px

Fully specified this then becomes:
* `flex: 1 1 400px`

When wrapping, `flex-basis`, `flex-grow` and `flex-shrink` only apply to elements in the same row.

## Autoprefixer

Follow instructions on npm Autoprefixer page for JavaScript and Gulp.

## Useful tricks

### Select all flex items

```css
.flex-container > * {
  flex: 1 1 100%;
}
```
