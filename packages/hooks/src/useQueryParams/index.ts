import { useMemo } from 'react';

type UseQueryParamsResult<T> = T extends string ? string | null : Record<string, string>;

function useQueryParams<T extends string>(
  paramName: T,
  options?: { search?: string; url?: string },
): UseQueryParamsResult<T>;
function useQueryParams(options?: {
  search?: string;
  url?: string;
}): UseQueryParamsResult<undefined>;
function useQueryParams(
  paramNameOrOptions?: string | { search?: string; url?: string },
  maybeOptions?: { search?: string; url?: string },
) {
  const paramName = typeof paramNameOrOptions === 'string' ? paramNameOrOptions : undefined;
  const options = typeof paramNameOrOptions === 'string' ? maybeOptions : paramNameOrOptions;

  return useMemo(() => {
    let search = options?.search;
    if (!search && options?.url) {
      const urlObj = new URL(options.url, window.location.origin);
      search = urlObj.search;
    }
    const query = new URLSearchParams(search || window.location.search);
    return paramName ? query.get(paramName) : Object.fromEntries(query.entries());
  }, [paramName, options?.search, options?.url]);
}

export default useQueryParams;
