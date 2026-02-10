import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./apiClient";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;
  private initialized = false;

  connect() {
    const token = getAccessToken();
    if (!token) return;

    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: false,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        auth: { token },
      });

      this.registerCoreEvents();
    }

    if (!this.socket.connected) {
      this.socket.auth = { token };
      this.socket.connect();
    }
  }

  private registerCoreEvents() {
    if (!this.socket || this.initialized) return;
    this.initialized = true;

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });
  }

  // ---------------- Events ----------------
  onOrderPlaced(cb: (data: any) => void) {
    this.socket?.on("order_placed", cb);
  }

  onOrderStatusUpdated(cb: (data: any) => void) {
    this.socket?.on("order_status_updated", cb);
  }

  onOrderCancelled(cb: (data: any) => void) {
    this.socket?.on("order_cancelled", cb);
  }

  onPaymentSuccess(cb: (data: any) => void) {
    this.socket?.on("payment_success", cb);
  }

  onPaymentFailed(cb: (data: any) => void) {
    this.socket?.on("payment_failed", cb);
  }

  onNewOrder(cb: (data: any) => void) {
    this.socket?.on("new_order", cb);
  }

  onDashboardUpdate(cb: (data: any) => void) {
    this.socket?.on("dashboard_update_requested", cb);
  }

  // ------------- Rooms ----------------
  joinOrderRoom(orderId: string) {
    this.socket?.emit("join_order_room", orderId);
  }

  leaveOrderRoom(orderId: string) {
    this.socket?.emit("leave_order_room", orderId);
  }

  requestDashboardUpdate() {
    this.socket?.emit("request_dashboard_update");
  }

  // ------------- Cleanup ----------------
  disconnect() {
    if (this.socket?.connected) {
      this.socket.off();
      this.socket.disconnect();
      console.log("Socket disconnected manually");
    }
  }

  isConnected() {
    return !!this.socket?.connected;
  }
}

export default new SocketService();
