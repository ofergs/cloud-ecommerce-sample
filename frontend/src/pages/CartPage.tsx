import { useMutation, useQuery, useQueryClient } from 'react-query';
import { cartApi, ordersApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: items = [], isLoading } = useQuery('cart', cartApi.get);

  const removeMutation = useMutation(cartApi.removeItem, {
    onSuccess: () => queryClient.invalidateQueries('cart'),
  });

  const checkoutMutation = useMutation(ordersApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('cart');
      queryClient.invalidateQueries('orders');
      navigate('/orders');
    },
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading cart…</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border divide-y">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-800">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    ${(item.price / 100).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-indigo-600">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeMutation.mutate(item.productId)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800">
              Total: ${(total / 100).toFixed(2)}
            </span>
            <button
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {checkoutMutation.isLoading ? 'Placing order…' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
