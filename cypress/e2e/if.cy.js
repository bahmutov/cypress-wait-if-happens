/// <reference path="../../src/index.d.ts" />
import 'cypress-if'
import '../../src'
import './utils'

beforeEach(() => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
})

describe('waitIfHappens', () => {
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

    it('prints the number of users', () => {
      cy.get('h1')
        .should('be.visible')
        // comment out to see the ".if()" skip
        // the rest of the commands
        .makeAppRequest(500, 5)
      cy.waitIfHappens({
        alias: '@users',
        timeout: 2000,
        yieldResponseBody: true,
      })
        .if()
        .its('length')
        .then((n) => {
          cy.log(`got ${n} users`)
        })
    })
  })
})
