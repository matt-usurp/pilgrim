declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    FirehoseTransformationEvent,
    FirehoseTransformationResult,
    KinesisStreamEvent
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:kinesis:firehose-transform': [FirehoseTransformationEvent, FirehoseTransformationResult];
    readonly 'aws:kinesis:stream': [KinesisStreamEvent, void];
  }
}
