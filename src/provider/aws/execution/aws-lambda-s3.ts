declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    S3BatchEvent as BatchEvent,
    S3BatchResult as BatchResult,
    S3Event as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:s3:object': [Event, void];
    readonly 'aws:s3:batch': [BatchEvent, BatchResult];
  }
}
