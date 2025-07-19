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
  options?: RequestInit & { body?: any },
): Promise<any> {
  // Properly serialize body if it's an object
  let body = options?.body;
  console.log('Original body:', body, 'Type:', typeof body);
  
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams) && typeof body !== 'string') {
    body = JSON.stringify(body);
    console.log('Serialized body:', body);
  }

  const res = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body as BodyInit,
    credentials: "include",
    ...options,
  });

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
