---
layout: post
title: Treehouse DD CSS Foundations
tagline: Getting up to speed with CSS3
---
Mozilla CSS reference: <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference>

## Stylesheet types

* user-agent stylesheets (built into the browser)
* user stylesheets
* author stylesheets

## Selectors
### Universal selector
The universal selector `*` is very powerful and can be used to select **all** elements. Useful for removing all margins and paddings from user-agent stylesheets.

### Type selectors
e.g. body, h1, table

### Descendant selectors
Only select elements which are decendants of other elements.

{% highlight css %}
h1 span { color: blue;}  
.base p { padding: 5px;}
{% endhighlight %}

### Class and ID selectors

Both a class and an ID can be applied to an element. IDs carry more specificity than classes, so styles defined in IDs will carry more weight than styles defined in classes.

### Combinators

Selectors can be combined using a combinator.

#### Direct child

`>` selects elements which are only direct children of the element on the left

{% highlight css %}
h1 > a { color: blue;}  
{% endhighlight %}

#### Adjacent sibling

`+` selects elements which are immediately adjacent to the element on the left

{% highlight css %}
h2 + p { font-size: 1.2em; } 
{% endhighlight %}

#### General sibling

`~` selects all sibling elements, not only those immediately adjacent, to the element on the left. **Note** it will select all elements which follow as long as they are siblings (i.e. on the same level) even if they are separated by other elements, but no elements which are before.

{% highlight css %}
h2 ~ p { font-size: 1.2em; } 
{% endhighlight %}

### Attribute selectors

Select all elements which have a certain attribute.

* `[class]` will select all elements with a `class` attribute (regardless of value)
* `a[class]` will select all `a` elements with a `class` attribute
* `a[class="foo"]` will select all `a` elements with a `class` attribute which has a value of `foo`. **Note** in this example this is much more work for the browser than simply using the `.foo` selector. A better example would be selecting all `input` values of type text, or all anchor tags which open in a new window.

Attribute selectors have the same specificity as classes and pseudo classes.

### Pseudo classes

* `a:link` selects anchor elements which have yet to be clicked on. It can only be used to target anchor elements with the href attribute.
* `a:visited` selects anchor elements which have already been visited.
* `a:hover` select anchor elements which are currently being hovered over. The `:hover` pseudo class can be applied to any element, not just anchors.
* `:active` pseudo class selects elements when they are "active", and can also be applied to any element, commonly applied to anchors.
* `:focus` only applies to interactive elements e.g. links and form elements and can be applied when this element has the focus. This helps show which is the element with the current focus when tabbing through the page.

#### Structural pseudo classes

* `li:first-child` selects only the first child li in a ul or ol.
* `li:last-child` conversely selects only the last child li in a ul or ol.
* `:only-child` selects elements which are the only children of their particular parent.
* `:nth-child(an + b)` selects the nth child of a parent element where b is the offset value, and a is the cycle multiple **after** the first element has been selected.

  * `odd` will select only odd elements, `even` will select only even elements
  * `3` will select only the 3rd element
  * `2n + 1` will select the 1st element (+ 1) followed by the 3rd element, 5th element etc
  * `3n` will select every 3rd element e.g. 3, 6, 9 etc
  * `-n+5` will select the 5th element, then 4th, 3rd, 2nd, 1st

* `:nth-last-child` is exactly the same, but starts from the bottom first

  * `-n+3` will here select the 3rd element from bottom, then the 2nd element from bottom and finally the last element i.e. the last 3 elements

* `:nth-of-type(an+b)` selects all sibling elements of the specified type
* `:nth-last-of-type(an+b)` is similar, but starts counting from the bottom
* `:only-of-type` selects elements if it is the only element of its type within its parent element

#### Additional pseudo classes
* `:root` will select the root element of the document (usually the html element). This may be useful since it has more specificity than the html element selector.
* `:target` can be used to style the target element of matching anchor. e.g. if `<a href="#s2">section 2</a>` targets a div with id s2, then when it is clicked, the string "#s2" is appended to the url and the browser uses this to style the element with matching id "#s2"
* `:empty` will select any empty elements. This may be useful for alerting the user to an empty result set, or an empty string
* `:not()` is the negation selector. e.g. `:not(:empty)` will select all elements which aren't empty; `:not([id="s1"])` will select all elements which don't have an id of "s1"

#### UI element states pseudo classes

