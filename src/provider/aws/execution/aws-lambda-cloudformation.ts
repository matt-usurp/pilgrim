declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    CloudFormationCustomResourceEvent as Event,
    CloudFormationCustomResourceResponse as Response
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:cloudformation:custom-resource': [Event, Response];
  }
}
