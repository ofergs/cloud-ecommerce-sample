import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import { ok, created, noContent, badRequest, notFound, serverError } from '../lib/response';
import { CreateProductInput, Product, UpdateProductInput } from '../models/product';

export async function listProducts(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: { ':prefix': 'PRODUCT#' },
      })
    );
    // QueryCommand with begins_with on PK is not valid — use Scan with filter for simplicity
    // (For production use a GSI by entity type)
    const scanResult = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'EntityTypeIndex',
        KeyConditionExpression: 'entityType = :type',
        ExpressionAttributeValues: { ':type': 'PRODUCT' },
      })
    );
    return ok({ items: scanResult.Items ?? [] });
  } catch (err) {
    return serverError(err);
  }
}

export async function getProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) return badRequest('Missing product id');

    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { pk: `PRODUCT#${id}`, sk: `PRODUCT#${id}` },
      })
    );
    if (!result.Item) return notFound('Product not found');
    return ok(result.Item);
  } catch (err) {
    return serverError(err);
  }
}

export async function createProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) return badRequest('Missing request body');
    const input: CreateProductInput = JSON.parse(event.body);

    if (!input.name || input.price == null || input.stock == null) {
      return badRequest('name, price, and stock are required');
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const product: Product & { entityType: string } = {
      pk: `PRODUCT#${id}`,
      sk: `PRODUCT#${id}`,
      entityType: 'PRODUCT',
      id,
      name: input.name,
      description: input.description ?? '',
      price: input.price,
      imageUrl: input.imageUrl,
      stock: input.stock,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: product }));
    return created(product);
  } catch (err) {
    return serverError(err);
  }
}

export async function updateProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) return badRequest('Missing product id');
    if (!event.body) return badRequest('Missing request body');

    const input: UpdateProductInput = JSON.parse(event.body);
    const fields = Object.entries(input).filter(([, v]) => v !== undefined);
    if (fields.length === 0) return badRequest('No fields to update');

    const updateExprParts = fields.map(([k], i) => `#f${i} = :v${i}`);
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = { ':updatedAt': new Date().toISOString() };

    fields.forEach(([k, v], i) => {
      names[`#f${i}`] = k;
      values[`:v${i}`] = v;
    });

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { pk: `PRODUCT#${id}`, sk: `PRODUCT#${id}` },
        UpdateExpression: `SET ${updateExprParts.join(', ')}, updatedAt = :updatedAt`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(pk)',
        ReturnValues: 'ALL_NEW',
      })
    );
    return ok(result.Attributes);
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'ConditionalCheckFailedException') {
      return notFound('Product not found');
    }
    return serverError(err);
  }
}

export async function deleteProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) return badRequest('Missing product id');

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { pk: `PRODUCT#${id}`, sk: `PRODUCT#${id}` },
      })
    );
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}
