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
  testStepConfigs: PipelineTestStepConfig[];
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

export interface PipelineTestStepConfig {
  id: string;
}

export interface PipelineTestRun {
  pipelineId: string;
  pipelineExecutionId: string;
  testStepId: string;
  id: string;
  status: string;
  counters: {
      all: number;
      succeeded: number;
      failed: number;
      skipped: number;
      quarantined: number;
  };
  duration: number;
  timeStarted: string;
  uri?: string;
  artifacts: {
      name: string;
      uri: string;
  }[];
  coverage?: {
      percentage: number;
      reportUri: string;
  };
}
