import type { StoreApi } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

/* This code defines a function called `createBoundedUseStore` that takes a `store` object of type
`StoreApi<unknown>` as its argument. The function returns a function that can be used to access the
state of the `store` object from inside a React component. */
const createBoundedUseStore = ((store) => (selector, equals) =>
  useStoreWithEqualityFn(store, selector as never, equals)) as <
  S extends StoreApi<unknown>
>(
  store: S,
) => {
  (): ExtractState<S>;
  <T>(
    selector: (state: ExtractState<S>) => T,
    equals?: (a: T, b: T) => boolean,
  ): T;
};

type ExtractState<S> = S extends { getState: () => infer X } ? X : never;

export default createBoundedUseStore;
