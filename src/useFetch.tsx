import React from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T,>(url: string, options?: RequestInit): FetchState<T> => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const optionsRef = React.useRef(options);

  optionsRef.current = options;

  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const result = await fetch(url, {
          ...optionsRef.current,
          signal: controller.signal,
        });
        const json = await result.json();
        if (!controller.signal.aborted) setData(json);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        if (error instanceof Error) setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
