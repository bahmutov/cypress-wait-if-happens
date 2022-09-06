function makeAppRequest(timeout, limit = 3) {
  if (typeof timeout !== 'number') {
    throw new Error('Expect a timeout in milliseconds')
  }
  // @ts-ignore
  const win = cy.state('window')
  if (!win) {
    throw new Error('Could not get app window')
  }
  setTimeout(() => {
    win.fetch(`https://jsonplaceholder.cypress.io/users?_limit=${limit}`)
  }, timeout)
}

Cypress.Commands.add('makeAppRequest', makeAppRequest)
