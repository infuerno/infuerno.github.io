---
layout: post
title: "Frontend Masters Workshop: Introduction to d3.js, v2"
---

## Resources

- Video: https://frontendmasters.com/workshops/d3-js-v2/#player
- Observable workbook: https://observablehq.com/@sxywu/introduction-to-svg-and-d3-js
- Shirley Wu: https://sxywu.com
- Film flowers: https://sxywu.com/filmflowers/
- Chartfleau: https://www.chartfleau.com

Two technologies for drawing on the screen:

- SVG

  - XML syntax, similar to HTML
  - Each element is a DOM element which can have style, attributes set etc
  - Problems with more than 1000 elements

- Canvas
  - One element in the DOM
  - Draw shapes with JavaScript API
  - Stores images as rows of pixels, so good performance BUT can't reference individual elements after being drawn

`console.dir($0)` displays the element which is highlighed under in the source under the "Elements" section

`.data` > `.enter` > `.append`

- D3.js = Data Driven Documents
- Let the data drive what is created in the document
- So bind the data, create placeholders and then append to the DOM
- data MUST be an array
- whatever is `select`ed MUST match whatever is `append`ed e.g. if selecting by class `.bar` then can use `classed('bar', true) to add this class to all appended elements.

```javascript
selection.selectAll(".bar").data(data).enter().append("rect").classed("bar", true);
```

### Responsive container

1. bind an event listener to a window.resize event
2. container will have a width and height Defined
3. in the resize callback set the width and height
4. set the width and height to the svg
