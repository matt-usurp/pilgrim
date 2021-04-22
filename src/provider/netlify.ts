import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { HandlerBuilder } from '../application/handler/builder';
import { ProviderCompositionFunction } from '../application/provider';
import { Pilgrim } from '../main';
import { create, never } from '../response';

type NetlifyHandler = (
  event: HandlerEvent,
  context: HandlerContext,
) => Promise<HandlerResponse | undefined>;

type NetlifyContext = {
  readonly request: {
    readonly id: string;
  };
};

type NetlifyEventSource = {
  readonly context: HandlerContext;
  readonly event: HandlerEvent;
};

type NetlifyResponse = Pilgrim.Response<'netlify:event', HandlerResponse>;

export * from '../response';

export function event(value: NetlifyResponse['value']): NetlifyResponse {
  return create<NetlifyResponse>('netlify:event', value);
}

type NetlifyProviderCompositionFunction = (
  ProviderCompositionFunction<
    NetlifyEventSource,
    NetlifyContext,
    NetlifyResponse | Pilgrim.Response.Nothing,
    NetlifyHandler
  >
);

const composer: NetlifyProviderCompositionFunction = (executor) => async(event, context) => {
  const value = await executor({
    source: {
      event,
      context,
    },

    context: {
      request: {
        id: context.awsRequestId,
      },
    },
  });

  if (value.type === 'nothing') {
    return;
  }

  if (value.type === 'netlify:event') {
    return value.value;
  }

  never(value);

  return undefined;
};

export function netlify(): (
  HandlerBuilder<
    NetlifyEventSource,
    NetlifyProviderCompositionFunction,
    NetlifyContext,
    NetlifyResponse | Pilgrim.Response.Nothing
  >
) {
  return new HandlerBuilder(composer);
}
