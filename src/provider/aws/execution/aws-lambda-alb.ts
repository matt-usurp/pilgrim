declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    ALBEvent as Event,
    ALBResult as Result
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:alb:request': [Event, Result];
  }
}
