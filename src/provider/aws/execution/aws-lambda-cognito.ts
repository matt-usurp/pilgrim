declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    CreateAuthChallengeTriggerEvent,
    CustomMessageTriggerEvent,
    DefineAuthChallengeTriggerEvent,
    PostAuthenticationTriggerEvent,
    PostConfirmationTriggerEvent,
    PreAuthenticationTriggerEvent,
    PreSignUpTriggerEvent,
    PreTokenGenerationTriggerEvent,
    UserMigrationTriggerEvent,
    VerifyAuthChallengeResponseTriggerEvent
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:cognito:create-auth-challenge': [CreateAuthChallengeTriggerEvent, void];
    readonly 'aws:cognito:define-auth-challenge': [DefineAuthChallengeTriggerEvent, void];
    readonly 'aws:cognito:custom-message': [CustomMessageTriggerEvent, void];
    readonly 'aws:cognito:pre-authentication': [PreAuthenticationTriggerEvent, void];
    readonly 'aws:cognito:post-authentication': [PostAuthenticationTriggerEvent, void];
    readonly 'aws:cognito:post-confirmation': [PostConfirmationTriggerEvent, void];
    readonly 'aws:cognito:pre-signup': [PreSignUpTriggerEvent, void];
    readonly 'aws:cognito:pre-token-generation': [PreTokenGenerationTriggerEvent, void];
    readonly 'aws:cognito:user-migration': [UserMigrationTriggerEvent, void];
    readonly 'aws:cognito:verify-auth-challenge-response': [VerifyAuthChallengeResponseTriggerEvent, void];
  }
}
