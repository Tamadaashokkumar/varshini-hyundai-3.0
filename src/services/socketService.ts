// import { io, Socket } from "socket.io-client";

// const SOCKET_URL =
//   process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// class SocketService {
//   public socket: Socket | null = null;
//   private isConnecting = false;

//   // ================= CONNECTION =================
//   connect() {
//     if (this.socket?.connected) return;

//     // ఒకవేళ ఆల్రెడీ ఇనిషియలైజ్ అయ్యి, కనెక్ట్ అవుతూ ఉంటే ఆగిపో
//     if (this.socket && this.isConnecting) return;

//     this.isConnecting = true;

//     if (!this.socket) {
//       this.socket = io(SOCKET_URL, {
//         withCredentials: true, // 🔥 Cookies పంపడానికి ఇది ముఖ్యం
//         transports: ["websocket", "polling"],
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//         autoConnect: false, // మనం కింద మాన్యువల్ గా కనెక్ట్ చేస్తాం
//         query: {
//           clientType: "customer",
//         },
//       });

//       this.registerCoreEvents();
//     }

//     this.socket.connect();
//   }

//   // ================= CORE EVENTS =================
//   private registerCoreEvents() {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("✅ Customer Socket Connected:", this.socket?.id);
//       this.isConnecting = false;
//     });

//     this.socket.on("connect_error", (err) => {
//       console.error("❌ Socket Connection Error:", err.message);
//       this.isConnecting = false;
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.warn("⚠️ Socket Disconnected:", reason);
//       this.isConnecting = false;

//       if (reason === "io server disconnect") {
//         // సర్వర్ కావాలని డిస్కనెక్ట్ చేస్తే (ఉదా: Logout), ఆబ్జెక్ట్ ని క్లియర్ చేయాలి
//         this.socket = null;
//       }
//     });
//   }

//   // ================= CLEAN DISCONNECT =================
//   disconnect() {
//     if (this.socket) {
//       console.log("🛑 Socket Disconnecting Manually...");
//       this.socket.removeAllListeners(); // ⚠️ మెమరీ లీక్స్ రాకుండా క్లీన్ చేయడం
//       this.socket.disconnect();
//       this.socket = null;
//       this.isConnecting = false;
//     }
//   }

//   // ================= GENERIC METHODS =================

//   /**
//    * ఈవెంట్ లిజనర్ (Updated: setTimeout తీసేసాను)
//    */
//   on(event: string, callback: (data: any) => void) {
//     if (!this.socket) {
//       this.connect();
//     }

//     // 🔥 FIX: setTimeout అవసరం లేదు. socket ఆబ్జెక్ట్ ఉంటే చాలు లిజనర్ యాడ్ చేయొచ్చు.
//     // ఇది వెంటనే రిజిస్టర్ అవుతుంది.
//     this.socket?.on(event, callback);

//     // Cleanup function (useEffect కోసం)
//     return () => {
//       this.socket?.off(event, callback);
//     };
//   }

//   /**
//    * డేటా పంపడానికి (Updated: Buffer Logic)
//    */
//   emit(event: string, data: any = {}) {
//     if (!this.socket) {
//       this.connect();
//     }

//     // 🔥 FIX: connected చెక్ తీసేసాను.
//     // సాకెట్ రీ-కనెక్ట్ అవుతున్నా సరే, ఈ మెసేజ్ క్యూలో ఉండి, కనెక్ట్ అవ్వగానే వెళ్తుంది.
//     this.socket?.emit(event, data);
//   }

//   // ================= SPECIFIC WRAPPERS =================

//   joinRoom(roomId: string) {
//     this.emit("join_room", { roomId });
//   }

//   leaveRoom(roomId: string) {
//     this.emit("leave_room", { roomId });
//   }
// }

// // Singleton Instance
// export default new SocketService();

import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

class SocketService {
  public socket: Socket | null = null;
  private isConnecting = false;

  // ================= CONNECTION =================
  connect() {
    if (this.socket?.connected) return;

    // ఒకవేళ ఆల్రెడీ ఇనిషియలైజ్ అయ్యి, కనెక్ట్ అవుతూ ఉంటే ఆగిపో
    if (this.socket && this.isConnecting) return;

    this.isConnecting = true;

    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true, // 🔥 Cookies పంపడానికి ఇది ముఖ్యం
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false, // మనం కింద మాన్యువల్ గా కనెక్ట్ చేస్తాం
        query: {
          clientType: "customer",
        },
      });

      this.registerCoreEvents();
    }

    this.socket.connect();
  }

  // ================= CORE EVENTS =================
  private registerCoreEvents() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Customer Socket Connected:", this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket Disconnected:", reason);
      this.isConnecting = false;

      if (reason === "io server disconnect") {
        // సర్వర్ కావాలని డిస్కనెక్ట్ చేస్తే (ఉదా: Logout), ఆబ్జెక్ట్ ని క్లియర్ చేయాలి
        this.socket = null;
      }
    });
  }

  // ================= CLEAN DISCONNECT =================
  disconnect() {
    if (this.socket) {
      console.log("🛑 Socket Disconnecting Manually...");
      this.socket.removeAllListeners(); // ⚠️ మెమరీ లీక్స్ రాకుండా క్లీన్ చేయడం
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  // ================= GENERIC METHODS =================

  /**
   * ఈవెంట్ లిజనర్ (Returns Cleanup Function for useEffect)
   */
  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      this.connect();
    }

    // లిజనర్ రిజిస్టర్ చేయడం
    this.socket?.on(event, callback);

    // Cleanup function (useEffect లో return చేయడానికి పనికొస్తుంది)
    return () => {
      this.socket?.off(event, callback);
    };
  }

  /**
   * డేటా పంపడానికి
   */
  emit(event: string, data: any = {}) {
    if (!this.socket) {
      this.connect();
    }
    // సాకెట్ రీ-కనెక్ట్ అవుతున్నా సరే, ఈ మెసేజ్ క్యూలో ఉండి, కనెక్ట్ అవ్వగానే వెళ్తుంది.
    this.socket?.emit(event, data);
  }

  // ================= SPECIFIC WRAPPERS (THE FIX) =================

  joinRoom(roomId: string) {
    this.emit("join_room", { roomId });
  }

  leaveRoom(roomId: string) {
    this.emit("leave_room", { roomId });
  }

  /**
   * 🔥 FIX: Order Status Update Listener
   * మీ పేజీలో ఈ మెథడ్ ని వాడుతున్నారు కాబట్టి ఇది ఇక్కడ ఉండాలి.
   */
  onOrderStatusUpdated(callback: (data: any) => void) {
    return this.on("orderStatusUpdated", callback);
  }
}

// Singleton Instance
const socketService = new SocketService();
export default socketService;
