# jQuery Sail

An other pjax-like library.  
Give your visitors a smooth ajaxified browsing experience !

* [Version Française](README_fr.md)
* [日本語版](README_ja.md)

# Table of Contents

* [API](#api)
  * [Core](#core)
    * [area](#area)
    * [aria](#aria)
    * [head](#head)
  * [Callbacks](#callbacks)



# API

## Core

### area

Type: Array of Strings / Default: [ '#sail' ]  
List of nodes to be updated. In order to preserve the order, you need to give an array of string (nodes selector), not a jQuery object or a dom object.

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area: [ '#main' ] // ok recommended
  /*
    area: [ '#main', '#side' ]  // Updating #main then #side
    area: [ '#side', '#main' ]  // Updating #side then #main
    area: $( '#main' ) // Might work
    area: $( '#main, #side' ) // Might work, order as in the dom
    area: '#main' // Not ok, fix in late future
    area: document.getElementById( 'main' ) // Not ok
    area: document.getElementsByClassName( 'section' ) // Not ok
  */
});</code></pre>

* <a href="https://get.phutu.red/alpha/jquery/demos/sail/basic1/" target="_blank">Demo 1 with one area</a>
* <a href="https://get.phutu.red/alpha/jquery/demos/sail/basic2/" target="_blank">Demo 2 with two areas</a>

### aria

Type: Boolean / Default: true  
Add an aria-like live notification.

### Function_ callback

Global callback executed just after the ajax request succeeds.  
It won't be triggered in case of error or complete status.  
By default Google Analytics pageview is triggered when available.

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false // Disable
 /* Default callback looks something like this
    callback: function() {
        if ( _w.ga ) {
            _w.ga( 'send', 'pageview', _w.location.pathname + _w.location.search );
        }
    }
  */
});</code></pre>

### _String_ link, _Function_ Filter

Decide which page should be loaded.  
You can set which element should be checked with the _link_ parameter. Default
is 'a' (any link tag). You can pass any jQuery selectors.  
Then you can include or exclude items with the _filter_ parameter. Default
is a tiny preset to exclude anchors, links from other domains or links
opening in new window. It is just a function with a couple of conditions
returning a boolean. The function is executed when the user clicked something
on the page

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false // Disable
  , link:     'a[href^="http://www.foo.com"]' // Custom
  , filter:   false // Disable
});</code></pre>

### head @type String 

~~~javascript
head: 'title, keyword, description, og, twitter, canonical, prev, next, alternate'
~~~

Tag inside the html header to be updated.  
Any **explicit** jQuery selectors accepted. By default are

* title tag
* keywords and description
* og:*** tags
* twitter:***  tags
* itemprop tags
* canonical, prev, next and alternate _link_ tags

Except _title_, you need to explicitly write your selectors like 

~~~javascript
head: "title, meta[http-equiv='foo']"
~~~

If the selector does not contain brackets ( "[" or "]" )  for exemple

~~~javascript
head: "title, foo"
~~~

The plugin will automatically look for the following patterns:

* title
* meta[name^='foo']
* meta[property^='foo']
* meta[foo]
* link[rel='foo']
* link[foo]

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false // Disable
  , link:     'a[href^="http://www.foo.com"]' // Custom
  , filter:   false // Disable
  , head:     'title' // Title only
});</code></pre>

### _Object_ ajax

Default ajax settings. You can set some settings like _timeout_ or _cache_.
