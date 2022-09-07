import { Interception } from 'cypress/types/net-stubbing'

/**
 * Options for the cy.waitIfHappens commands
 */
interface WaitIfHappensOptions {
  alias: string
  timeout?: number
  lastCall?: boolean
  yieldResponseBody?: boolean
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Waits up to the timeout (ms) for the given network intercept to happen.
       * If the call never happens, yields undefined.
       * @example cy.waitIfHappens('@loads', 1000)
       * @see https://github.com/bahmutov/cypress-wait-if-happens
       */
      waitIfHappens(
        alias: string,
        timeout?: number,
      ): Chainable<Interception | undefined>
      /**
       * Waits up to the timeout (ms) for the given network intercept to happen,
       * can yield the last call for the current calls, and yield the response body.
       * If the call never happens, yields undefined
       * @see https://github.com/bahmutov/cypress-wait-if-happens
       */
      waitIfHappens(
        options: WaitIfHappensOptions,
      ): Chainable<Interception | undefined>
    }
  }
}
