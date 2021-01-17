declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    ConnectContactFlowEvent as Event,
    ConnectContactFlowResult as Result
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:connect:contact-flow': [Event, Result];
  }
}
