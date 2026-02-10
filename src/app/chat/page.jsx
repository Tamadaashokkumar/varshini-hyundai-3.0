// "use client";

// import { useEffect, useState } from "react";
// import ChatComponent from "@/components/ChatComponent";
// import Cookies from "js-cookie";

// export default function ChatPage() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get user info and token from localStorage or your auth context
//     const storedToken = Cookies.get("accessToken");
//     const storedUser = Cookies.get("user");
//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setCurrentUser(storedUser);
//     }

//     setLoading(false);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   if (!token || !currentUser) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">
//             Please login to access chat
//           </h2>
//           <a
//             href="/login"
//             className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
//           >
//             Go to Login
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // For customer chatting with admin
//   // Replace with actual admin ID from your system
//   const adminId = "694673ed8eac361b130a1b5d";

//   return (
//     <div className="pt-0 pb-0 h-screen bg-gray-100 box-border">
//       <ChatComponent
//         currentUserId={currentUser}
//         otherUserId={adminId}
//         otherUserModel="Admin"
//         token={token}
//         apiUrl={process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import ChatComponent from "@/components/ChatComponent";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/services/apiClient";

export default function ChatPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [token, setToken] = useState(null);
  const router = useRouter();
  console.log("ashok", user);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.push("/login");
      } else {
        const currentToken = getAccessToken();
        setToken(currentToken);
      }
    }
  }, [user, loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  // Admin ID
  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-100 box-border">
      <ChatComponent
        currentUserId={user._id}
        otherUserId={adminId}
        otherUserModel="Admin"
        token={token}
        apiUrl={process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"}
      />
    </div>
  );
}
