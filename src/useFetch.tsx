import React from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T,>(
  url: RequestInfo | URL | null,
  options?: RequestInit,
): FetchState<T> => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const optionsRef = React.useRef(options);

  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchURL() {
      if (!url) return;
      setLoading(true);
      setData(null);
      setError(null);
      try {
        const response = await fetch(url, {
          ...optionsRef.current,
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const json = await response.json();
        if (!controller.signal.aborted) setData(json);
      } catch (error) {
        if (!controller.signal.aborted && error instanceof Error)
          setError(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchURL();
    return () => {
      controller.abort();
    };
  }, [url]);
  return { data, loading, error };
};

export default useFetch;
