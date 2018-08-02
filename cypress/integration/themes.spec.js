context('Themes', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should use the light theme by default', () => {
    cy.get('body')
      .should('not.have.class', 'bg-dark')
      .should('not.have.class', 'text-light')
  })

  it('should be able to use the dark theme', () => {
    cy.get('.dashboard .actions #theme-toggler').then($e => {
      $e.click();
    })

    cy.get('body')
      .should('have.class', 'bg-dark')
      .should('have.class', 'text-light')
  })
})
