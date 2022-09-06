import { Interception } from 'cypress/types/net-stubbing'

interface WaitIfHappensOptions {
  alias: string
  timeout?: number
  lastCall?: boolean
  yieldResponseBody?: boolean
}

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
    /**
     * Waits up to the timeout (ms) for the given network intercept to happen,
     * can yield the last call for the current calls, and yield the response body.
     * If the call never happens, yields undefined
     */
    waitIfHappens(
      options: WaitIfHappensOptions,
    ): Chainable<Interception | undefined>
  }
}
