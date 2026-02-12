// "use client";

// import { useEffect, useState } from "react";
// import ChatComponent from "@/components/ChatComponent";
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import { getAccessToken } from "@/services/apiClient";

// export default function ChatPage() {
//   const { user, loading, isAuthenticated } = useAuth();
//   const [token, setToken] = useState(null);
//   const router = useRouter();
//   console.log("ashok", user);

//   useEffect(() => {
//     if (!loading) {
//       if (!isAuthenticated || !user) {
//         router.push("/login");
//       } else {
//         const currentToken = getAccessToken();
//         setToken(currentToken);
//       }
//     }
//   }, [user, loading, isAuthenticated, router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!user || !token) {
//     return null;
//   }

//   // Admin ID
//   const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;

//   return (
//     <div className="h-[calc(100vh-80px)] bg-gray-100 box-border">
//       <ChatComponent
//         currentUserId={user._id}
//         otherUserId={adminId}
//         otherUserModel="Admin"
//         token={token}
//         apiUrl={process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"}
//       />
//     </div>
//   );
// }

"use client";

import ChatComponent from "@/components/ChatComponent";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // Admin ID
  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-100 box-border">
      <ChatComponent
        currentUserId={user.id} // Check if your user object has _id or id
        otherUserId={adminId}
        otherUserModel="Admin"
      />
    </div>
  );
}
