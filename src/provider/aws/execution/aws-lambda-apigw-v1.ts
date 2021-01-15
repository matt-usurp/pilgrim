declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    APIGatewayProxyEvent as ProxyEvent,
    APIGatewayProxyResult as ProxyResult,
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:apigw:proxy:v1': [ProxyEvent, ProxyResult];
  }
}
