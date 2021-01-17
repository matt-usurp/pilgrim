declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    IoTEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:iot': [Event, void];
  }
}
