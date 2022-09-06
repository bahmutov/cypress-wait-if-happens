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
