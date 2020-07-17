import React from 'react';
import { Home } from "./Home";
import { ReactQueryConfigProvider } from 'react-query';

const queryConfig: any = {
  shared: {
    suspense: false,
  },
  queries: {
    enabled: true,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: false,
    refetchOnMount: true,
    useErrorBoundary: false, // falls back to suspense
  },
  mutations: {
    throwOnError: false,
    useErrorBoundary: false, // falls back to suspense

  }
}

function App() {

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Home/>
    </ReactQueryConfigProvider>)
}

export default App;
