import { Interception } from 'cypress/types/net-stubbing'

declare namespace Cypress {
  interface Chainable {
    /**
     * Waits up to the timeout (ms) for the given network intercept to happen.
     * If the call never happens, yields undefined
     */
    waitIfHappens(
      alias: string,
      timeout?: number,
    ): Chainable<Interception | undefined>
  }
}