* `:enabled` selects any form and input elements which are enabled e.g. `input[type="text"]:enabled`
* `:disabled` selects elements which are disabled
* `:checked` selects any form elements which are _checked_ e.g. check boxes and radio buttons. Radio button labels can be selected using a combination of this pseudo class with the adjacent sibling select e.g `input[type="radio"]:checked + label`. 

### Substring matching attribute selectors
#### Begins with ^=
* `a[href^="http://"]` selects any anchor elements with href attribute values beginning with "http://".
* `a[href^="mailto:]` selects all the anchor elements with email addresses.

#### Ends with $=
* `a[href$=".pdf"]` selects all anchor elements with an href attribute value ending with ".pdf".
* `a[href$=".doc"]` selects all anchor elements with an href attribute value ending with ".doc".

#### Contains
* `img[src*="thumb"]` selects all img elements with a src attribute value containing the string "thumb"

### Pseudo-elements

The difference between psuedo-elements and psuedo classes is that psuedo classes target actual elements, whereas psuedo-elements target virtual elements which don't always exist as elements.  
The two syntax variations `:first-letter` and `::first-letter` will both work, but the double colon is more common to distinguish that this is targeting a psuedo element.

* `::first-line` selects the first line
* `::first-letter` selects the first letter

Two further pseudo-elements allow inserting generated content.

* `::before` will insert the content before
* `::after` will insert the content after

Both require a `content` property which can specify the content to be inserted in a number of different ways: the actual content as a string; a url to an image; a reference to the content of an attribute on that element; or an empty string with extra css properties to e.g. draw a circle.

{% highlight css %}
.phone::before { content: "\2706"; /* common phone icon unicode */ }
.phone::before { content: url("img/phone.jpg"); }
.dload::before { content: attr(href); }
.dload::before { content: ""; height: 50px; width: 50px; display: inline-block; }
{% endhighlight %}

**Note** the generated contented is inserted into the actual element, rather than alongside.

## Values and units

### Absolute length units

Reference: <http://www.w3.org/TR/css3-values/#absolute-lengths>

These are only useful when the dimensions of the output are known e.g. cm when printing, px when viewing on a screen.

Unit | Description | Notes
---|---|---
cm | Centimeters | Not commonly intended for web design, highly dependent on output and varies greatly between different resolutions
mm | Millimeters | |
in | Inches | |
pc | Picas | Commonly used in print, not intended for web or screen design (1pc = 12pt = 1/6 inch)
pt | Points | Commonly used in print, not intended for web or screen design (1pt = 1/72 inch)
px | Pixels | 1px used to be 1/98 inch, but now pixel densities are changing, this changes too

An alternative method for pixels instead of relating physical units to physical measurements on a screen, the concept of a _reference pixel_ - an optically consistent reference unit.

Except for pixel units, all other absolute units tend to be avoided, except in cases when desigining for printing.

### Relative length units

Unit | Description | Notes
---|---|---
ex | The height of the current fonts lower case letter 'x' | Different fonts even with the same font size may have differently sized 'x's.
em | Relative to the font size of the parent element | The default font size is 16px, em is useful since it will resize according to the default font size chosen by the user. Nested elements get tricky.
rem | Root em, always relative to the root element |

### Viewport relative units

Size is based on the size of the viewport and is 1% of this size. Currently have less browser support. Check out <http://caniuse.com/viewport-units>

Unit | Description | Notes
---|---|---
vw | viewport width | Measured in 1% units of the width of the view port e.g. 15vw is 15% of the width
vh | viewport height | 1% units of the height of the view port
vmin | viewport width or height, whichever is the smaller | 1% units of the width or height
vmax | viewport width or height, whichever is the larger | 1% units of the width or height

### Numeric and text data values

* `auto` is the default value for certain properties e.g. height, z-index. Assigning this value will allow the browser to set this automatically. For example, when setting giving a block element a width and setting the margins to auto, the browser will make the left and right margins equal thereby centering the element on the page.
* `inherit` explicitly specifies that the value of the propery on an element should be the same as the parent element. W3C list all the elements which can take this value.
* `initial` resets the property value to its initial value had nothing been applied. Only supported by Chrome, Safari and Mozilla (with the -moz- prefix).
* units specifed using `%` are relative to the parent element

### Color values

