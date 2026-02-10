// // components/WishlistButton.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Heart } from 'lucide-react';
// import { wishlistAPI } from '@/lib/api/wishlist';
// import { toast } from 'react-hot-toast';

// interface WishlistButtonProps {
//   productId: string;
//   className?: string;
//   showText?: boolean;
// }

// export default function WishlistButton({
//   productId,
//   className = '',
//   showText = false,
// }: WishlistButtonProps) {
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);

//   // Check if product is in wishlist on mount
//   useEffect(() => {
//     checkWishlistStatus();
//   }, [productId]);

//   const checkWishlistStatus = async () => {
//     try {
//       const response = await wishlistAPI.checkWishlist(productId);
//       setIsInWishlist(response.inWishlist);
//     } catch (error: any) {
//       // User might not be logged in
//       console.error('Error checking wishlist:', error);
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   const handleToggleWishlist = async () => {
//     setIsLoading(true);

//     try {
//       const response = await wishlistAPI.toggleWishlist(productId);
      
//       setIsInWishlist(response.action === 'added');
      
//       toast.success(response.message, {
//         icon: response.action === 'added' ? '❤️' : '💔',
//       });
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Failed to update wishlist';
      
//       if (error.response?.status === 401) {
//         toast.error('Please login to add items to wishlist');
//       } else {
//         toast.error(errorMessage);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isChecking) {
//     return (
//       <button
//         disabled
//         className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${className}`}
//       >
//         <Heart className="h-5 w-5 animate-pulse text-gray-400" />
//         {showText && <span className="text-sm">Loading...</span>}
//       </button>
//     );
//   }

//   return (
//     <button
//       onClick={handleToggleWishlist}
//       disabled={isLoading}
//       className={`flex items-center gap-2 rounded-lg p-2 transition-all hover:scale-105 ${
//         isInWishlist
//           ? 'text-red-500 hover:text-red-600'
//           : 'text-gray-400 hover:text-red-500'
//       } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
//       title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
//     >
//       <Heart
//         className={`h-5 w-5 transition-all ${
//           isInWishlist ? 'fill-current' : ''
//         }`}
//       />
//       {showText && (
//         <span className="text-sm font-medium">
//           {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
//         </span>
//       )}
//     </button>
//   );
// }




// src/components/WishlistButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { wishlistAPI } from '@/lib/api/wishlist';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // Optional: To check login status faster

interface WishlistButtonProps {
  productId: string;
  className?: string;
  showText?: boolean;
}

export default function WishlistButton({
  productId,
  className = '',
  showText = false,
}: WishlistButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Helps avoid checking API if not logged in
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // 1. Check Initial Status on Mount
  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      if (!isAuthenticated) {
        if (isMounted) setIsChecking(false);
        return;
      }

      try {
        const response = await wishlistAPI.checkWishlist(productId);
        if (isMounted) setIsInWishlist(response.inWishlist);
      } catch (error) {
        console.error("Wishlist check failed", error);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkStatus();

    return () => { isMounted = false; };
  }, [productId, isAuthenticated]);

  // 2. Handle Click (Toggle)
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation to product page
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    
    // Optimistic UI Update (Immediate feedback)
    const previousState = isInWishlist;
    setIsInWishlist(!previousState);

    try {
      const response = await wishlistAPI.toggleWishlist(productId);
      
      // ✅ Correctly using backend response data
      if (response.success) {
        setIsInWishlist(response.action === 'added');
        toast.success(response.message, {
          icon: response.action === 'added' ? '❤️' : '💔',
          duration: 2000,
        });
      }
    } catch (error: any) {
      // Revert if error
      setIsInWishlist(previousState);
      
      const msg = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-full h-10 w-10 ${className}`} />
    );
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`group flex items-center gap-2 transition-all active:scale-95 ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <div className={`p-2 rounded-full transition-colors ${
        isInWishlist 
          ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400' 
          : 'bg-white dark:bg-black/40 text-gray-400 hover:text-red-500 dark:text-white dark:hover:text-red-400 hover:bg-gray-50'
      }`}>
        <Heart
          className={`h-6 w-6 transition-all duration-300 ${
            isInWishlist ? 'fill-current scale-110' : 'group-hover:scale-110'
          }`}
        />
      </div>
      
      {showText && (
        <span className={`text-sm font-medium transition-colors ${
          isInWishlist ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 group-hover:text-red-500'
        }`}>
          {isInWishlist ? 'Saved' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}