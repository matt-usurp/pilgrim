declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    SNSEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:sns': [Event, void];
  }
}
