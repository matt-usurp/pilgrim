declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    SQSEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:sqs': [Event, void];
  }
}
