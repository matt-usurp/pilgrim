declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    CodeBuildCloudWatchStateEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:codebuild:state': [Event, void];
  }
}
