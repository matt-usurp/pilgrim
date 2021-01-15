declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    APIGatewayProxyEventV2 as Event,
    APIGatewayProxyResultV2 as Result,
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:apigw:proxy:v2': [Event, Result];
  }
}
