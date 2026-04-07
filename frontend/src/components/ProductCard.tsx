import { Product } from '../services/api';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  adding: boolean;
}

export default function ProductCard({ product, onAddToCart, adding }: Props) {
  const price = product.price / 100;
  const dollars = Math.floor(price);
  const cents = Math.round((price - dollars) * 100).toString().padStart(2, '0');

  return (
    <div className="bg-white p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow border border-gray-200 rounded">
      {product.imageUrl ? (
        <div className="h-48 flex items-center justify-center bg-white">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-48 max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          No image
        </div>
      )}

      <h3 className="text-base text-gray-900 line-clamp-2 hover:text-accent-dark cursor-pointer">
        {product.name}
      </h3>

      {/* Star rating (placeholder static rating) */}
      <div className="flex items-center gap-1 text-xs">
        <div className="flex text-accent">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-blue-700 hover:text-accent-dark cursor-pointer">
          {Math.floor(Math.random() * 900 + 100)}
        </span>
      </div>

      <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>

      {/* Price */}
      <div className="flex items-baseline">
        <span className="text-xs text-gray-700 mt-1">$</span>
        <span className="text-2xl font-medium text-gray-900">{dollars}</span>
        <span className="text-xs text-gray-700 mt-1">{cents}</span>
      </div>

      {/* Stock indicator */}
      {product.stock > 0 ? (
        <span className="text-xs text-green-700">
          In stock <span className="text-gray-500">· {product.stock} left</span>
        </span>
      ) : (
        <span className="text-xs text-red-700">Currently unavailable</span>
      )}

      <button
        onClick={() => onAddToCart(product)}
        disabled={adding || product.stock === 0}
        className="mt-1 w-full py-1.5 rounded-full bg-accent hover:bg-accent-dark text-brand-dark text-sm font-medium border border-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {adding ? 'Adding…' : product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
