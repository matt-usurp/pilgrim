declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    EventBridgeEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:eventbridge': [Event<string, Record<string, unknown>>, void];
  }
}
