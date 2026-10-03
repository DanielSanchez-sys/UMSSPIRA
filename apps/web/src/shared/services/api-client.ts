const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface ApiClientOptions
  extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiClient<TResponse>(
  path: string,
  options: ApiClientOptions = {},
): Promise<TResponse> {
  const { body, headers: providedHeaders, ...requestOptions } =
    options;
  const headers = new Headers(providedHeaders);

  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const responseText = await response.text();
  let responseData: unknown;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    const message = getErrorMessage(responseData);

    throw new Error(
      message ??
        `La solicitud falló con el estado ${response.status}.`,
    );
  }

  return responseData as TResponse;
}

function getErrorMessage(responseData: unknown): string | null {
  if (
    typeof responseData !== 'object' ||
    responseData === null ||
    !('message' in responseData)
  ) {
    return null;
  }

  const { message } = responseData;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  return typeof message === 'string' ? message : null;
}
