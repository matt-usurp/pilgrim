declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    APIGatewayAuthorizerResult as Result,
    APIGatewayRequestAuthorizerEvent as RequestEvent,
    APIGatewayTokenAuthorizerEvent as TokenEvent
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:apigw:authorizer:request': [RequestEvent, Result];
    readonly 'aws:apigw:authorizer:token': [TokenEvent, Result];
  }
}
