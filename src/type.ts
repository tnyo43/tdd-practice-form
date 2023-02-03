type KeyofUnion<T> = T extends T ? keyof T : never;

type ComposeRUnion<T, U = T> = T extends T
  ? { [Key in keyof T]: T[Key] } & Partial<
      Record<Exclude<KeyofUnion<U>, keyof T>, never>
    >
  : never;

export type RUnion<T> = ComposeRUnion<T, T>;
