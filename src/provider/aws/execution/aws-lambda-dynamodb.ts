declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    DynamoDBStreamEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:dynamodb:stream': [Event, void];
  }
}
