import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          throw new Error(json.message || res.statusText);
        } catch {
          // If JSON parsing fails, use the text as-is
          throw new Error(text);
        }
      } else {
        throw new Error(res.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(res.statusText);
    }
  }
}

export async function apiRequest(
  url: string,
  options?: Omit<RequestInit, 'body'> & { body?: any },
): Promise<any> {
  const requestOptions: RequestInit = {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: "include",
  };

  // Handle body serialization explicitly
  if (options?.body !== undefined && options?.body !== null) {
    if (typeof options.body === 'string') {
      requestOptions.body = options.body;
    } else if (options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof Blob) {
      requestOptions.body = options.body;
    } else {
      // For objects, arrays, and other types, stringify to JSON
      requestOptions.body = JSON.stringify(options.body);
    }
  }

  const res = await fetch(url, requestOptions);
  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
