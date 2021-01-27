import { Grok } from './grok';

// eslint-disable-next-line jest/no-disabled-tests
it.skip('unknown', () => {
  return;
});

type Assert<E extends boolean, V extends E> = V;

namespace GrokAnd {
  type T_01 = Assert<true, Grok.And<true, true>>;

  type T_02 = Assert<false, Grok.And<true, false>>;
  type T_03 = Assert<false, Grok.And<false, true>>;
}

namespace GrokIsNever {
  type T_01 = Assert<true, Grok.Is.Never<never>>;

  type T_02 = Assert<false, Grok.Is.Never<any>>;
  type T_03 = Assert<false, Grok.Is.Never<unknown>>;
  type T_04 = Assert<false, Grok.Is.Never<number>>;
  type T_05 = Assert<false, Grok.Is.Never<1>>;
}
