declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    CodePipelineCloudWatchEvent as PipelineCloudwatchEvent,
    CodePipelineEvent as PipelineEvent
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:codepipeline:job': [PipelineEvent, void];
    readonly 'aws:codepipeline:cloudwatch': [PipelineCloudwatchEvent, void];
  }
}
