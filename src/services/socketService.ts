// import { io, Socket } from "socket.io-client";
// import { getAccessToken } from "./apiClient";

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// class SocketService {
//   private socket: Socket | null = null;
//   private initialized = false;

//   connect() {
//     const token = getAccessToken();
//     if (!token) return;

//     if (!this.socket) {
//       this.socket = io(SOCKET_URL, {
//         autoConnect: false,
//         transports: ["websocket"],
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 2000,
//         auth: { token },
//       });

//       this.registerCoreEvents();
//     }

//     if (!this.socket.connected) {
//       this.socket.auth = { token };
//       this.socket.connect();
//     }
//   }

//   private registerCoreEvents() {
//     if (!this.socket || this.initialized) return;
//     this.initialized = true;

//     this.socket.on("connect", () => {
//       console.log("✅ Socket connected:", this.socket?.id);
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//     });

//     this.socket.on("connect_error", (err) => {
//       console.error("Socket error:", err.message);
//     });
//   }

//   // ---------------- Events ----------------
//   onOrderPlaced(cb: (data: any) => void) {
//     this.socket?.on("order_placed", cb);
//   }

//   onOrderStatusUpdated(cb: (data: any) => void) {
//     this.socket?.on("order_status_updated", cb);
//   }

//   onOrderCancelled(cb: (data: any) => void) {
//     this.socket?.on("order_cancelled", cb);
//   }

//   onPaymentSuccess(cb: (data: any) => void) {
//     this.socket?.on("payment_success", cb);
//   }

//   onPaymentFailed(cb: (data: any) => void) {
//     this.socket?.on("payment_failed", cb);
//   }

//   onNewOrder(cb: (data: any) => void) {
//     this.socket?.on("new_order", cb);
//   }

//   onDashboardUpdate(cb: (data: any) => void) {
//     this.socket?.on("dashboard_update_requested", cb);
//   }

//   // ------------- Rooms ----------------
//   joinOrderRoom(orderId: string) {
//     this.socket?.emit("join_order_room", orderId);
//   }

//   leaveOrderRoom(orderId: string) {
//     this.socket?.emit("leave_order_room", orderId);
//   }

//   requestDashboardUpdate() {
//     this.socket?.emit("request_dashboard_update");
//   }

//   // ------------- Cleanup ----------------
//   disconnect() {
//     if (this.socket?.connected) {
//       this.socket.off();
//       this.socket.disconnect();
//       console.log("Socket disconnected manually");
//     }
//   }

//   isConnected() {
//     return !!this.socket?.connected;
//   }
// }

// export default new SocketService();

import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./apiClient"; // మీ apiClient పాత్

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

class SocketService {
  public socket: Socket | null = null;
  private isConnecting = false;

  // ================= CONNECTION =================
  connect() {
    const token = getAccessToken();

    // టోకెన్ లేకపోతే కనెక్ట్ అవ్వద్దు
    if (!token) {
      console.warn("⚠️ SocketService: No token found, skipping connection.");
      return;
    }

    // ఆల్రెడీ కనెక్ట్ అయి ఉంటే మళ్ళీ చేయద్దు
    if (this.socket?.connected) return;

    // కనెక్షన్ ప్రాసెస్ లో ఉంటే ఆపేయ్
    if (this.isConnecting) return;
    this.isConnecting = true;

    // ఒకవేళ పాత సాకెట్ ఇన్స్టాన్స్ ఉంటే, దాన్ని రీయూజ్ చెయ్ లేదా కొత్తది క్రియేట్ చెయ్
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: { token }, // ఇనిషియల్ టోకెన్
        transports: ["websocket", "polling"], // Polling Fallback మంచిది
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.registerCoreEvents();
    } else {
      // ఉన్న సాకెట్ కి కొత్త టోకెన్ అప్డేట్ చెయ్ (ముఖ్యం!)
      this.socket.auth = { token };
    }

    // కనెక్ట్ చేయి
    this.socket.connect();
    this.isConnecting = false;
  }

  // ================= CORE EVENTS =================
  private registerCoreEvents() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Socket Connected:", this.socket?.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket Disconnected:", reason);
      if (reason === "io server disconnect") {
        // సర్వర్ కావాలని డిస్కనెక్ట్ చేస్తే (ఉదా: టోకెన్ ఎక్స్‌పైర్), మళ్ళీ కనెక్ట్ అవ్వకూడదు
        this.socket?.disconnect();
      }
    });
  }

  // ================= CLEAN DISCONNECT (Logout) =================
  disconnect() {
    if (this.socket) {
      console.log("🛑 Socket Disconnecting Manually...");
      this.socket.removeAllListeners(); // అన్ని లిజనర్స్ తీసేయ్
      this.socket.disconnect();
      this.socket = null; // మెమరీ క్లియర్ చెయ్
      this.isConnecting = false;
    }
  }

  // ================= GENERIC METHODS (For Chat & Orders) =================

  // ఈవెంట్ లిజనర్ (Cleanup Function ని రిటర్న్ చేస్తుంది)
  // React useEffect లో వాడటానికి ఇది చాలా ముఖ్యం!
  on(event: string, callback: (data: any) => void) {
    if (!this.socket) return () => {};

    this.socket.on(event, callback);

    // Unsubscribe function
    return () => {
      this.socket?.off(event, callback);
    };
  }

  emit(event: string, data: any = {}) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit '${event}': Socket not connected`);
    }
  }

  // ================= SPECIFIC WRAPPERS (Optional) =================

  // Chat Room Joining
  joinRoom(roomId: string) {
    this.emit("join_room", { roomId });
  }

  leaveRoom(roomId: string) {
    this.emit("leave_room", { roomId });
  }

  // Order Updates
  onOrderStatusUpdated(cb: (data: any) => void) {
    return this.on("order_status_updated", cb);
  }
}

// Singleton Instance
export default new SocketService();
