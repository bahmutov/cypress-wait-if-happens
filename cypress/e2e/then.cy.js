/// <reference path="../../src/index.d.ts" />
import '../../src'
import './utils'

beforeEach(() => {
  cy.visit('cypress/index.html')
  cy.intercept({
    pathname: '/users',
  }).as('users')
})

describe('waitIfHappens', () => {
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
})
