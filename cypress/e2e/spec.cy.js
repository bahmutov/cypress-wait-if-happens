/// <reference path="../../src/index.d.ts" />
import 'cypress-if'
import '../../src'

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
      timeout: 1100,
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

  describe('in combination with cy.then', () => {
    it('the call happens and yields the intercept', () => {
      cy.get('h1').should('be.visible').makeAppRequest(500)
      cy.waitIfHappens('@users', 1000).then((intercept) => {
        expect(intercept, 'got the intercept').to.not.be.undefined
        expect(intercept.response.body).to.have.length(3, 'three users')
      })
    })

    it('the call never happens', () => {
      cy.get('h1').should('be.visible')
      cy.waitIfHappens('@users', 1000).then((users) => {
        expect(users, 'no users intercepted').to.be.undefined
        cy.log('no call')
      })
    })
  })

  describe('in combination with cypress-if', () => {
    it('the call happens', () => {
      cy.get('h1').should('be.visible').makeAppRequest(500)
      cy.waitIfHappens('@users', 1000)
        .if()
        .log('call has happened')
        .else()
        .log('no call')
    })

    it('the call happens and yields the intercept', () => {
      cy.get('h1').should('be.visible').makeAppRequest(1500)
      cy.waitIfHappens('@users', 2000)
        .if()
        .its('response.body')
        .should('have.length', 3)
        .else()
        .log('no call')
    })

    it('the call never happens', () => {
      cy.get('h1').should('be.visible')
      cy.waitIfHappens('@users', 1000)
        .if()
        .log('call has happened')
        .else()
        .log('no call')
    })
  })
})
