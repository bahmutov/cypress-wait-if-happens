# cypress-wait-if-happens ![cypress version](https://img.shields.io/badge/cypress-10.7.0-brightgreen) [![ci](https://github.com/bahmutov/cypress-wait-if-happens/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bahmutov/cypress-wait-if-happens/actions/workflows/ci.yml)

> A better `cy.wait` command

## DO NOT USE YET

- if the request happens, yields the intercept
- if the request does not happen within the timeout, yields `undefined`
- can yield the response body via an option `yieldResponseBody: true`
- can yield the last intercept via an option `lastCall: true`

Good to use in combination with the [cypress-if](https://github.com/bahmutov/cypress-if) plugin.
