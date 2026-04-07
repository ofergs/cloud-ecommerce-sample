import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand, GetCommand, PutCommand, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import { ok, created, notFound, serverError, getUserId } from '../lib/response';
import { Order } from '../models/order';

export async function createOrder(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserId(event);

    // Fetch all cart items
    const cartResult = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `CART#${userId}`,
          ':skPrefix': 'ITEM#',
        },
      })
    );

    const cartItems = cartResult.Items ?? [];
    if (cartItems.length === 0) {
      return ok({ error: 'Cart is empty' });
    }

    const orderId = uuidv4();
    const now = new Date().toISOString();

    const orderItems = cartItems.map((item) => ({
      productId: item['productId'] as string,
      productName: item['productName'] as string,
      price: item['price'] as number,
      quantity: item['quantity'] as number,
    }));

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order: Order = {
      pk: `ORDER#${orderId}`,
      sk: `ORDER#${orderId}`,
      gsi1pk: `USER#${userId}`,
      gsi1sk: `ORDER#${orderId}`,
      id: orderId,
      userId,
      items: orderItems,
      total,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    // Write order and delete cart items in a transaction
    const deleteRequests = cartItems.map((item) => ({
      Delete: {
        TableName: TABLE_NAME,
        Key: { pk: item['pk'], sk: item['sk'] },
      },
    }));

    await docClient.send(
      new TransactWriteCommand({
        TransactItems: [
          { Put: { TableName: TABLE_NAME, Item: order } },
          ...deleteRequests,
        ],
      })
    );

    return created(order);
  } catch (err) {
    return serverError(err);
  }
}

export async function listOrders(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserId(event);

    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'UserOrdersIndex',
        KeyConditionExpression: 'gsi1pk = :gsi1pk',
        ExpressionAttributeValues: { ':gsi1pk': `USER#${userId}` },
        ScanIndexForward: false, // newest first
      })
    );

    return ok({ items: result.Items ?? [] });
  } catch (err) {
    return serverError(err);
  }
}

export async function getOrder(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const userId = getUserId(event);
    const orderId = event.pathParameters?.id;
    if (!orderId) {
      return ok({ error: 'Missing order id' });
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { pk: `ORDER#${orderId}`, sk: `ORDER#${orderId}` },
      })
    );

    if (!result.Item) return notFound('Order not found');
    if (result.Item['userId'] !== userId) return notFound('Order not found');

    return ok(result.Item);
  } catch (err) {
    return serverError(err);
  }
}
