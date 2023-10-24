type UseFetchGetResponse<T> = {
  data: T | null,
  error: string,
  loaded: boolean
}

type FetchResponse = {
  data: any,
  error: any
}

/**
 * T as Array<Test> ? return Test : return T
 */
type ElementType<T> = T extends (infer U)[] ? U : T;