function makeAppRequest(timeout) {
  if (typeof timeout !== 'number') {
    throw new Error('Expect a timeout in milliseconds')
  }
  const win = cy.state('window')
  if (!win) {
    throw new Error('Could not get app window')
  }
  setTimeout(() => {
    win.fetch('https://jsonplaceholder.cypress.io/users?_limit=3')
  }, timeout)
}

Cypress.Commands.add('makeAppRequest', makeAppRequest)

it('waits for the intercept that happens', () => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
  cy.get('h1').should('be.visible').makeAppRequest(1000)
  cy.wait('@users').its('response.body').should('have.length', 3)
})

// SKIP: only showing a failing test that fails
// when the app never makes the request the test waits for
it.skip('waits for the intercept that does not happen', () => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
  cy.get('h1').should('be.visible') // .makeAppRequest(1000)
  cy.wait('@users').its('response.body').should('have.length', 3)
})

it('waits using wait alias.all', () => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
  cy.get('h1').should('be.visible').makeAppRequest(1000)
  cy.get('@users.all').then(console.log).wait(1100)
  // get alias.all does NOT retry
  cy.get('@users.all').should('have.length', 1).then(console.log).wait(100)
  // each intercept has "requestWaited: false, responseWaited: false"
  cy.wait('@users').its('response.body').should('have.length', 3)
  // once we wait, the intercept sets "requestWaited: true, responseWaited: true"
  cy.get('@users.all').should('have.length', 1).then(console.log)
})

Cypress.Commands.add('waitIfHappens', (alias, timeout) => {
  expect(alias, 'alias to wait for').to.be.a('string')
  if (!alias.startsWith('@')) {
    alias = '@' + alias
  }
  if (!timeout) {
    timeout = Cypress.config('defaultCommandTimeout')
  }
  console.log('waitIfHappens %o', { alias, timeout })
  const started = +new Date()

  const waitRecursive = () => {
    const now = +new Date()
    if (now > started + timeout) {
      cy.log(`${alias} never happened even after waiting ${timeout}ms`)
      // yield undefined to the next command
      return cy.wrap(undefined, { log: false })
    }
    return cy.get(alias + '.all').then((intercepts) => {
      const newIntercept = Cypress._.find(intercepts, {
        requestWaited: false,
        responseWaited: false,
      })
      if (newIntercept) {
        console.log(newIntercept)
        return cy.wait(alias)
      }
      return cy.wait(100, { log: false }).then(waitRecursive)
    })
  }

  return waitRecursive()
})

it('waitIfHappens after the call with assertions', () => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
  cy.get('h1').should('be.visible').makeAppRequest(1000).wait(1100)
  cy.waitIfHappens('@users').its('response.body').should('have.length', 3)
})

it('waitIfHappens before the call with assertions', () => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
  cy.get('h1').should('be.visible').makeAppRequest(1000)
  cy.waitIfHappens('@users').its('response.body').should('have.length', 3)
})

it('waitIfHappens the call never happens', () => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
  cy.get('h1').should('be.visible')
  cy.waitIfHappens('@users', 1000)
})
