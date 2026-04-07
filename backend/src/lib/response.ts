import { APIGatewayProxyResult } from 'aws-lambda';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
};

export function ok(body: unknown): APIGatewayProxyResult {
  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function created(body: unknown): APIGatewayProxyResult {
  return { statusCode: 201, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function noContent(): APIGatewayProxyResult {
  return { statusCode: 204, headers: CORS_HEADERS, body: '' };
}

export function badRequest(message: string): APIGatewayProxyResult {
  return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

export function notFound(message = 'Not found'): APIGatewayProxyResult {
  return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

export function serverError(err: unknown): APIGatewayProxyResult {
  console.error(err);
  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: 'Internal server error' }),
  };
}

export function getUserId(event: { requestContext?: { authorizer?: { claims?: { sub?: string } } } }): string {
  const sub = event.requestContext?.authorizer?.claims?.sub;
  if (!sub) throw new Error('Unauthorized: missing user sub');
  return sub;
}
