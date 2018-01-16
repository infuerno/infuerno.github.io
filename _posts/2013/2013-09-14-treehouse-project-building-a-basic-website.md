---
layout: post
tagline: Back to basics
---
W3C link to stylesheet possibilities: <http://www.w3.org/TR/CSS21/propidx.html>

Useful for checking HTML entities: <http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML>

Normalize: <http://necolas.github.io/normalize.css/>  
Remove certain default styling added by browsers use normalize.css.

gridulator.com: <http://www.gridulator.com/>

Typing lessons for coders: <http://typing.io/>  
Type some real open source code (whole modules) and get stats on your typing skills.

Fonts: <http://www.google.com/fonts/>  
Easily add custom fonts using google fonts.

## Semantic tags less commonly used
### Quotes
#### `<blockquote>`

{% highlight html %}
<blockquote cite="http://example.com/citation-source.html">
<p>multi-paragraph quote</p>
</blockquote>
{% endhighlight %}

#### `<q>`

For inline quotes the `<q>` tag can be used. It adds quotation marks around the text. The `cite` attribute can also be used with this element.

### Code and preformatted text
#### `<code>`

The code tag is used to mark up any code. This is printed using a mono space font by default.

#### `<pre>`

The pre tag is used to denote preformatted text, which preserves any formatting e.g. line breaks in your text.

The `<pre>` and `<code>` tags can be used together to enter multiple lines of code.

#### `<abbr>`

Use to mark up abbreviations. By default there is no visible style change.

{% highlight html %}
  <p>I know how to use <abbr title="self-contained underwater breathing apparatus">SCUBA</abbr></p>
{% endhighlight %}

The title will be shown on hover tool tip wise.

#### `<address>`

Used to denote contact details.

{% highlight html %}
  <address>
    Nick Pettit<br>
    1234 Example Road<br>
    Metropolis
  </address>
{% endhighlight %}

If the `<address>` tag comes as a direct child of the `<body>` element then this will be contact information for the whole page. To be marked as the contact information for just one person, this will need to be nested under the mark up for that person.

#### `<cite>`

`<cite>` can be used a tag by itself. The default styling is to italicise this text. This is used to mark up book, film titles etc.

#### `<wbr>`

Useful for marking where to break a long string in the case that there may or may not be enough space.

#### Definition lists

{% highlight html %}
  <dl>
    <dt>Video pros</dt>
    <dd>John</dd>
    <dt>Teachers</dt>
    <dd>Nick</dd>
    <dd>Jim</dd>
    <dd>Armit</dd>
  </dl>

  <dl>
    <dt lang="en-US">color</dt>
    <dt lang="en-GB">colour</dt>
    <dd>The sensation which derives from the ability to detect light.</dd>
  </dl>
{% endhighlight %}

