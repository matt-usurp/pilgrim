/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Grok } from './grok';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAlias = any;
type Assert<E extends boolean, V extends E> = V;

// @ts-ignore
namespace GrokAnd {
  // @ts-ignore
  type T_01 = Assert<true, Grok.And<true, true>>;

  // @ts-ignore
  type T_02 = Assert<false, Grok.And<true, false>>;
  // @ts-ignore
  type T_03 = Assert<false, Grok.And<false, true>>;
}

// @ts-ignore
namespace GrokIsNever {
  // @ts-ignore
  type T_01 = Assert<true, Grok.Is.Never<never>>;

  // @ts-ignore
  type T_02 = Assert<false, Grok.Is.Never<AnyAlias>>;
  // @ts-ignore
  type T_03 = Assert<false, Grok.Is.Never<unknown>>;
  // @ts-ignore
  type T_04 = Assert<false, Grok.Is.Never<number>>;
  // @ts-ignore
  type T_05 = Assert<false, Grok.Is.Never<1>>;
}
