### Layout Component
[![Build Status](https://travis-ci.org/atmajs/compo-layout.png?branch=master)](https://travis-ci.org/atmajs/compo-layout)
[![Bower version](https://badge.fury.io/bo/compo-layout.svg)](http://badge.fury.io/bo/compo-layout)


- Create layouts with ease.
- Center content.
- Use flexboxes with fallbacks.


#### Rows and Columns

We use several techniques for creating rows or columns in a container:

- **absolute**
	
	Absolute positioning
	
- **fluid**

	For columns `inline-block` is used and for rows `paddings` and negative `margins` are used, e.g. for the cases like: header, content, footer.
	
- **flex**

	Flexbox model is applied. And the `fluid` fallback is used for the browsers, which do not support this. 


##### Rows 

Examples:

```scss
l:rows:absolute (50px, flex, auto) {
	div { /*50px height*/ }
	div { /*flexible height (all available space)*/ }
	div { /*height of the content*/}
}
l:rows:fluid (100px, flex, flex) {
	div { }
	div { }
	div { }
}
l:rows:flex (50px, flex, flex, auto) {
	div { }
	div { }
	div { }
	div { }
}
```

#### Columns
Examples:

```scss
l:cols:absolute (50px, flex, auto) {
	div { /*50px width*/ }
	div { /*flexible width*/ }
	div { /*width of the content*/}
}
l:cols:fluid (100px, flex, flex) {
	div { }
	div { }
	div { }
}
l:cols:flex (50px, flex, auto) {
	div { }
	div { }
	div { }
}
```

### Center
Vertical AND Horizontal centering of the content. 
```scss
l:center {
	/*.. content ..*/
}
```

### Examples

- [/examples](/examples)

```bash
# install atma toolkit
npm install atma -g
# run server
atma server

# navigate `http://localhost:5777/examples/EXAMPLE_NAME.html`
```

### Test
```bash
npm test
```

:copyright: MIT - Atma.js Project