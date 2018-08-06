context('Pipeline Executions', () => {
  const dashboardConfig = {
    title: "Test Dashboard",
    description: "",
    columnConfigs: [{
      title: "Web App",
      widgetConfigs: [{
        title: "Branch master",
        type: "pipeline",
        provider: "bamboo",
        projectId: "IF-WK8"
      }]
    }]
  }

  beforeEach(() => {
    cy.server({
      method: 'GET',
      delay: 20,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })

    cy.route(/\/dashboards\/[^\/]+/, dashboardConfig)
  })

  it('should display a message when there is no execution', () => {
    cy.route(/\/pipelines\/.+\/[^\/]+/, []).as('getExecutions')

    cy.visit('/')
    cy.wait('@getExecutions')

    cy.get('.no-execution-message').should('exist')
  })

  it('should only display the latest execution when there is a single execution', () => {
    const executions = [
      {
        pipelineId: 'test-project',
        id: '77aae278-9d5a-480b-898e-c9191054416a',
        sequenceNumber: 1,
        status: "Succeeded",
      }
    ]

    const latest = {
      pipelineId: 'test-project',
      id: '77aae278-9d5a-480b-898e-c9191054416a',
      sequenceNumber: 1,
      status: "Succeeded",
      reason: "Changes by Mark",
      timeStarted: "5 mins ago"
    }

    cy.route(/\/pipelines\/\/[^\/]+\/[^\/]+/, executions).as('getExecutions')
    cy.route(/\/pipelines\/\/[^\/]+\/[^\/]+\/executions\/[^\/]+/, latest).as('getExecutionDetail')

    cy.visit('/')
    cy.wait('@getExecutions')
    cy.wait('@getExecutionDetail')

    cy.get('.latest-execution').should('exist')
    cy.get('.latest-execution [icon="check"]').should('exist')
    cy.get('.latest-execution .execution-info .reason').should('contain', latest.reason)
  })
})
