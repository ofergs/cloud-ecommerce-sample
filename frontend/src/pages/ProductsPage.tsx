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
      {/* Hero banner */}
      <div className="bg-gradient-to-b from-brand-light to-brand text-white rounded-sm p-8 mb-6 shadow">
        <h1 className="text-3xl font-bold">Today's featured products</h1>
        <p className="text-sm text-gray-200 mt-2">
          Hand-picked deals across the ShopCloud catalog
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Results</h2>
            <p className="text-xs text-gray-600 mt-1">
              {products.length} {products.length === 1 ? 'result' : 'results'}
            </p>
          </div>
          <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-gray-50">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    </div>
  );
}
