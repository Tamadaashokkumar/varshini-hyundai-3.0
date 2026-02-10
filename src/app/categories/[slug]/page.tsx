// src/app/categories/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/store/useStore';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowUpDown, PackageX } from 'lucide-react';

// 🛠️ Interfaces matching YOUR Specific Backend JSON
interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

interface CompatibleModel {
  modelName: string;
  yearFrom?: number;
  yearTo?: number;
  variant?: string;
  _id?: string;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  partNumber?: string;
  description?: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  stockStatus?: string;
  images: ProductImage[];
  compatibleModels: (CompatibleModel | string)[]; 
  createdAt?: string;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { setCart, toggleCartDrawer } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const categoryName = decodeURIComponent(params.slug as string);

  useEffect(() => {
    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams: any = {
        category: categoryName,
        limit: 50,
        page: 1,
      };

      switch (sortBy) {
        case 'price-low':
          queryParams.sortBy = 'price';
          queryParams.sortOrder = 'asc';
          break;
        case 'price-high':
          queryParams.sortBy = 'price';
          queryParams.sortOrder = 'desc';
          break;
        case 'name-az':
          queryParams.sortBy = 'name';
          queryParams.sortOrder = 'asc';
          break;
        case 'name-za':
          queryParams.sortBy = 'name';
          queryParams.sortOrder = 'desc';
          break;
        default:
          queryParams.sortBy = 'createdAt';
          queryParams.sortOrder = 'desc';
      }

      const response = await apiClient.get('/products', { params: queryParams });
      
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await apiClient.post('/cart/add', {
        productId: product._id,
        quantity: 1,
      });

      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success(`${product.name} added to cart!`);
        toggleCartDrawer();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to add to cart';
      toast.error(errorMessage);
    }
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' },
  ];

  return (
    // 👇 UPDATED: Added transition-colors and light/dark classes
    <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white p-4 md:p-8 pt-[70px] md:pt-[80px] lg:pt-[110px] transition-colors duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 bg-white dark:bg-white/5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white shadow-sm dark:shadow-none"
            >
              <ArrowLeft size={20} />
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl"
              >
                {getCategoryIcon(categoryName)}
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">{categoryName}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loading ? 'Loading...' : `${products.length} products found`}
                </p>
              </div>
            </div>
          </div>

          {/* Sort Menu */}
          <div className="relative z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-sm font-medium text-gray-700 dark:text-white shadow-sm dark:shadow-none"
            >
              <ArrowUpDown size={16} />
              <span>Sort By</span>
            </motion.button>

            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-30"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                      sortBy === option.value 
                        ? 'text-hyundai-blue font-semibold bg-blue-50 dark:bg-hyundai-blue/5' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl h-[380px] animate-pulse shadow-sm dark:shadow-none">
                <div className="h-[200px] bg-gray-200 dark:bg-white/5 rounded-t-2xl w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 dark:bg-white/5 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <PackageX size={40} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
              We couldn't find any parts in the <span className="text-gray-900 dark:text-white font-semibold">{categoryName}</span> category at the moment.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              Browse All Categories
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product as any}
                onAddToCart={(p: any) => handleAddToCart(p)}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Engine: '⚙️',
    Brake: '🛑',
    Electrical: '⚡',
    Body: '🚗',
    Accessories: '✨',
    Suspension: '🔧',
    Transmission: '⚙️',
    Filters: '💨',
    Lights: '💡',
  };
  const key = Object.keys(icons).find(k => k.toLowerCase() === category.toLowerCase());
  return key ? icons[key] : '🔧';
}