import './utils'

beforeEach(() => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
})

describe('cy.wait', () => {
  it('waits for the intercept that happens', () => {
    cy.get('h1').should('be.visible').makeAppRequest(1000)
    cy.wait('@users').its('response.body').should('have.length', 3)
  })

  // SKIP: only showing a failing test that fails
  // when the app never makes the request the test waits for
  it.skip('waits for the intercept that does not happen', () => {
    cy.get('h1').should('be.visible') // .makeAppRequest(1000)
    cy.wait('@users').its('response.body').should('have.length', 3)
  })

  it('waits using wait alias.all', () => {
    cy.get('h1').should('be.visible').makeAppRequest(1000)
    cy.get('@users.all').then(console.log).wait(1100)
    // get alias.all does NOT retry
    cy.get('@users.all').should('have.length', 1).then(console.log).wait(100)
    // each intercept has "requestWaited: false, responseWaited: false"
    cy.wait('@users').its('response.body').should('have.length', 3)
    // once we wait, the intercept sets "requestWaited: true, responseWaited: true"
    cy.get('@users.all').should('have.length', 1).then(console.log)
  })
})
