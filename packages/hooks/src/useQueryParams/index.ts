import { useMemo } from 'react';
function useQueryParams<T>(defaultValue: string): string;
function useQueryParams(): { [key: string]: string };
function useQueryParams(paramName?: string) {
  return useMemo(() => {
    const query = new URLSearchParams(window.location.search);
    return paramName ? query.get(paramName) : Object.fromEntries(query.entries());
  }, [paramName]);
}

export default useQueryParams;
