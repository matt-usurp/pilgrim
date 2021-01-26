import { Grok } from '../../language/grok';
import { PilgrimMiddleware } from '../middleware';
import { PilgrimResponse } from '../response';
import { HandlerBuilder } from './builder';

// eslint-disable-next-line jest/no-disabled-tests
it.skip('unknown', () => {
  return;
});

type TestSource = { source: number; };
type TestResponse = { body: string; };
type TestContext = {
  request: string;
  time: number;
  active: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = new HandlerBuilder<TestSource, any, any, TestContext, TestResponse>({});

/**
 * A middleware that does nothing for the types.
 * Usage should mean the builder returned is the same.
 * Reason; Nothing is changing.
 */
const withPassThrough: (
  PilgrimMiddleware.Middleware<
    TestSource,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u01 = builder.use(withPassThrough);

/**
 * A middleware with inbound context typed as the known context.
 * The inbound context should be allowed as it matches exactly.
 * Usage should mean the builder returned is the same.
 * Reason; Nothing is changing.
 */
const withKnownTestContext: (
  PilgrimMiddleware.Middleware<
    TestSource,
    TestContext,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u02 = u01.use(withKnownTestContext);

/**
 * A middleware with a partial inbound context.
 * The inbound context should be allowed as it is considered a sub-set of the known context.
 * Usage should mean the builder returned is the same.
 * Reason; Nothing is changing.
 */
const withKnownTestContextSubset: (
  PilgrimMiddleware.Middleware<
    TestSource,
    Pick<TestContext, 'time'>,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u03 = u02.use(withKnownTestContextSubset);

/**
 * A middleware that returns some new context.
 * Usage should mean the builder has a merged context with the current known context.
 */
const withNewContextRandom: (
  PilgrimMiddleware.Middleware<
    TestSource,
    PilgrimMiddleware.Inherit,
    { random: number; },
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u04 = u03.use(withNewContextRandom);
const u05 = u04.use(withPassThrough);

/**
 * A slightly complex middleware that takes in the newly provided context above.
 * It also returns some new context which should get merged in too.
 * The inbound context should be fine as it is a sub-set of the compiled context "so-far".
 */
const withNewContextRandomAndActiveOutput: (
  PilgrimMiddleware.Middleware<
    TestSource,
    { random: number; },
    { active: boolean; },
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u06 = u05.use(withNewContextRandomAndActiveOutput);

/// ---
/// --- Experimental
/// ---

type AnotherResponse = PilgrimResponse.Response<'another', { test: boolean; }>;

const m6: (
  PilgrimMiddleware.Middleware<
    TestSource,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    AnotherResponse,
    PilgrimMiddleware.Inherit
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u07 = u06.use(m6);

const m7: (
  PilgrimMiddleware.Middleware<
    TestSource,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    AnotherResponse
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u08 = u07.use(m7);

const m8: (
  PilgrimMiddleware.Middleware<
    TestSource,
    PilgrimMiddleware.Inherit,
    PilgrimMiddleware.Inherit,
    Grok.Union.Mutator.Without<TestResponse>,
    PilgrimMiddleware.Inherit
  >
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) = {} as any;

const u09 = u08.use(m8);

u09;