* Keywords - Full keywords list on W3C at <http://www.w3.org/TR/css3-color/#svg-color>
* RGB e.g. rgb(255, 255, 255), rgba(255, 255, 255, 0) - full transparency, rgba(255, 255, 255, 0.9) - nearly opaque
* HSL - hue saturation lightness e.g. hsl(240, 70%, 55%). 
    * Hue is the angle in the colour wheel measured in degrees from 0 to 360
    * Saturation of 0% is grey, 100% is full colour
    * Lightness of 0% is black, 100% is white, 50% is normal
    * Alpha can also be added e.g. hsla(240, 70%, 55%, 0.7) 

## Text, Fonts and Lists

### Fonts

Reference: <http://www.w3.org/Style/Examples/007/fonts.en.html>

The generic fonts are `serif`, `sans-serif`, `monospace`, `cursive` and `fantasy`.
CSS properties for fonts are `font-family`, `font-weight`,  `font-variant` (small-caps), `font-style` (italic, oblique). These can all be expressed in one line:

{% highlight css %}
p {
    font: [font-style] [font-variant] [font-weight] font-size font-family;
}
{% endhighlight %}

#### White space

The `white-space` property is used to alter the display of whitespace.

* `nowrap` renders all text on one line
* `pre` preserves all whitespace in the markup
* `pre-line` renders the line breaks in the markup, but collapses multiple spaces
* `pre-wrap` preserves the whitespace in the markup, but will also wrap text if necessary

#### Shadows

{% highlight css %}
p {
    text-shadow: x-offset y-offset shadow-size colour;
}
{% endhighlight %}

Multiple shadows can be applied by seperating each shadow definition by a comma. The first one defined will be "on top".

#### Overflow

The `text-overflow` will determine the style if text is spilling outside of a container (e.g. due to `white-space: nowrap` style). Possible values are `hidden` and `ellipses`.

The `word-wrap` property can be set to `break-word` to ensure a long string wraps to be contained within one container.

#### List bullet styles

Reference: <https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type>

* `list-style-type` sets the type of bullet
* `list-style-position` places the bullet outside the list item by default, but can be change to inside
* `list-style-image` can be used to add custom images in place of the bullets. This doesn't give much control and it is more common to turn the bullets off and set the background-image on a list item instead. This way means the alignment of the image can be accurately controlled.

As with fonts, the `list-style` property can be used to define everything in one. Parts are optional and the order does not matter.

### Box model

Block level elements take up the full width available from the parent element, plus a new line before and after.

`border-width`, `border-style` and `border-color` properties can take up to four parameters to uniquely style each of the four sides of the element.

#### Negative margins

* Applied to the top or left will pull the element in that direction. 
* Applied on the bottom or right will pull any succeeding element into the main element.

#### Inline block

The value `inline-block` for the display property generates a box which is a block element flowed with surrounding content. **Note** negative top and bottom margins cannot be applied to inline-block elements

#### Width

The width property specifies the width of the content. To get the complete width used up by an element, the width, padding, border and margins need to be added together. 

The `box-sizing` property allows you to alter this behaviour if you give it the value border-box (-moz-box-sizing in mozilla)

#### Height

The height property will work depending on the height of the parent container. `min-height` and `max-height` can be used to control the height independently of the content. If the content is too big, it will flow outside of the container. This can be controlled with the `overflow` property to scroll the contents if desired.   

#### Floats

Clearing floated elements can be done in several ways. The most semantic is achieved using the following piece of css:

{% highlight css %}
.group:before,
.group:after {
  display: table;
  content: "";
}
.group:after {
  clear: both;
}
{% endhighlight %}

#### Positioning

* `static` is the default positioning.
* `relative` positioning allows you to add left and top offset - relavtive to its original position in the document
* `absolute` positioning removes an element from the document flow and will be placed according to the first parent element which doesn't have the default static positioning.

### Backgrounds

* When using images for the background, also set the background colour to a similar colour in the event the image can't be displayed.
* Background images are tiled by default. `background-repeat` can be used to change this. Options are `repeat`, `repeat-x`, `repeat-y`, `no-repeat`. Check out W3C for some extra values coming in soon.
* `background-position` positions a non tiling image in a container e.g. `bottom left`.
* `background-attachment` controls how the background image of an element is attached to the container. Possible values are scroll (default), fixed and local.

{% highlight css %}
background: [background-color] [background-image] [background-repeat] [background-attachment] [background-position]
{% endhighlight %}

### Border radius

The border radius will be applied if there is either a border **or** a background.
Negative units cannot be used.
Horizontal and vertical radius can be given seperately.
When using the `border-radius` shorthand to define all corners together, the horizontal and vertical radii can be expressed using a slash.

