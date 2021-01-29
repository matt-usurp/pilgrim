/**
 * Grok is a small "functional" language based on TypeScript types.
 *
 * An "open-check" means the type could be a sub-type of another, causing a greater impact on the operation being done.
 * For example, a union of numbers extends number, in cases where you are using Exclude<> provided by TS, you will remove all numbers.
 * The same applies for objects, if you are checking for a `{ id: string }` then you can expect this to be fairly greedy.
 */
export namespace Grok {
  export namespace Data {
    /**
     * A covariant data store allowing for sub-type extending of maps.
     *
     * @todo better documentation
     */
    export type Covariant<Value> = (a: never, x: Value) => never;
  }

  /**
   * Traditional if-statement expressed through ts extends.
   */
  export type If<Condition extends boolean, ThenValue, ElseValue> = (
    Condition extends true
      ? ThenValue
      : ElseValue
  );

  /**
   * True when both values are true.
   */
  export type And<A extends boolean, B extends boolean> = (
    A extends true
      ? (
        B extends true
          ? true
          : false
      )
      : false
  );

  /**
   * The "is" namespace represents a series of assert type-functions.
   *
   * These functions will return true when a given value matches its signature.
   * Note, these asserts are not to use extends for failing early, they are designed for the if-statement.
   */
  export namespace Is {
    export type True<Value> = (
      Value extends true
        ? true
        : false
    );

    export type False<Value> = (
      Value extends false
        ? true
        : false
    );

    /**
     * A special check that can "in most cases" detect the usage of "any".
     * Done by abusing the a fairly strict type check merged with the value.
     * When the value is any the strict type check will pass meaning "any" was most likely used.
     *
     * This can be handy for ignoring these cases and preventing your type from being consumed as "any".
     *
     * @see Grok.Value.Any.Replace to replace instances of any with a default value.
     */
    export type Any<Value> = (
      0 extends (1 & Value)
        ? true
        : false
    );

    /**
     * A special check that can "in most cases" detect the usage of "never".
     * Done by abusing tuples not being able to contain a "never" value.
     * When the value is not never the tuple size is different and therefore is not "never".
     */
    export type Never<Value> = (
      [Value] extends [never]
        ? true
        : false
    );
  }

  export namespace Mutator {
    export type MutatorKind = { readonly GrokMutatorKind: unique symbol; };

    /**
     * Remove any mutations from the given value.
     */
    export type Remove<Value> = Exclude<Value, MutatorKind>;
  }

  /**
   * A series of "value" type-functions.
   */
  export namespace Value {
    /**
     * A safe "merge" function that will take precaution against "any".
     * This function should stop "any" from wrecking your types.
     */
    export type Merge<KnownValue, UnknownValue> = (
      Grok.If<
        Is.Any<UnknownValue>,
        KnownValue,
        KnownValue & UnknownValue
      >
    );

    export namespace Any {
      /**
       * Replace usage of "any" with a default value.
       */
      export type Replace<Value, Default> = (
        If<
          Is.Any<Value>,
          Default,
          Value
        >
      );
    }
  }

  export namespace Union {
    export type UnionMutatorKind = (
      & Grok.Mutator.MutatorKind
      & { readonly GrokUnionMutatorKind: unique symbol; }
    );

    /**
     * Union based mutations
     */
    export namespace Mutator {
      /**
       * A mutator that indicates "without this value".
       *
       * When ran through "Grok.Union.Mutate" the given should have this value removed.
       * Note, it is removed with a "open-check" which means it could remove many values.
       * For more information "open-check" see the documentation on the main Grok namespace.
       */
      export type Without<Value> = (
        & UnionMutatorKind
        & { readonly LangUnionActionWithoutKind: unique symbol; }
        & { value: Value; }
      );
    }

    /**
     * A resolver for all mutations mentioned above.
     */
    export type Mutate<Value, Given> = (
      // First check the given value is a mutator.
      Given extends UnionMutatorKind
        ? (
          // If the given value is "Grok.Union.Mutator.Without" then we need to perform its action.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Given extends Mutator.Without<any>
            ? Exclude<Value, Given['value']>
            // Given was not a "Grok.Union.Mutator.Without" mutation.
            // End of available mutations, return instead.
            : Given
        )
        // Given was not a mutator kind, return instead.
        : Given
    );
  }
}
