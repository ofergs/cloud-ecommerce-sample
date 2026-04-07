import { Product } from '../services/api';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  adding: boolean;
}

export default function ProductCard({ product, onAddToCart, adding }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-3">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-indigo-600">
          ${(product.price / 100).toFixed(2)}
        </span>
        <span className="text-xs text-gray-400">{product.stock} left</span>
      </div>
      <button
        onClick={() => onAddToCart(product)}
        disabled={adding || product.stock === 0}
        className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {adding ? 'Adding…' : product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
