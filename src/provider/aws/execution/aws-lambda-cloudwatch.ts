declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    CloudWatchLogsEvent as LogEvent,
    CloudWatchLogsLogEvent as LogsLogEvent,
    ScheduledEvent as ScheduledEvent
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:cloudwatch:scheduled': [ScheduledEvent, void];
    readonly 'aws:cloudwatch:log': [LogEvent, void];
    readonly 'aws:cloudwatch:logs-log': [LogsLogEvent, void];
  }
}
