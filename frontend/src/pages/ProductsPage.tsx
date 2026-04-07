import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productsApi, cartApi, Product } from '../services/api';
import ProductCard from '../components/ProductCard';
import { getCurrentUsername } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState<string | null>(null);

  const { data: products = [], isLoading, error } = useQuery('products', productsApi.list);

  const addToCartMutation = useMutation(
    async (product: Product) => {
      const user = await getCurrentUsername();
      if (!user) {
        navigate('/login');
        return;
      }
      return cartApi.addItem(product.id, 1);
    },
    {
      onSuccess: () => queryClient.invalidateQueries('cart'),
      onSettled: () => setAddingId(null),
    }
  );

  function handleAddToCart(product: Product) {
    setAddingId(product.id);
    addToCartMutation.mutate(product);
  }

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading products…</div>;
  if (error) return <div className="text-center py-16 text-red-500">Failed to load products.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              adding={addingId === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
