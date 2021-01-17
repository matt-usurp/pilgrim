declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    AppSyncResolverEvent as Event
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:appsync': [Event<Record<string, unknown>>, void];
  }
}
