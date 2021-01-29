import { Grok } from '../../language/grok';
import { Pilgrim } from '../../main';
import { HandlerBuilder } from './builder';

type TestSource = { source: number; };
type TestResponse = Pilgrim.Response<'test:default', { body: string; }>;
type TestContext = {
  request: string;
  time: number;
  active: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = new HandlerBuilder<TestSource, any, TestContext, TestResponse>({});

/**
 * A middleware that does nothing for the types.
 * Usage should mean the builder returned is the same.
 * Reason; Nothing is changing.
 */
const withPassThrough: (
  Pilgrim.Middleware<
    TestSource,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Pilgrim.Inherit
  >
) = async({ context, next }) => {
  return next(context);
};

const u01 = builder.use(withPassThrough);

/**
 * A middleware with inbound context typed as the known context.
 * The inbound context should be allowed as it matches exactly.
 * Usage should mean the builder returned is the same.
 * Reason; Nothing is changing.
 */
const withKnownTestContext: (
  Pilgrim.Middleware<
    TestSource,
    TestContext,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Pilgrim.Inherit
  >
) = async({ context, next }) => {
  return next(context);
};

const u02 = u01.use(withKnownTestContext);

/**
 * A middleware with a partial inbound context.
 * The inbound context should be allowed as it is considered a sub-set of the known context.
 * Usage should mean the builder returned is the same.
 * Reason; Nothing is changing.
 */
const withKnownTestContextSubset: (
  Pilgrim.Middleware<
    TestSource,
    Pick<TestContext, 'time'>,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Pilgrim.Inherit
  >
) = async({ context, next }) => {
  return next(context);
};

const u03 = u02.use(withKnownTestContextSubset);

/**
 * A middleware that returns some new context.
 * Usage should mean the builder has a merged context with the current known context.
 */
const withNewContextRandom: (
  Pilgrim.Middleware<
    TestSource,
    Pilgrim.Inherit,
    { random: number; },
    Pilgrim.Inherit,
    Pilgrim.Inherit
  >
) = async({ context, next }) => {
  return next({
    ...context,

    random: 123,
  });
};

const u04 = u03.use(withNewContextRandom);
const u05 = u04.use(withPassThrough);

/**
 * A slightly complex middleware that takes in the newly provided context above.
 * It also returns some new context which should get merged in too.
 * The inbound context should be fine as it is a sub-set of the compiled context "so-far".
 */
const withNewContextRandomAndActiveOutput: (
  Pilgrim.Middleware<
    TestSource,
    { random: number; },
    { active: boolean; },
    Pilgrim.Inherit,
    Pilgrim.Inherit
  >
) = async({ context, next }) => {
  return next({
    ...context,

    active: context.random > 50,
  });
};

const u06 = u05.use(withNewContextRandomAndActiveOutput);

/// ---
/// --- Experimental
/// ---

type AnotherResponse = Pilgrim.Response<'test:another', { test: boolean; }>;

const m6: (
  Pilgrim.Middleware<
    TestSource,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    AnotherResponse,
    TestResponse
  >
) = async({ context, next }) => {
  const response = await next(context);

  if (response.type === 'test:another') {
    return {
      type: 'test:default',
      value: {
        body: response.value.test
          ? 'true'
          : 'false'
      },
    };
  }

  return response;
};

const u07 = u06.use(m6);

const m7: (
  Pilgrim.Middleware<
    TestSource,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    AnotherResponse
  >
) = async({ context, next }) => {
  const response = await next(context);

  return response;
};

const u08 = u07.use(m7);

const m8: (
  Pilgrim.Middleware<
    TestSource,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Grok.Union.Mutator.Without<TestResponse>,
    Pilgrim.Inherit
  >
) = async({ context, next }) => {
  const response = await next(context);

  return response;
};

const u09 = u08.use(m8);

u09;
