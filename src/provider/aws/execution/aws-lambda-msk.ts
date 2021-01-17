declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    MSKEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:msk': [Event, void];
  }
}
