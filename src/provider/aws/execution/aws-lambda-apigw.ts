declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    APIGatewayProxyEvent as Event,
    APIGatewayProxyResult as Result,
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:apigw:proxy': [Event, Result];
  }
}
