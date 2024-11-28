import { useMemo } from 'react';
function useQueryParams<T>(defaultValue: string): string;
function useQueryParams(): { [key: string]: string } | null;
function useQueryParams(paramName?: string): string | { [key: string]: string } | null {
  return useMemo(() => {
    const query = new URLSearchParams(window.location.search);
    return paramName ? query.get(paramName) : Object.fromEntries(query.entries());
  }, [paramName]);
}

export default useQueryParams;
