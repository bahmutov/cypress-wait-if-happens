/// <reference path="../../../src/index.d.ts" />
import '../../../src'
import '../../../cypress/e2e/utils'

beforeEach(() => {
  cy.visit('index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
})

describe('waitIfHappens', () => {
  it('after the call with assertions', () => {
    cy.get('h1').should('be.visible').makeAppRequest(1000).wait(1100)
    cy.waitIfHappens('@users').its('response.body').should('have.length', 3)
  })

  it('accepts options object', () => {
    cy.get('h1').should('be.visible').makeAppRequest(1000)
    cy.waitIfHappens({ alias: '@users', timeout: 1100 })
      .its('response.body')
      .should('have.length', 3)
  })

  it('yields the response body', () => {
    cy.get('h1').should('be.visible').makeAppRequest(1000)
    // you can only yield the response body using the options object
    cy.waitIfHappens({
      alias: '@users',
      timeout: 1500,
      yieldResponseBody: true,
    })
      // no need to have .its("response.body") chained command
      .should('have.length', 3)
  })

  it('yields undefined as the response body', () => {
    cy.get('h1').should('be.visible')
    // the call never happens, but the user wants the response body
    cy.waitIfHappens({
      alias: '@users',
      timeout: 1100,
      yieldResponseBody: true,
    }).should('be.undefined')
  })

  it('yields the last intercepted call', () => {
    cy.get('h1')
      .should('be.visible')
      .makeAppRequest(100, 1)
      .makeAppRequest(200, 2)
      .makeAppRequest(300, 3)
      .makeAppRequest(400, 4)
      .wait(1000)
    // so now 4 network calls have happened
    // you can only yield the last intercepted call using the options object
    cy.waitIfHappens({
      alias: '@users',
      timeout: 100,
      lastCall: true,
      yieldResponseBody: true,
    })
      // we should get the list with 4 users
      // because that is the last call that happens
      .should('have.length', 4)
  })

  it('before the call with assertions', () => {
    cy.get('h1').should('be.visible').makeAppRequest(1000)
    cy.waitIfHappens('@users').its('response.body').should('have.length', 3)
  })

  it('the call never happens', () => {
    cy.get('h1').should('be.visible')
    cy.waitIfHappens('@users', 1000)
  })
})
