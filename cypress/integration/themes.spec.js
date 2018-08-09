context('Themes', () => {
  beforeEach(() => {
    cy.server({
      method: 'GET',
      delay: 20,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })

    cy.fixture('dataProviders').then(dataProviders => {
      cy.route(/\/dashboards\/.+/, dataProviders.dashboardDataProvider.multipleColumns)
      cy.route(/\/pipelines\/.+/, [])
    })

    cy.visit('/')
  })

  it('should use the light theme by default', () => {
    cy.get('body')
      .should('not.have.class', 'bg-dark')
      .should('not.have.class', 'text-light')
  })

  it('should be able to use the dark theme', () => {
    cy.get('.dashboard #dropdownMenuButton').click({
      force: true
    }).get('#theme-toggler').click()

    cy.get('body')
      .should('have.class', 'bg-dark')
      .should('have.class', 'text-light')
  })

  it('should be able to change back to the light theme after switching to the dark theme', () => {
    cy.toggleTheme()

    cy.get('body')
      .should('have.class', 'bg-dark')
      .should('have.class', 'text-light')

    cy.toggleTheme()

    cy.get('body')
      .should('not.have.class', 'bg-dark')
      .should('not.have.class', 'text-light')
  })
})
