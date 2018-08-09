(function () {
  return {
    dashboardDataProvider: getDashboards(),
    executionDataProvider: getExecutions()
  };

  function getDashboards() {
    return {
      singlePipeline: {
        title: "Test Dashboard",
        description: "",
        columnConfigs: [{
          title: "Dashboard UI",
          widgetConfigs: [{
            title: "Branch master",
            type: "pipeline",
            provider: "aws",
            pipelineId: "TestPipeline"
          }]
        }]
      },

      multipleColumns: {
        title: "Test Dashboard",
        description: "",
        columnConfigs: [{
            title: "Web UI",
            widgetConfigs: [{
              title: "Branch master",
              type: "pipeline",
              provider: "aws",
              pipelineId: "WebUIPipeline"
            }]
          },
          {
            title: "Web API",
            widgetConfigs: [{
              title: "Branch master",
              type: "pipeline",
              provider: "aws",
              pipelineId: "WebApiPipeline"
            }]
          },
          {
            title: "Auth Service",
            widgetConfigs: [{
              title: "Branch master",
              type: "pipeline",
              provider: "aws",
              pipelineId: "AuthServicePipeline"
            }]
          }
        ]
      }
    }
  }

  function getExecutions() {
    const MS_PER_MINUTE = 60000;
    let executionCounter = 1;

    return {
      execution_1: getTestPipelineExecutions(1),

      execution_10: getTestPipelineExecutions(10),
    };

    function getTestPipelineExecutions(numberOfExecutions, resetCounter) {
      if (resetCounter) {
        executionCounter = 1;
      }

      const result = [];

      for (let index = 1; index <= numberOfExecutions; index++) {
        let number = executionCounter++;
        result.push({
          pipelineId: 'TestPipeline',
          id: 'TestPipeline-' + number,
          sequenceNumber: number,
          status: getStatus(index === numberOfExecutions ? 3 : 2),
          reason: getReason(),
          changes: [
            {
              id: '3ad8354bc0',
              author: 'Mark',
              summary: getCodeChangeSummary(),
              uri: 'http://localhost'
            },
            {
              id: '84ac762dc2',
              author: 'Adrian',
              summary: getCodeChangeSummary(),
              uri: 'http://localhost'
            }
          ],
          timeStarted: getTimeStarted(index),
          duration: getDuration(),
          uri: 'http://localhost'
        });
      }

      return result.reverse();
    }

    function getStatus(cap) {
      cap = cap || 2
      switch (Math.floor(Math.random() * 100) % cap) {
        case 0:
          return 'Failed';
        case 1:
          return 'Succeeded';
        default:
          return 'Running';
      }
    }

    function getReason() {
      switch (Math.floor(Math.random() * 100) % 4) {
        case 0:
          return 'Manually triggered by Adrian';
        case 1:
          return 'Manually triggered by Mark';
        case 2:
          return 'Changes by Adrian';
        default:
          return 'Changes by Mark';
      }
    }

    function getCodeChangeSummary() {
      const issueNumber = Math.floor(Math.random() * 10000)
      return 'Fix the issue PRO-' + issueNumber;
    }

    function getTimeStarted(sequenceNumber) {
      sequenceNumber = sequenceNumber || 10
      return minsAgo(1 / sequenceNumber * 20);
    }

    function getDuration() {
      const mins = Math.floor(Math.random() * 100) % 6 + 1
      return mins * MS_PER_MINUTE;
    }

    function minsAgo(duration) {
      const now = new Date();
      return new Date(now - duration * MS_PER_MINUTE).toISOString();
    }
  }
})()
