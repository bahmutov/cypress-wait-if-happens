# cypress-wait-if-happens ![cypress version](https://img.shields.io/badge/cypress-10.10.0-brightgreen) [![ci](https://github.com/bahmutov/cypress-wait-if-happens/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bahmutov/cypress-wait-if-happens/actions/workflows/ci.yml)

> A better `cy.wait` command

- 🎓 Covered in my [Cypress Network Testing Exercises course](https://cypress.tips/courses/network-testing)

- if the request happens, yields the intercept
- if the request does not happen within the timeout, yields `undefined`
- can yield the response body via the option `yieldResponseBody: true`
- can yield the last intercept via the option `lastCall: true`
- includes types in [src/index.d.ts](./src/index.d.ts)
- good to use in combination with the [cypress-if](https://github.com/bahmutov/cypress-if) plugin

```js
import 'cypress-wait-if-happens'
cy.waitIfHappens({
  alias: '@users',
  timeout: 100,
  lastCall: true,
  yieldResponseBody: true,
})
  // we should get the list with 4 users
  // because that is the last call that happens
  .should('have.length', 4)
```

## Install

Add this plugin as a dev dependency to your project

```bash
# if using NPM
$ npm i -D cypress-wait-if-happens
# if using Yarn
$ yarn add -D cypress-wait-if-happens
```

## Use

Import the plugin in your spec or support file

```js
import 'cypress-wait-if-happens'
```

### Wait for a network call

```js
// timeout is in milliseconds
// by default timeout is the current default command timeout
cy.waitIfHappens(alias, timeout)
```

The above command does NOT fail if the network call is not made within `timeout` ms. You can yield the intercept or `undefined` to the next command

```js
cy.waitIfHappens(alias, timeout).then((intercept) => {
  if (!intercept) {
    // the call has not happened
  } else {
    // the intercepted call, same as
    // the value yielded by cy.wait(alias)
  }
})
```

### Options object

```js
cy.waitIfHappens(alias, timeout)
// equivalent to using an options object
cy.waitIfHappens({ alias, timeout })
```

### Yield the response body

**Note:** requires using the options object

Because yielding the response body is so common, you can yield it (if the network call happens)

```js
cy.waitIfHappens({
  alias,
  timeout,
  yieldResponseBody: true,
}).then((body) => {
  if (body) {
    // there was a network call
    // and we intercepted it
  } else {
    // no network call made
  }
})
```

### Yield the last call

**Note:** requires using the options object

The command `cy.wait` takes each network call one by one. If you are not sure how many calls there are, it is hard to say how many times to call `cy.wait`. In this plugin, you can take all current calls that have happened and yield the last one

```js
cy.waitIfHappens({
  alias,
  timeout,
  lastCall: true,
}).then((intercept) => {
  if (intercept) {
    // we waited until a call was made
    // or if there were already multiple calls
    // we get the last intercept object
  } else {
    // no matching network call made at all
  }
})
```

Waiting for the last call automatically waits for all of them by calling `cy.wait` repeatedly. If there are no calls made yet, waits up to the `timeout` period.

## Using with cypress-if

This plugin works great in combination with the [cypress-if](https://github.com/bahmutov/cypress-if) plugin. See more examples in [if.cy.js](./cypress/e2e/if.cy.js)

```js
cy.waitIfHappens({
  alias: '@users',
  timeout: 2000,
  yieldResponseBody: true,
})
  .if()
  .its('length')
  .then((n) => {
    cy.log(`got ${n} users`)
  })
```

Tested with Cypress v10 and v9

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cypress-wait-if-happens/issues) on Github

## MIT License

Copyright (c) 2022 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
