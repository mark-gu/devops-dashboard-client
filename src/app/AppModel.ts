export interface AppDisplayMessage {
  title: string;
  message: string;
  severity: string;
  detail?: string;
  debug?: string;
}

export interface DashboardConfig {
  title: string;
  description: string;
  columnConfigs: ColumnConfig[];
}

export interface ColumnConfig {
  title: string;
  widgetConfigs: WidgetConfig[];
}

export interface WidgetConfig {
  title: string;
  type: string;
  provider: string;
}

export interface DashboardConfigUploadResult {
  dashboardName: string;
}

export interface PipelineWidgetConfig extends WidgetConfig {
  pipelineId: string;
}

export interface PipelineExecution {
  pipelineId: string;
  id: string;
  sequenceNumber: number;
  reason: string;
  status: string;
  timeStarted: string;
  duration: string;
  uri: string;
  ui: {
    label: string;
    statusClass: string;
  };
}

export interface TestResultWidgetConfig extends WidgetConfig {
  projectId: string;
  testStepId: string;
}

export interface TestResult {
  projectId: string;
  testRunId: string;
  status: string;
  counter: {
    succeeded: number;
    failed: number;
    skipped: number;
    quarantine: number;
  };
  coverage: {
    percentage: number;
    reportUri: string;
  };
  timeStarted: string;
  duration: string;
  uri: string;
  reportUri: string;
}
