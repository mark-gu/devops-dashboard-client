context('Build Results', () => {
  const dashboardConfig = {
    title: "Test Dashboard",
    description: "",
    columnConfigs: [{
      title: "Web App",
      widgetConfigs: [{
        title: "Branch master",
        type: "build-results",
        provider: "bamboo",
        planId: "IF-WK8"
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

    cy.route(/dashboards\/[^\/]+/, dashboardConfig)
  })

  it('should display a message when there is no build', () => {
    cy.route(/build-results\/.+\/[^\/]+/, []).as('getBuildResults')

    cy.visit('/')
    cy.wait('@getBuildResults')

    cy.get('.no-builds-message').should('exist')
  })

  it('should only display the latest build result when there is a single build', () => {
    const buildResults = [
      {
        buildNumber: 1,
        status: "Successful",
      }
    ]

    const latestBuildDetail = {
      buildNumber: 1,
      status: "Successful",
      reason: "Changes by Mark",
      timeStarted: "5 mins ago"
    }

    cy.route(/build-results\/.+\/[^\/]+/, buildResults).as('getBuildResults')
    cy.route(/build-results\/.+\/[^\/]+\/\d/, latestBuildDetail).as('getLatestBuildDetail')

    cy.visit('/')
    cy.wait('@getBuildResults')
    cy.wait('@getLatestBuildDetail')

    cy.get('.latest-build').should('exist')
    cy.get('.latest-build [icon="check"]').should('exist')
    cy.get('.latest-build .build-info .reason').should('contain', latestBuildDetail.reason)
  })
})
