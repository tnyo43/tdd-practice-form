type KeyofUnion<T> = T extends T ? keyof T : never;

type ComposeRUnion<T, U = T> = T extends T
  ? T & Partial<Record<Exclude<KeyofUnion<U>, keyof T>, never>>
  : never;

export type RUnion<T> = ComposeRUnion<T>;

export type PartialNull<T> = { [K in keyof T]?: T[K] | null };
