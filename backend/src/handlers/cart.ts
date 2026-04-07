import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import { ok, badRequest, notFound, serverError, getUserId } from '../lib/response';
import { AddCartItemInput, CartItem, UpdateCartItemInput } from '../models/cart';

export async function getCart(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserId(event);

    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `CART#${userId}`,
          ':skPrefix': 'ITEM#',
        },
      })
    );
    return ok({ items: result.Items ?? [] });
  } catch (err) {
    return serverError(err);
  }
}

export async function addCartItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserId(event);
    if (!event.body) return badRequest('Missing request body');

    const input: AddCartItemInput = JSON.parse(event.body);
    if (!input.productId || !input.quantity || input.quantity < 1) {
      return badRequest('productId and quantity (>= 1) are required');
    }

    // Fetch product to snapshot price/name
    const productResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { pk: `PRODUCT#${input.productId}`, sk: `PRODUCT#${input.productId}` },
      })
    );
    if (!productResult.Item) return notFound('Product not found');
    const product = productResult.Item;

    const cartItem: CartItem = {
      pk: `CART#${userId}`,
      sk: `ITEM#${input.productId}`,
      userId,
      productId: input.productId,
      productName: product['name'] as string,
      price: product['price'] as number,
      quantity: input.quantity,
      addedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: cartItem }));
    return ok(cartItem);
  } catch (err) {
    return serverError(err);
  }
}

export async function updateCartItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserId(event);
    const productId = event.pathParameters?.productId;
    if (!productId) return badRequest('Missing productId');
    if (!event.body) return badRequest('Missing request body');

    const input: UpdateCartItemInput = JSON.parse(event.body);
    if (!input.quantity || input.quantity < 1) return badRequest('quantity must be >= 1');

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { pk: `CART#${userId}`, sk: `ITEM#${productId}` },
        UpdateExpression: 'SET quantity = :qty',
        ExpressionAttributeValues: { ':qty': input.quantity },
        ConditionExpression: 'attribute_exists(pk)',
        ReturnValues: 'ALL_NEW',
      })
    );
    return ok(result.Attributes);
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'ConditionalCheckFailedException') {
      return notFound('Cart item not found');
    }
    return serverError(err);
  }
}

export async function removeCartItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserId(event);
    const productId = event.pathParameters?.productId;
    if (!productId) return badRequest('Missing productId');

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { pk: `CART#${userId}`, sk: `ITEM#${productId}` },
      })
    );
    return ok({ message: 'Item removed' });
  } catch (err) {
    return serverError(err);
  }
}
