declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    SESEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:ses': [Event, void];
  }
}