### Box shadows

{% highlight css %}
box-shadow: [inset] [horizontal-offset] [vertical-offset] [blur-radius] [spread-radius] [colour]
{% endhighlight %}

Multiple values can be specified using a comma to seperate them, the first is rendered on top.

### Border images

* `border-image-source` specifes the source for the border image
* `border-image-slice` does all kinds of wierd things and basically takes 4 parameters top-offset, right-offset, bottom-offset, left-offset which correspond to 4 lines drawn through the image. This can either be specifed in % or pixels (without the usual 'px').
For the top and bottom borders, the image shown is that **between** the right and left offsets, but either side of the top and bottom offsets.
* `border-image-repeat` determines if the middle image is stretched or repeated. The value `round` will attempt to repeat the image such that only whole images are used. It does this be resizing the image. The value `space` is similar to round, but achieves uniformity by instead adding space (currently poorly supported).
* `border-image-width` changes the width of the image making up the border. A unit without a measurement represents a multiple of the set border width. It can also be specified in 40px.
* `border-image-outset` can be used to displace the border outside of its box model, and push the border outwards. Like `border-image-width` either units to multiply the border width or px can be used.

{% highlight css %}
border-image: [source] [slice] / [width] [repeat] [outset];
{% endhighlight %}

**Note** always define fall back borders **before** the border-image definition.

Reference: <http://border-image.com>, <http://css-tricks.com/understanding-border-image/>

### Multiple background images

Multiple sets of values can be set for the `background` property to layer mulitple backgrounds or background images on top of each other.

