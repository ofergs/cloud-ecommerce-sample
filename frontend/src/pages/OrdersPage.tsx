import { useQuery } from 'react-query';
import { ordersApi } from '../services/api';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data: orders = [], isLoading, error } = useQuery('orders', ordersApi.list);

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading orders…</div>;
  if (error) return <div className="text-center py-16 text-red-500">Failed to load orders.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm text-gray-700">{order.id}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                      STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="divide-y border-t pt-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-700">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="text-gray-600">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end font-bold text-indigo-600">
                Total: ${(order.total / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
