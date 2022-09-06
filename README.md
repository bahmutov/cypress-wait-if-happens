# cypress-wait-if-happens ![cypress version](https://img.shields.io/badge/cypress-10.7.0-brightgreen) [![ci](https://github.com/bahmutov/cypress-wait-if-happens/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bahmutov/cypress-wait-if-happens/actions/workflows/ci.yml)

> A better `cy.wait` command

## DO NOT USE YET

- if the request happens, yields the intercept
- if the request does not happen within the timeout, yields `undefined`
- can yield the response body via the option `yieldResponseBody: true`
- can yield the last intercept via the option `lastCall: true`
- includes types in [src/index.d.ts](./src/index.d.ts)

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

Good to use in combination with the [cypress-if](https://github.com/bahmutov/cypress-if) plugin.

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
