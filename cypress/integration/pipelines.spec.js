context('Pipeline Executions', () => {
  beforeEach(() => {
    cy.server({
      method: 'GET',
      delay: 50,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })

    cy.fixture('dataProviders').as('dataProviders').then(dataProviders => {
      cy.route(/\/dashboards\/.+/, dataProviders.dashboardDataProvider.singlePipeline)
    })
  })

  it('should display a message when there is no execution', () => {
    cy.route(/\/pipelines\/[^\/]+\/[^\/]+/, []).as('getExecutions')

    cy.visit('/')
    cy.wait('@getExecutions')

    cy.get('.no-execution-message').should('exist')
  })

  it('should display a single execution correctly', () => {
    cy.get('@dataProviders').then(dataProviders => {
      const executions = dataProviders.executionDataProvider.execution_1;
      const latest = executions[0];

      cy.route(/\/pipelines\/[^\/]+\/[^\/]+/, executions).as('getExecutions')
      cy.route(/\/pipelines\/[^\/]+\/[^\/]+\/executions\/[^\/]+/, latest).as('getExecutionDetail')

      cy.visit('/')
      cy.wait('@getExecutions')
      cy.wait('@getExecutionDetail')

      cy.get('.execution-history > a').should($a => {
        expect($a).to.have.length(1)
      })

      cy.get('.latest-execution').should('exist').within(() => {
        cy.get('[icon]').should('exist')
        cy.get('.execution-info .label').should('contain', '#')
        cy.get('.execution-info .reason').should('contain', latest.reason)
      })
    })
  })

  it('should correctly display all sub-components of a single pipeline execution', () => {
    cy.get('@dataProviders').then(dataProviders => {
      const executions = dataProviders.executionDataProvider.execution_1;
      const latest = executions[0];

      cy.route(/\/pipelines\/[^\/]+\/[^\/]+/, executions).as('getExecutions')
      cy.route(/\/pipelines\/[^\/]+\/[^\/]+\/executions\/[^\/]+/, latest).as('getExecutionDetail')

      cy.visit('/')
      cy.wait('@getExecutions')
      cy.wait('@getExecutionDetail')

      cy.get('.execution-history > a').should($a => {
        expect($a).to.have.length(1)
      })

      cy.get('.latest-execution').should('exist').within(() => {
        cy.get('[icon]').should('exist')
        cy.get('.execution-info .label').should('contain', '#')
        cy.get('.execution-info .reason').should('contain', latest.reason)
      })

      cy.get('.latest-execution .execution-info .reason').click()
      cy.get('.code-changes.show').should('exist').within(() => {
        cy.get('ul > li').should($li => {
          expect($li).to.have.length(2)
        })
      })

      cy.get('.latest-execution .execution-info .reason').click()
      cy.get('.code-changes.show').should('not.exist')
    })
  })
})
