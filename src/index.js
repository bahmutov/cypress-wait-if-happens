Cypress.Commands.add('waitIfHappens', (_alias, _timeout) => {
  let alias
  let timeout

  if (typeof _alias === 'object') {
    // the user passed options object
    alias = _alias.alias
    timeout = _alias.timeout
  } else {
    alias = _alias
    timeout = _timeout
  }

  expect(alias, 'alias to wait for').to.be.a('string')
  if (!alias.startsWith('@')) {
    alias = '@' + alias
  }
  if (!timeout) {
    timeout = Cypress.config('defaultCommandTimeout')
  }
  // console.log('waitIfHappens %o', { alias, timeout })
  const started = +new Date()

  const waitRecursive = () => {
    const now = +new Date()
    const elapsed = now - started
    if (elapsed > timeout) {
      cy.log(`🔥 **${alias}** never happened even after waiting ${elapsed}ms`)
      // yield undefined to the next command
      return cy.wrap(undefined, { log: false })
    }
    return cy.get(alias + '.all').then((intercepts) => {
      const newIntercept = Cypress._.find(intercepts, {
        requestWaited: false,
        responseWaited: false,
      })
      if (newIntercept) {
        // console.log(newIntercept)
        cy.log(`**${alias}** happened after ${elapsed}ms`)
        return cy.wait(alias)
      }
      return cy.wait(100, { log: false }).then(waitRecursive)
    })
  }

  return waitRecursive()
})