* The `background-size` property can be similarily multi-valued to specify a size for each image. * The `background-size` can alternatively be added to the shorthand property using a `\` to seperate it from the `background-position` (though this has mixed support in browsers). 
* Two new keywords can be used to set the size according to the element size. `cover` does not respect aspect ratio, but the image will cover the whole area, whereas `contain` will respect the aspect ratio. Ensure to use `height: 100%;`.
* The background image may fall over the borders and this will be visible if there is any transparency in the border colour. To address this set the `background-clip` property to content-box or padding-box (default is border-box).
* `background-origin` does a similar thing

## Typography

### Legibility

Legible typefaces usually have many common features:

* Loose letter spacing
* Generous x-heights - the height of the main body of a lower case letter
* Similar cap heights - the height of the upper case letters
* Prominent ascenders and decenders
* Common counters - the fully or partially enclosed spaces in letter
* Open bowls - the curved strokes enclosing the letter's counters (e.g. 'p')
* Open apetures - the openings at the end of an open counter (e.g. 'h')
* Common serifs

Legibility can be lost if:

* The text is all caps - ascenders and decenders are not visible
* Too text is italicised too much - the space between the text is reduced
* Too much bold font weight - the bowls start to close up

Can the font do the job?

* Can it emphasis, italicise and quote things well?
* Is the font legible at small and large sizes, light and dark? 
* How do the numbers look? Old-style numbers use ascenders and decenders whereas 'lining' uses a uniform height for all numbers.
* Is the font free?
* If using two fonts, they will need to balance each other. It is common to use a san-serif for headings and a serif font for the body text.

### Readability

> If we give users a reason to stop reading, they will.

Line length is most comfortable at 45 to 75 characters to one line (this includes spaces and punctuation).

Line height should also be generous - no less that 150%. Browsers default line height is usually 1em which is too small to be readable. Many factors can affect line height - typeface design, font size, weight and case. Also the longer the line length, the greater the line height which generally is needed.

Text has a natural rhythum which is created when we read. Designers can create the typographic rhythm to break up the monotony of a page. Readability heavily depends on it. Adding images and different heading colours helps create rhythm.

Typographic colour of a page refers to the density or tone of text and will affect readability.

Chunking involves grouping related elements together e.g. a heading and a paragraph. Text needs white space to breathe and to emphasis the content.

Visual hierarchy is important in order to enable skimming through the page. A good example is <http://simplebits.com>.

Three common approaches to the page:

1. The traditional approach - uses a lot of centre and justification with text usually framed, in one or two columns. The text is meant to be contemplated, so is often decorated with text.
2. The modernist approach - clear cut margins and edges, many columns, aligned to a grid.
3. Post modernist - often breaks the rules, challenges the reader to make sense.


### Responsive text

Typographic scales are often used to ensure consistency in combining different font sizes. A common scale is 6 7 8 9 10 11 12 14 16 18 21 24 36 48 72.

Convert font sizes in pixels to ems remembering that 16px = 1em. 1rem can be used to reset the font to 16px for nested elements.

Set widths of container divs in percentages instead of pixels to maintain margins when the viewport width changes. Media queries can be used to alter the defaults when the width is very small or very large.

{% highlight css %}
@media screen and (max-width: 599px) {
    body { font-size: 1em; }
    .wrap { width: 85%; }
}
{% endhighlight %}

Line breaks in titles with changing viewport widths can be resolved by:
1. Making the font-size smaller and / or using additional media queries to introduce ever changing font-sizes.
2. Using the new vw font-size measurement (1/100th the width of the viewport) - not well supported currently and bug in chrome
3. Use fittext jquery plugin from <http://fittextjs.com>. Link to jquery and to the fittext library, then add some javascript to select the element (using jquery syntax) and calling the method fitText() on it.

### Vertical rhythm

This is the balance of spacing and arrangement of text as the user reads down the page. If each line of text fits consitently on evenly spaced baselines, then the page has a consistent vertical rhythm.

A useful tool to achieve this is availble from <http://baseline.it>. Just include a link to the stylesheet of the base line height in order to draw these lines behind the text on the page.

### Web fonts
Populate font services include:

* <http://typekit.com>
* <http://fontdeck.com>
* <http://fonts.com>
* <http://fontsquirrel.com>
* <http://theleagueofmovabletype.com>
* <http://www.google.com/webfonts>

The `@font-face` css directive allows you to link to downloaded fonts using the `font-family` and `src` attributes.

#### Common font formats

* .eot (embedded open-type) - propriertary format for ie
* .woff (web open font format) - developed by mozilla, supported by most browsers, very fast since data is compressed
* .ttf (true type format) - safari, android and ios
* .svg - open source, can be used for legacy version for ios

#### Font stack

If web fonts are missing certain glyphs, the font stack becomes especially important in filling in any gaps. This mechanism can also be exploited by only specifying a small subset of glyphs in the referenced font-face e.g. ampersand to be used in the web page.

#### Icon fonts

Icon fonts can significantly speed up performance for icons and will scale to any size without losing quality.

* <http://symbolset.com>
* <http://pictos.cc>
* <http://icomoon.io>

These are added in exactly the same way as fonts, using the appropriate unicode. The `-webkit-font-smoothing` property may be useful with the value `antialiased` to get anti aliasing.

#### Ligatures
Open type font features can now be better utilised in css. Ligatures are used to improve the appearance of text when letters are too close together, connecting certain letters when they are next to each other. 

{% highlight css %}
-webkit-font-feature-settings: "liga", "dlig"; 
{% endhighlight %}

`liga` denotes common ligatures, `dlig` denotes discretionary ligatures.

#### Further enhancements

* **Horizontal line rules** used subtly can enhance text and chunks of text.
* **Tracking** is the spacing between letters, adjusted using the `letter-spacing` property.
* **Orphans**, **widows** and **rags** can sometimes be controlled by adjusting font sizes and line lengths.
* **Rivers** are created when justifying text causes large gaps to appear between words.
* **Hanging punctuation** e.g. hanging quotes allow the text to stay aligned. This can be achieved using a negative text indent value. Hanging bullets could also be used.
* **Small caps** can be useful for rendering abbreviations which we don't want to be distracting e.g. PM in 12:30 PM
* &ldquo; and &rdquo; are the correct double quote entities
* &ndash; and &mdash; should be used instead of hyphens for specifying number ranges and a break in though respectively
* &hellip; renders the three dot ellipsis
* Explore the complete character set of each typeface

<http://www.impressivewebs.com/html-entity-reference-common/> has a list of common entities
<http://dev.w3.org/html5/html-author/charref> for a complete list

### CSS Gradients

Reference: <http://www.colorzilla.com/gradient-editor/>

There are two types of gradients, linear gradients and radial gradients.

#### Linear gradients - prefixed syntax

A linear gradient is created when two or more colours are defined along the **gradient line**. By default the gradient line is from top to bottom. This can be changed, by including the horizontal and or vertical starting position either using position keywords or in degrees. Degrees start on the left and go anti-clockwise.

{% highlight css %}
.box1 {
    background: -webkit-linear-gradient(bottom right, blue 100px, green);
}
.box2 {
    background: -webkit-linear-gradient(45deg, blue 50%, green);
}
{% endhighlight %}

Colour stops can be used to create more complex gradient effects, these require a colour component and optional position component. Positional components can be specified in percentages or pixels and specify where the colour stop should be shown at 100%.

#### Linear gradients - unprefixed syntax

* Directional keywords: use the `to` keyword with the directional keywords (thereby having to use the opposite keywords)
* Degrees: 0deg starts at the bottom and goes clockwise

{% highlight css %}
.box1 {
    background: -webkit-linear-gradient(270deg, blue 100px, green);
    background: -moz-linear-gradient(270deg, blue 100px, green);
    background: -p-linear-gradient(270deg, blue 100px, green);
    background: linear-gradient(180deg, blue 100px, green);
}
{% endhighlight %}

#### Radial gradients - prefixed syntax

Radial gradients start at the centre and radiate out based on the parameters specified. 

By default the shape is an ellipse and of the same proportions of the containing div. This can be changed to circular by adding the `circle` keyword (therefore not necessarily following the containing div's proportions). 

The centre of the gradient can be specified using two further parameters. If only one value is defined, the other value defaults to the centre. As with background images, the first parameter is from the left and the second from the top.

Further keywords can be defined to alter the gradient pattern. 

* closest-side
* closest-corner
* farthest-side
* farthest-corner (default value)

As with linear gradients, further colour stops can be added with optional position components. The position component can be specified in percentages, pixels or em units and is measured from the centre of the radial gradient.

    <position>, <shape> <size> followed by the colour stops

#### Radial gradients - unprefixed syntax

    <shape> <size> at <position> followed by the colour stops

#### Transparent gradients

The `transparent` keyword can be used instead of a colour. This is actually just rgba(0,0,0,0). Better results may be achieved using an rgba colour of white with full transparency i.e. rgba(255,255,255,0).

If using a gradent for the background of the whole page, specify a height of 100% for the html element.

#### Repeating gradients

By using pixels in the colour stops this gives a repeating gradient pattern.
`repeating-linear-gradient` and `repeating-radial-gradient` are the unprefixed versions.

The pattern repeats based on the difference between the first and last colour stop values.

Repeating gradients with smoother colour gradients can be created by making the last colour the same as the first.

### Flexbox and Multi-column layout

New positioning system, consisting of a flex container and flex items. Flexbox defines how the flex items are laid out inside the flex container. The flex container can have multiple flex lines. By default these go left to right and top to bottom.

Axis
: Flexbox has the concept of the **main axis** (default is left to right) and the **cross axis** (default is top to bottom).

#### Flex direction

{% highlight css %}
.nav {
    display: -webkit-flex;                      // specify to use the flex layout mode
    -webkit-flex-direction: column-reverse;     // arrange items in a column (default is row)
    -webkit-justify-content: space-between;     // evenly distribute items
    -webkit-justify-content: flex-end;          // push items to the 'end'
    -webkit-justify-content: center;            // centre the items
}
{% endhighlight %}

Changing the margins around flex items, especially using auto, changes how the items are distributed in the container.

#### Wrapping

By default the items do not wrap, but spill out of the container. This behaviour can be changed with the property `-webkit-flex-wrap` and the attribute `wrap`.

#### Growing

To control how the items grow relative to the container and each other use the `-webkit-flex-grow` property. A value of `1` will ensure the free space is evenly distributed. The `-webkit-flex` property can also be used to specify ratio of space each item should take up. The `-webkit-order` property can be used to change the order, e.g. set it to -1 to move a particular item to the front of the other items. `-webkit-align-self` can take values such as `center`, `flex-end` to align individual items in a container (default is `stretch`).

Media queries can be used to ensure items do not become too small as the browser viewport is decreased, or alternatively to change the flow direction from row to column.

To use with browsers which don't yet support flex box, the modernizr javascript can be used to provide a fall back solution.

#### Multi-column layout

-webkit-column-count
: splits content into a specified number of columns

-webkit-column-gap
: used to specify the width of the gap between columns

-webkit-column-rule
: used to specify any rule to be drawn between columns. As with a border, there are three attributes which can be specified: width, style, colour.

-webkit-column-width
: used to specify a max width for the columns and useful in responsive design.

-webkit-columns
: used to combine the width and the count e.g. `-webkit-columns: 250px 3;`

Images can be rendered as well as text. Useful markup to have the image display and resize nicely:

{% highlight css %}
img {
    display: block;
    width: 100%;
    margin: 1.5em 0;
}
{% endhighlight %}

-webkit-column-span
: an attribute of `all` will allow an element to span all columns

