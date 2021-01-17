declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    LexEvent as Event,
    LexResult as Result
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:lex': [Event, Result];
  }
}
