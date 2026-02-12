// "use client";

// import { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import Link from "next/link";
// import {
//   Send,
//   Paperclip,
//   X,
//   Image as ImageIcon,
//   Video,
//   MoreVertical,
//   ArrowLeft,
//   Loader2,
//   Check,
//   CheckCheck,
//   Moon,
//   Sun,
//   Volume2,
//   VolumeX,
//   MessageSquareDashed,
//   Mic,
//   StopCircle,
//   FileAudio,
//   Edit2,
//   Trash2,
//   CornerUpLeft,
//   AlertTriangle,
//   Maximize2, // New icon for image view
// } from "lucide-react";

// // --- SOUND ASSETS ---
// const SEND_SOUND_URL = "/sounds/message-send.mp3";
// const RECEIVE_SOUND_URL = "/sounds/message-receive.mp3";

// export default function ChatComponent({
//   currentUserId,
//   otherUserId,
//   otherUserModel = "Admin",
//   token,
//   apiUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
// }) {
//   // --- STATE ---
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [otherUserTyping, setOtherUserTyping] = useState(false);
//   const [onlineStatus, setOnlineStatus] = useState("offline");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // --- FEATURES STATE ---
//   const [previewImage, setPreviewImage] = useState(null);
//   const [captionText, setCaptionText] = useState("");
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [activeMenuId, setActiveMenuId] = useState(null);

//   // 🔥 NEW: Image Expansion State (For viewing images in same page)
//   const [expandedImage, setExpandedImage] = useState(null);

//   // Delete Confirmation State
//   const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

//   // Voice Recording State
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);

//   const [otherUserInfo, setOtherUserInfo] = useState({
//     name: otherUserModel,
//     profilePicture: null,
//   });

//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [isSoundEnabled, setIsSoundEnabled] = useState(true);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(true);

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const audioSendRef = useRef(null);
//   const audioReceiveRef = useRef(null);

//   // Room ID Logic
//   const roomId = [currentUserId, otherUserId].sort().join("_");

//   // --- THEME & SOUND ---
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("chat_theme");
//     if (savedTheme) {
//       setIsDarkMode(savedTheme === "dark");
//     }
//     if (typeof window !== "undefined") {
//       audioSendRef.current = new Audio(SEND_SOUND_URL);
//       audioReceiveRef.current = new Audio(RECEIVE_SOUND_URL);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
//   };

//   const playSound = (type) => {
//     if (!isSoundEnabled) return;
//     try {
//       if (type === "send" && audioSendRef.current) {
//         audioSendRef.current.currentTime = 0;
//         audioSendRef.current.play().catch(() => {});
//       } else if (type === "receive" && audioReceiveRef.current) {
//         audioReceiveRef.current.currentTime = 0;
//         audioReceiveRef.current.play().catch(() => {});
//       }
//     } catch (e) {}
//   };

//   // --- AUTO SCROLL ---
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, otherUserTyping, selectedFile]);

//   // --- SOCKET ---
//   useEffect(() => {
//     if (!token || !currentUserId || !otherUserId) return;

//     const socketUrl = apiUrl.replace("/api", "");
//     const newSocket = io(socketUrl, {
//       auth: { token },
//       withCredentials: true,
//       transports: ["websocket", "polling"],
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       newSocket.emit("join_room", { roomId });
//       newSocket.emit("check_online_status", { userId: otherUserId });
//       fetchChatHistory();
//     });

//     newSocket.on("is_user_online_response", (data) => {
//       if (String(data.userId) === String(otherUserId)) {
//         setOnlineStatus(data.isOnline ? "online" : "offline");
//       }
//     });

//     newSocket.on("user_status_update", (data) => {
//       if (String(data.userId) === String(otherUserId)) {
//         setOnlineStatus(data.isOnline ? "online" : "offline");
//       }
//     });

//     newSocket.on("receive_message", (message) => {
//       if (message.roomId === roomId) {
//         setMessages((prev) => {
//           if (prev.some((m) => m._id === message._id)) return prev;
//           const senderId = message.senderId?._id || message.senderId;
//           if (senderId !== currentUserId) {
//             playSound("receive");
//             newSocket.emit("mark_read", { messageId: message._id, roomId });
//           }
//           return [...prev, message];
//         });
//       }
//     });

//     // --- EVENTS ---
//     newSocket.on("message_updated", (updatedMsg) => {
//       if (updatedMsg.roomId === roomId) {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg._id === updatedMsg._id
//               ? { ...msg, text: updatedMsg.text, isEdited: true }
//               : msg,
//           ),
//         );
//       }
//     });

//     newSocket.on("message_deleted", (data) => {
//       if (data.roomId === roomId) {
//         setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
//       }
//     });

//     newSocket.on("display_typing", (data) => {
//       if (data.userId === otherUserId && data.roomId === roomId) {
//         setOtherUserTyping(true);
//       }
//     });

//     newSocket.on("hide_typing", (data) => {
//       if (data.userId === otherUserId && data.roomId === roomId) {
//         setOtherUserTyping(false);
//       }
//     });

//     newSocket.on("message_read", (data) => {
//       if (data.roomId === roomId) {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg._id === data.messageId ? { ...msg, isRead: true } : msg,
//           ),
//         );
//       }
//     });

//     return () => {
//       newSocket.off("receive_message");
//       newSocket.off("display_typing");
//       newSocket.off("hide_typing");
//       newSocket.off("user_status_update");
//       newSocket.off("message_read");
//       newSocket.off("message_updated");
//       newSocket.off("message_deleted");

//       newSocket.emit("leave_room", { roomId });
//       newSocket.disconnect();
//     };
//   }, [currentUserId, otherUserId, token, roomId, apiUrl]);

//   // --- API ---
//   const fetchChatHistory = async () => {
//     setIsLoadingHistory(true);
//     try {
//       const res = await axios.get(`${apiUrl}/api/chat/history/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) {
//         let historyData = res.data.data?.messages || [];
//         historyData.sort(
//           (a, b) =>
//             new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
//         );
//         setMessages(historyData);
//         socketService.emit("mark_read", { roomId });
//       }
//     } catch (error) {
//       console.error("Failed to fetch history", error);
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   };

//   const uploadFile = async (fileToUpload) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", fileToUpload);

//     try {
//       const res = await axios.post(`${apiUrl}/api/chat/upload`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (res.data.success) return res.data.data;
//     } catch (error) {
//       alert("File upload failed.");
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   const sendMessage = async (fileData = null, captionOverride = null) => {
//     const textToSend = captionOverride !== null ? captionOverride : inputText;

//     if (!fileData && !textToSend.trim()) return;

//     if (editingMessageId && !fileData) {
//       socketService.emit("edit_message", {
//         roomId,
//         messageId: editingMessageId,
//         newText: textToSend,
//       });
//       setMessages((prev) =>
//         prev.map((m) =>
//           m._id === editingMessageId
//             ? { ...m, text: textToSend, isEdited: true }
//             : m,
//         ),
//       );
//       setEditingMessageId(null);
//       setInputText("");
//       return;
//     }

//     const msgType = fileData ? fileData.fileType : "text";
//     const messagePayload = {
//       roomId,
//       receiverId: otherUserId,
//       receiverModel: otherUserModel,
//       text: textToSend || "",
//       messageType: msgType,
//       fileUrl: fileData ? fileData.fileUrl : null,
//       fileName: fileData ? fileData.fileName : null,
//       fileSize: fileData ? fileData.fileSize : null,
//       tempId: Date.now(),
//     };

//     socketService.emit("send_message", messagePayload);
//     playSound("send");

//     if (!fileData) setInputText("");
//     setPreviewImage(null);
//     setCaptionText("");
//     setSelectedFile(null);
//     socketService.emit("stop_typing", { roomId });
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       if (file.type.startsWith("image/")) {
//         const url = URL.createObjectURL(file);
//         setPreviewImage(url);
//       }
//     }
//   };

//   const handleFileSend = async () => {
//     if (!selectedFile) return;
//     const fileData = await uploadFile(selectedFile);
//     if (fileData) {
//       if (selectedFile.type.startsWith("audio/")) fileData.fileType = "audio";
//       await sendMessage(fileData, captionText);
//     }
//   };

//   const cancelPreview = () => {
//     setSelectedFile(null);
//     setPreviewImage(null);
//     setCaptionText("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // --- ACTIONS ---
//   const handleEditClick = (msg) => {
//     setInputText(msg.text);
//     setEditingMessageId(msg._id);
//     setActiveMenuId(null);
//     fileInputRef.current?.focus();
//   };

//   const handleCancelEdit = () => {
//     setEditingMessageId(null);
//     setInputText("");
//   };

//   const handleDeleteTrigger = (msgId) => {
//     setDeleteConfirmationId(msgId);
//     setActiveMenuId(null);
//   };

//   const confirmDelete = () => {
//     if (deleteConfirmationId) {
//       socketService.emit("delete_message", {
//         roomId,
//         messageId: deleteConfirmationId,
//       });
//       setMessages((prev) => prev.filter((m) => m._id !== deleteConfirmationId));
//       setDeleteConfirmationId(null);
//     }
//   };

//   const handleTyping = () => {
//     if (!typingTimeoutRef.current) socketService.emit("typing", { roomId });
//     clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//       socketService.emit("stop_typing", { roomId });
//       typingTimeoutRef.current = null;
//     }, 800);
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       let chunks = [];
//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) chunks.push(e.data);
//       };
//       recorder.onstop = async () => {
//         const audioBlob = new Blob(chunks, { type: "audio/webm" });
//         const audioFile = new File([audioBlob], "voice_note.webm", {
//           type: "audio/webm",
//         });
//         const fileData = await uploadFile(audioFile);
//         if (fileData) {
//           fileData.fileType = "audio";
//           sendMessage(fileData);
//         }
//       };
//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);
//     } catch (err) {
//       alert("Microphone access denied.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && isRecording) {
//       mediaRecorder.stop();
//       mediaRecorder.stream.getTracks().forEach((track) => track.stop());
//       setIsRecording(false);
//       setMediaRecorder(null);
//     }
//   };

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   return (
//     <div
//       className={`fixed inset-0 z-50 md:static md:w-full md:h-screen md:flex md:items-center md:justify-center font-sans overflow-hidden transition-colors duration-500 ${
//         isDarkMode
//           ? "bg-slate-950 text-slate-100"
//           : "bg-slate-50 text-slate-900"
//       }`}
//     >
//       {/* 🌌 Ambient Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
//         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
//       </div>

//       {/* --- IMAGE UPLOAD PREVIEW MODAL --- */}
//       <AnimatePresence>
//         {previewImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
//           >
//             <div
//               className={`w-full max-w-lg rounded-2xl overflow-hidden flex flex-col shadow-2xl ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
//             >
//               <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
//                 <h3 className="font-semibold">Preview</h3>
//                 <button
//                   onClick={cancelPreview}
//                   className="p-2 hover:bg-white/10 rounded-full"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="flex-1 bg-black flex items-center justify-center p-2 min-h-[300px]">
//                 <img
//                   src={previewImage}
//                   alt="Preview"
//                   className="max-h-[60vh] object-contain rounded-lg"
//                 />
//               </div>
//               <div className="p-4 space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Add a caption..."
//                   value={captionText}
//                   onChange={(e) => setCaptionText(e.target.value)}
//                   className={`w-full p-3 rounded-xl outline-none border transition-all ${
//                     isDarkMode
//                       ? "bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
//                       : "bg-gray-50 border-gray-200 focus:border-blue-500 text-slate-900"
//                   }`}
//                 />
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={handleFileSend}
//                     disabled={uploading}
//                     className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all"
//                   >
//                     {uploading ? (
//                       <Loader2 className="animate-spin" size={18} />
//                     ) : (
//                       <Send size={18} />
//                     )}
//                     {uploading ? "Sending..." : "Send"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🔥 NEW: FULL SCREEN IMAGE VIEWER MODAL 🔥 */}
//       <AnimatePresence>
//         {expandedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
//             onClick={() => setExpandedImage(null)}
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setExpandedImage(null)}
//               className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
//             >
//               <X size={28} />
//             </button>

//             {/* Image Container */}
//             <motion.div
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               className="relative w-full h-full flex items-center justify-center"
//               onClick={(e) => e.stopPropagation()} // Prevent close on image click
//             >
//               <img
//                 src={expandedImage}
//                 alt="Full View"
//                 className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* DELETE CONFIRMATION MODAL */}
//       <AnimatePresence>
//         {deleteConfirmationId && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl border flex flex-col items-center text-center ${
//                 isDarkMode
//                   ? "bg-slate-900 border-white/10"
//                   : "bg-white border-white/60"
//               }`}
//             >
//               <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
//                 <Trash2 size={32} />
//               </div>
//               <h3 className="text-xl font-bold mb-2">Delete Message?</h3>
//               <p
//                 className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//               >
//                 Are you sure you want to delete this message? This action cannot
//                 be undone.
//               </p>
//               <div className="flex gap-3 w-full">
//                 <button
//                   onClick={() => setDeleteConfirmationId(null)}
//                   className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
//                     isDarkMode
//                       ? "bg-slate-800 hover:bg-slate-700 text-white"
//                       : "bg-gray-100 hover:bg-gray-200 text-slate-700"
//                   }`}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="flex-1 py-3 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Chat Card */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className={`flex flex-col w-full h-full md:flex-none md:w-[900px] md:h-[650px] relative md:rounded-[2rem] md:shadow-2xl overflow-hidden border transition-all duration-300 ${
//           isDarkMode
//             ? "bg-slate-900/60 backdrop-blur-2xl border-white/10"
//             : "bg-white/80 backdrop-blur-xl border-white/60 shadow-blue-200/20"
//         }`}
//       >
//         {/* --- HEADER --- */}
//         <div
//           className={`h-20 px-6 flex items-center justify-between border-b z-20 transition-colors ${
//             isDarkMode
//               ? "border-white/5 bg-slate-900/50"
//               : "border-gray-100 bg-white/60"
//           }`}
//         >
//           <div className="flex items-center gap-4">
//             <Link href="/">
//               <button
//                 className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
//               >
//                 <ArrowLeft size={20} />
//               </button>
//             </Link>

//             <div className="relative">
//               <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-blue-400 to-indigo-600">
//                 <div
//                   className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
//                 >
//                   <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
//                     {otherUserInfo.name.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//               {onlineStatus === "online" && (
//                 <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
//               )}
//             </div>

//             <div>
//               <h2 className="font-bold text-base leading-tight">
//                 Support Team
//               </h2>
//               <p
//                 className={`text-xs font-medium ${onlineStatus === "online" ? "text-emerald-500" : "text-slate-400"}`}
//               >
//                 {/* Updated to just show status, typing is shown in bubble now */}
//                 {onlineStatus === "online" ? "Online" : "Offline"}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setIsSoundEnabled(!isSoundEnabled)}
//               className={`p-2.5 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
//             >
//               {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
//             </button>
//             <button
//               onClick={toggleTheme}
//               className={`p-2.5 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-yellow-400" : "hover:bg-gray-100 text-slate-600"}`}
//             >
//               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
//           </div>
//         </div>

//         {/* --- MESSAGES AREA --- */}
//         <div
//           className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-none"
//           style={{
//             backgroundImage: isDarkMode
//               ? "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)"
//               : "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)",
//             backgroundSize: "24px 24px",
//           }}
//           onClick={() => setActiveMenuId(null)}
//         >
//           {isLoadingHistory ? (
//             <div className="flex justify-center py-10">
//               <Loader2 className="animate-spin text-blue-500" />
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full opacity-50">
//               <MessageSquareDashed size={48} className="mb-2 text-slate-400" />
//               <p className="text-sm">No messages yet. Say hello!</p>
//             </div>
//           ) : (
//             messages.map((msg, idx) => {
//               const isMe =
//                 msg.senderId === currentUserId ||
//                 msg.senderId?._id === currentUserId;
//               return (
//                 <motion.div
//                   key={idx}
//                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   className={`flex group relative ${isMe ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[75%] md:max-w-[60%] p-4 rounded-[20px] shadow-sm relative ${
//                       isMe
//                         ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-[4px]"
//                         : isDarkMode
//                           ? "bg-slate-800/80 backdrop-blur-md text-slate-200 border border-white/5 rounded-bl-[4px]"
//                           : "bg-white text-slate-800 border border-gray-100 rounded-bl-[4px]"
//                     }`}
//                   >
//                     {isMe && !msg.fileUrl && (
//                       <div className="absolute top-2 right-2 z-10">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setActiveMenuId(
//                               activeMenuId === msg._id ? null : msg._id,
//                             );
//                           }}
//                           className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
//                             activeMenuId === msg._id
//                               ? "opacity-100 bg-black/20"
//                               : "hover:bg-black/10"
//                           }`}
//                         >
//                           <MoreVertical size={14} className="text-white/80" />
//                         </button>

//                         {activeMenuId === msg._id && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className={`absolute right-0 top-6 w-32 rounded-lg shadow-xl overflow-hidden py-1 z-20 ${
//                               isDarkMode
//                                 ? "bg-slate-800 border border-slate-700"
//                                 : "bg-white border border-gray-100"
//                             }`}
//                           >
//                             <button
//                               onClick={() => handleEditClick(msg)}
//                               className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 ${
//                                 isDarkMode
//                                   ? "hover:bg-white/10 text-white"
//                                   : "hover:bg-gray-50 text-slate-700"
//                               }`}
//                             >
//                               <Edit2 size={12} /> Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteTrigger(msg._id)}
//                               className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-red-500 hover:bg-red-500/10"
//                             >
//                               <Trash2 size={12} /> Delete
//                             </button>
//                           </motion.div>
//                         )}
//                       </div>
//                     )}

//                     {msg.fileUrl && (
//                       <div className="mb-3 rounded-xl overflow-hidden bg-black/20">
//                         {msg.messageType === "image" ? (
//                           <div className="relative group/image">
//                             <img
//                               src={msg.fileUrl}
//                               alt="attachment"
//                               className="w-full max-h-[250px] object-cover cursor-pointer"
//                               // 🔥 MODIFIED: Click to open in same page modal
//                               onClick={() => setExpandedImage(msg.fileUrl)}
//                             />
//                             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
//                               <Maximize2 className="text-white/80" size={24} />
//                             </div>
//                           </div>
//                         ) : msg.messageType === "video" ? (
//                           <video
//                             src={msg.fileUrl}
//                             controls
//                             className="w-full max-h-[250px]"
//                           />
//                         ) : msg.messageType === "audio" ? (
//                           <div className="p-3 flex items-center gap-3 bg-black/10">
//                             <FileAudio size={24} />
//                             <audio
//                               src={msg.fileUrl}
//                               controls
//                               className="h-8 w-full"
//                             />
//                           </div>
//                         ) : null}
//                       </div>
//                     )}

//                     <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
//                       {msg.text}
//                       {msg.isEdited && (
//                         <span className="text-[10px] opacity-60 ml-1">
//                           (edited)
//                         </span>
//                       )}
//                     </p>

//                     <div
//                       className={`flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80 ${isMe ? "text-blue-100" : ""}`}
//                     >
//                       <span>{formatTime(msg.createdAt)}</span>
//                       {isMe &&
//                         (msg.isRead ? (
//                           <CheckCheck size={12} />
//                         ) : (
//                           <Check size={12} />
//                         ))}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })
//           )}

//           {/* 🔥 NEW: MODERN ANIMATED TYPING INDICATOR IN CHAT 🔥 */}
//           <AnimatePresence>
//             {otherUserTyping && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10, scale: 0.9 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="flex justify-start w-full"
//               >
//                 <div
//                   className={`px-4 py-3 rounded-[20px] rounded-bl-[4px] shadow-sm flex items-center gap-1.5 ${
//                     isDarkMode
//                       ? "bg-slate-800/80 border border-white/5"
//                       : "bg-white border border-gray-100"
//                   }`}
//                 >
//                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
//                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
//                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <div ref={messagesEndRef} />
//         </div>

//         {/* --- INPUT AREA --- */}
//         <div className="px-4 pb-3 pt-2 md:p-6 z-20 bg-transparent">
//           <AnimatePresence>
//             {selectedFile && !previewImage && (
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: 10, opacity: 0 }}
//                 className="absolute bottom-20 left-6 right-6 z-30"
//               >
//                 <div
//                   className={`flex items-center gap-3 p-3 rounded-2xl shadow-xl border ${isDarkMode ? "bg-slate-800 border-white/10" : "bg-white border-gray-100"}`}
//                 >
//                   <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
//                     <Paperclip size={20} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-xs opacity-60">
//                       {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setSelectedFile(null)}
//                     className="p-2 hover:bg-black/5 rounded-full"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {editingMessageId && (
//             <div
//               className={`mb-2 px-4 py-2 rounded-lg text-xs flex justify-between items-center ${isDarkMode ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-600"}`}
//             >
//               <span>Editing message...</span>
//               <button onClick={handleCancelEdit}>
//                 <X size={14} />
//               </button>
//             </div>
//           )}

//           <div
//             className={`flex items-center gap-2 p-1.5 rounded-[2rem] shadow-lg border relative transition-all ${
//               isDarkMode
//                 ? "bg-slate-800/80 border-white/10 shadow-black/40"
//                 : "bg-white/90 border-white/60 shadow-blue-500/10"
//             }`}
//           >
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileSelect}
//               className="hidden"
//               accept="image/*,video/*,audio/*"
//             />
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className={`p-3 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
//             >
//               <Paperclip size={20} />
//             </button>

//             <input
//               type="text"
//               value={inputText}
//               onChange={(e) => {
//                 setInputText(e.target.value);
//                 handleTyping();
//               }}
//               onKeyDown={(e) =>
//                 e.key === "Enter" && !e.shiftKey && sendMessage()
//               }
//               placeholder={isRecording ? "Recording..." : "Type a message..."}
//               disabled={uploading || isRecording}
//               className={`flex-1 bg-transparent border-none outline-none text-[15px] px-2 ${isDarkMode ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
//             />

//             {inputText.trim() || selectedFile ? (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() =>
//                   selectedFile ? handleFileSend() : sendMessage()
//                 }
//                 disabled={uploading}
//                 className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center"
//               >
//                 {uploading ? (
//                   <Loader2 size={20} className="animate-spin" />
//                 ) : editingMessageId ? (
//                   <Check size={20} className="ml-0.5" />
//                 ) : (
//                   <Send size={20} className="ml-0.5" />
//                 )}
//               </motion.button>
//             ) : (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={isRecording ? stopRecording : startRecording}
//                 className={`p-3 rounded-full flex items-center justify-center transition-all ${
//                   isRecording
//                     ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
//                     : isDarkMode
//                       ? "hover:bg-white/10 text-slate-400"
//                       : "hover:bg-gray-100 text-slate-500"
//                 }`}
//               >
//                 {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
//               </motion.button>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast"; // 🔥 NEW: Toast Import
import {
  Send,
  Paperclip,
  X,
  Image as ImageIcon,
  Video,
  MoreVertical,
  ArrowLeft,
  Loader2,
  Check,
  CheckCheck,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  MessageSquareDashed,
  Mic,
  StopCircle,
  FileAudio,
  Edit2,
  Trash2,
  CornerUpLeft,
  AlertTriangle,
  Maximize2,
  Clock, // New Icon for pending state
} from "lucide-react";

import socketService from "@/services/socketService";
import apiClient from "@/services/apiClient";

// --- SOUND ASSETS ---
const SEND_SOUND_URL = "/sounds/message-send.mp3";
const RECEIVE_SOUND_URL = "/sounds/message-receive.mp3";

const MESSAGES_PER_PAGE = 50; // 🔥 Pagination Limit

export default function ChatComponent({
  currentUserId,
  otherUserId,
  otherUserModel = "Admin",
  apiUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
}) {
  // --- STATE ---

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingOld, setIsFetchingOld] = useState(false);

  // --- FEATURES STATE ---
  const [previewImage, setPreviewImage] = useState(null);
  const [captionText, setCaptionText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [otherUserInfo, setOtherUserInfo] = useState({
    name: otherUserModel,
    profilePicture: null,
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null); // 🔥 For Scroll Tracking
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioSendRef = useRef(null);
  const audioReceiveRef = useRef(null);

  // Room ID Logic
  const roomId = [currentUserId, otherUserId].sort().join("_");

  console.log("rooooom Id ", roomId);

  // --- THEME & SOUND ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    if (typeof window !== "undefined") {
      audioSendRef.current = new Audio(SEND_SOUND_URL);
      audioReceiveRef.current = new Audio(RECEIVE_SOUND_URL);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
  };

  const playSound = (type) => {
    if (!isSoundEnabled) return;
    try {
      if (type === "send" && audioSendRef.current) {
        audioSendRef.current.currentTime = 0;
        audioSendRef.current.play().catch(() => {});
      } else if (type === "receive" && audioReceiveRef.current) {
        audioReceiveRef.current.currentTime = 0;
        audioReceiveRef.current.play().catch(() => {});
      }
    } catch (e) {}
  };

  // --- AUTO SCROLL (SMART) ---
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Scroll to bottom only on new messages, not when loading old history
  useEffect(() => {
    if (!isFetchingOld) {
      scrollToBottom();
    }
  }, [messages, otherUserTyping, selectedFile]);

  // 🔥 FIX 1: Fetch History Independently (Not dependent on socket connection)
  useEffect(() => {
    if (roomId) {
      fetchChatHistory(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // --- SOCKET CONNECTION ---
  // 👇 REPLACE YOUR OLD SOCKET useEffect WITH THIS:

  // useEffect(() => {
  //   if (!currentUserId || !otherUserId) return;

  //   // 1. Connect using Singleton Service
  //   socketService.connect();

  //   // 2. Join Room & Check Status
  //   socketService.emit("join_room", { roomId });
  //   socketService.emit("check_online_status", { userId: otherUserId });

  //   // 3. Register Listeners (capture unsubscribe functions)
  //   const unsubOnline = socketService.on("is_user_online_response", (data) => {
  //     if (String(data.userId) === String(otherUserId)) {
  //       setOnlineStatus(data.isOnline ? "online" : "offline");
  //     }
  //   });

  //   const unsubStatus = socketService.on("user_status_update", (data) => {
  //     if (String(data.userId) === String(otherUserId)) {
  //       setOnlineStatus(data.isOnline ? "online" : "offline");
  //     }
  //   });

  //   const unsubMsg = socketService.on("receive_message", (message) => {
  //     if (message.roomId === roomId) {
  //       setMessages((prev) => {
  //         const senderId = message.senderId?._id || message.senderId;
  //         const isMe = senderId === currentUserId;

  //         if (isMe) return prev;
  //         if (prev.some((m) => m._id === message._id)) return prev;

  //         playSound("receive");
  //         socketService.emit("mark_read", { messageId: message._id, roomId });
  //         return [...prev, message];
  //       });
  //     }
  //   });

  //   const unsubSent = socketService.on("message_sent", (data) => {
  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg.tempId === data.tempId
  //           ? { ...msg, _id: data.messageId, status: "sent" }
  //           : msg,
  //       ),
  //     );
  //   });

  //   const unsubUpdated = socketService.on("message_updated", (updatedMsg) => {
  //     if (updatedMsg.roomId === roomId) {
  //       setMessages((prev) =>
  //         prev.map((msg) =>
  //           msg._id === updatedMsg._id
  //             ? { ...msg, text: updatedMsg.text, isEdited: true }
  //             : msg,
  //         ),
  //       );
  //     }
  //   });

  //   const unsubDeleted = socketService.on("message_deleted", (data) => {
  //     if (data.roomId === roomId) {
  //       setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
  //     }
  //   });

  //   const unsubTyping = socketService.on("display_typing", (data) => {
  //     if (data.userId === otherUserId && data.roomId === roomId) {
  //       setOtherUserTyping(true);
  //     }
  //   });

  //   const unsubStopTyping = socketService.on("hide_typing", (data) => {
  //     if (data.userId === otherUserId && data.roomId === roomId) {
  //       setOtherUserTyping(false);
  //     }
  //   });

  //   const unsubRead = socketService.on("message_read", (data) => {
  //     if (data.roomId === roomId) {
  //       setMessages((prev) =>
  //         prev.map((msg) =>
  //           msg._id === data.messageId ? { ...msg, isRead: true } : msg,
  //         ),
  //       );
  //     }
  //   });

  //   // 4. Cleanup Function
  //   return () => {
  //     // Unsubscribe all listeners
  //     unsubOnline();
  //     unsubStatus();
  //     unsubMsg();
  //     unsubSent();
  //     unsubUpdated();
  //     unsubDeleted();
  //     unsubTyping();
  //     unsubStopTyping();
  //     unsubRead();

  //     // Leave Room
  //     socketService.emit("leave_room", { roomId });
  //   };
  // }, [currentUserId, otherUserId, roomId]);

  // --- SOCKET CONNECTION & STATUS CHECK ---
  useEffect(() => {
    if (!currentUserId || !otherUserId || !roomId) return;

    console.log("🧑‍💻 My ID:", currentUserId);
    console.log("🕵️ Looking for Admin ID:", otherUserId);

    // 1. సాకెట్ కనెక్ట్ చేయండి
    socketService.connect();

    // 2. అడ్మిన్ స్టేటస్ చెక్ చేసే ఫంక్షన్
    const checkStatus = () => {
      console.log("📡 Checking Admin Online Status...");
      socketService.emit("check_online_status", { userId: otherUserId });
    };

    // సాకెట్ కనెక్ట్ అవ్వగానే ఒకసారి అడగాలి
    if (socketService.socket?.connected) {
      checkStatus();
    }
    const unsubConn = socketService.on("connect", checkStatus);

    // 3. రూమ్ లో జాయిన్ అవ్వడం
    socketService.emit("join_room", { roomId });

    // 4. ఇవెంట్ లిజనర్స్ (Listeners)

    // అడ్మిన్ స్టేటస్ క్వెరీకి వచ్చే డైరెక్ట్ రెస్పాన్స్
    const unsubOnlineRes = socketService.on(
      "is_user_online_response",

      (data) => {
        console.log(
          "📩 Server Response for:",
          data.userId,
          "Is Online:",
          data.isOnline,
        );
        if (String(data.userId) === String(otherUserId)) {
          setOnlineStatus(data.isOnline ? "online" : "offline");
        }
      },
    );

    // 🔥 ఇది చాలా ముఖ్యం: బ్యాకెండ్ నుండి వచ్చే గ్లోబల్ అప్‌డేట్ (అడ్మిన్ మధ్యలో వస్తే)
    const unsubStatusUpdate = socketService.on("user_status_update", (data) => {
      if (String(data.userId) === String(otherUserId)) {
        setOnlineStatus(data.isOnline ? "online" : "offline");
      }
    });

    // మెసేజ్ రిసీవ్ చేసుకోవడం
    const unsubMsg = socketService.on("receive_message", (message) => {
      if (message.roomId === roomId) {
        setMessages((prev) => {
          const senderId = message.senderId?._id || message.senderId;
          const isMe = senderId === currentUserId;
          if (isMe || prev.some((m) => m._id === message._id)) return prev;

          playSound("receive");
          socketService.emit("mark_read", { messageId: message._id, roomId });
          return [...prev, message];
        });
      }
    });

    // మెసేజ్ సెంటర్ కన్ఫర్మేషన్
    const unsubSent = socketService.on("message_sent", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === data.tempId
            ? { ...msg, _id: data.messageId, status: "sent" }
            : msg,
        ),
      );
    });

    // టైపింగ్ ఇండికేటర్స్
    const unsubTyping = socketService.on("display_typing", (data) => {
      if (data.userId === otherUserId && data.roomId === roomId)
        setOtherUserTyping(true);
    });

    const unsubStopTyping = socketService.on("hide_typing", (data) => {
      if (data.userId === otherUserId && data.roomId === roomId)
        setOtherUserTyping(false);
    });

    // 5. Cleanup Function
    return () => {
      unsubConn();
      unsubOnlineRes();
      unsubStatusUpdate();
      unsubMsg();
      unsubSent();
      unsubTyping();
      unsubStopTyping();
      socketService.emit("leave_room", { roomId });
    };
  }, [currentUserId, otherUserId, roomId]);

  // --- PAGINATION & HISTORY ---
  // 👇 REPLACE YOUR OLD fetchChatHistory FUNCTION WITH THIS:

  const fetchChatHistory = async (pageNum = 1) => {
    console.log("ashok romm id ", roomId);
    console.log("ashok admin id ", otherUserId);
    if (pageNum === 1) setIsLoadingHistory(true);
    else setIsFetchingOld(true);

    try {
      // ✅ CHANGE: apiClient వాడుతున్నాం (Headers automatic)
      const res = await apiClient.get(
        `/chat/history/${roomId}?page=${pageNum}&limit=${MESSAGES_PER_PAGE}`,
      );
      console.log(res);

      if (res.data.success) {
        let historyData = res.data.data?.messages || [];

        if (!res.data.data?.pagination && pageNum > 1) {
          historyData = [];
          setHasMore(false);
        }

        historyData.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        if (historyData.length < MESSAGES_PER_PAGE) {
          setHasMore(false);
        }

        setMessages((prev) =>
          pageNum === 1 ? historyData : [...historyData, ...prev],
        );

        // ✅ CHANGE: socketService వాడుతున్నాం
        if (pageNum === 1) socketService.emit("mark_read", { roomId });
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
      toast.error("Could not load messages");
    } finally {
      setIsLoadingHistory(false);
      setIsFetchingOld(false);
    }
  };

  // 🔥 Infinite Scroll Handler
  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMore && !isFetchingOld && !isLoadingHistory) {
      const oldScrollHeight = messagesContainerRef.current.scrollHeight;

      setPage((prev) => {
        const nextPage = prev + 1;
        fetchChatHistory(nextPage).then(() => {
          requestAnimationFrame(() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight - oldScrollHeight;
            }
          });
        });
        return nextPage;
      });
    }
  };

  // 👇 REPLACE YOUR uploadFile FUNCTION:

  const uploadFile = async (fileToUpload) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      // ✅ CHANGE: apiClient Use చేయండి
      const res = await apiClient.post(`/chat/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization header apiClient చూసుకుంటుంది
        },
      });
      if (res.data.success) return res.data.data;
    } catch (error) {
      toast.error("File upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // --- SEND MESSAGE (OPTIMISTIC UI) ---
  const sendMessage = async (fileData = null, captionOverride = null) => {
    const textToSend = captionOverride !== null ? captionOverride : inputText;

    if (!fileData && !textToSend.trim()) return;

    if (editingMessageId && !fileData) {
      socketService.emit("edit_message", {
        roomId,
        messageId: editingMessageId,
        newText: textToSend,
      });
      // Optimistic Edit
      setMessages((prev) =>
        prev.map((m) =>
          m._id === editingMessageId
            ? { ...m, text: textToSend, isEdited: true }
            : m,
        ),
      );
      setEditingMessageId(null);
      setInputText("");
      return;
    }

    const tempId = Date.now(); // Temporary ID for optimistic update
    const msgType = fileData ? fileData.fileType : "text";

    const messagePayload = {
      roomId,
      receiverId: otherUserId,
      receiverModel: otherUserModel,
      text: textToSend || "",
      messageType: msgType,
      fileUrl: fileData ? fileData.fileUrl : null,
      fileName: fileData ? fileData.fileName : null,
      fileSize: fileData ? fileData.fileSize : null,
      tempId: tempId,
    };

    // 🔥 OPTIMISTIC UPDATE: Add to UI immediately
    const optimisticMessage = {
      ...messagePayload,
      _id: tempId, // Temporary ID
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isRead: false,
      status: "pending", // Flag to show it's sending
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText(""); // Clear input immediately
    playSound("send");

    // Send to Server
    socketService.emit("send_message", messagePayload);

    setPreviewImage(null);
    setCaptionText("");
    setSelectedFile(null);
    socketService.emit("stop_typing", { roomId });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewImage(url);
      }
    }
  };

  const handleFileSend = async () => {
    if (!selectedFile) return;
    const fileData = await uploadFile(selectedFile);
    if (fileData) {
      if (selectedFile.type.startsWith("audio/")) fileData.fileType = "audio";
      await sendMessage(fileData, captionText);
    }
  };

  const cancelPreview = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setCaptionText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditClick = (msg) => {
    setInputText(msg.text);
    setEditingMessageId(msg._id);
    setActiveMenuId(null);
    fileInputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInputText("");
  };

  const handleDeleteTrigger = (msgId) => {
    setDeleteConfirmationId(msgId);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmationId) {
      socketService.emit("delete_message", {
        roomId,
        messageId: deleteConfirmationId,
      });
      // Optimistic Delete
      setMessages((prev) => prev.filter((m) => m._id !== deleteConfirmationId));
      setDeleteConfirmationId(null);
      toast.success("Message deleted"); // 🔥 Toast Update
    }
  };

  const handleTyping = () => {
    if (!typingTimeoutRef.current) socketService.emit("typing", { roomId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit("stop_typing", { roomId });
      typingTimeoutRef.current = null;
    }, 800);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice_note.webm", {
          type: "audio/webm",
        });
        const fileData = await uploadFile(audioFile);
        if (fileData) {
          fileData.fileType = "audio";
          sendMessage(fileData);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied."); // 🔥 Toast Update
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLastSeen = (status) => {
    if (status === "online") return "Online";
    if (status === "offline") return "Offline";
    // Future Proofing: If backend sends timestamp, format it
    try {
      return `Last seen ${new Date(status).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch (e) {
      return "Offline";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 md:static md:w-full md:flex md:items-center md:justify-center font-sans overflow-hidden transition-colors duration-500 h-[100dvh] ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* 🔥 TOASTER Added */}
      {/* 🌌 Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>
      {/* --- PREVIEW & MODALS (Kept Same) --- */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-lg rounded-2xl overflow-hidden flex flex-col shadow-2xl ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
                <h3 className="font-semibold">Preview</h3>
                <button
                  onClick={cancelPreview}
                  className="p-2 hover:bg-white/10 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-black flex items-center justify-center p-2 min-h-[300px]">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-[60vh] object-contain rounded-lg"
                />
              </div>
              <div className="p-4 space-y-4">
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  className={`w-full p-3 rounded-xl outline-none border transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500 text-white" : "bg-gray-50 border-gray-200 focus:border-blue-500 text-slate-900"}`}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleFileSend}
                    disabled={uploading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all"
                  >
                    {uploading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}
                    {uploading ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setExpandedImage(null)}
          >
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={expandedImage}
                alt="Full View"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirmationId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl border flex flex-col items-center text-center ${isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-white/60"}`}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Message?</h3>
              <p
                className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirmationId(null)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Chat Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col w-full h-full md:flex-none md:w-[900px] md:h-[650px] relative md:rounded-[2rem] md:shadow-2xl overflow-hidden border transition-all duration-300 ${
          isDarkMode
            ? "bg-slate-900/60 backdrop-blur-2xl border-white/10"
            : "bg-white/80 backdrop-blur-xl border-white/60 shadow-blue-200/20"
        }`}
      >
        {/* --- HEADER --- */}
        <div
          className={`h-20 px-6 flex items-center justify-between border-b z-20 transition-colors ${isDarkMode ? "border-white/5 bg-slate-900/50" : "border-gray-100 bg-white/60"}`}
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <button
                className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
              >
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div className="relative">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-blue-400 to-indigo-600">
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
                >
                  <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
                    {otherUserInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {onlineStatus === "online" && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
              )}
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">
                Support Team
              </h2>
              <p
                className={`text-xs font-medium ${onlineStatus === "online" ? "text-emerald-500" : "text-slate-400"}`}
              >
                {formatLastSeen(onlineStatus)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-2.5 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
            >
              {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-yellow-400" : "hover:bg-gray-100 text-slate-600"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* --- MESSAGES AREA --- */}
        <div
          ref={messagesContainerRef} // 🔥 Attach Ref for Scroll Event
          onScroll={handleScroll} // 🔥 Infinite Scroll Trigger
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-none"
          style={{
            backgroundImage: isDarkMode
              ? "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          onClick={() => setActiveMenuId(null)}
        >
          {/* Loading Old Messages Spinner */}
          {isFetchingOld && (
            <div className="flex justify-center py-2">
              <Loader2
                className="animate-spin text-blue-500 opacity-50"
                size={20}
              />
            </div>
          )}

          {isLoadingHistory ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <MessageSquareDashed size={48} className="mb-2 text-slate-400" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe =
                msg.senderId === currentUserId ||
                msg.senderId?._id === currentUserId;
              const isPending = msg.status === "pending"; // 🔥 Optimistic UI Check

              return (
                <motion.div
                  key={msg._id || msg.tempId || idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: isPending ? 0.7 : 1, y: 0, scale: 1 }}
                  className={`flex group relative ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] p-4 rounded-[20px] shadow-sm relative ${isMe ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-[4px]" : isDarkMode ? "bg-slate-800/80 backdrop-blur-md text-slate-200 border border-white/5 rounded-bl-[4px]" : "bg-white text-slate-800 border border-gray-100 rounded-bl-[4px]"}`}
                  >
                    {/* Menu Button (Only for real messages) */}
                    {isMe && !msg.fileUrl && !isPending && (
                      <div className="absolute top-2 right-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === msg._id ? null : msg._id,
                            );
                          }}
                          className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${activeMenuId === msg._id ? "opacity-100 bg-black/20" : "hover:bg-black/10"}`}
                        >
                          <MoreVertical size={14} className="text-white/80" />
                        </button>
                        {activeMenuId === msg._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`absolute right-0 top-6 w-32 rounded-lg shadow-xl overflow-hidden py-1 z-20 ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100"}`}
                          >
                            <button
                              onClick={() => handleEditClick(msg)}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 ${isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-gray-50 text-slate-700"}`}
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTrigger(msg._id)}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {msg.fileUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden bg-black/20">
                        {msg.messageType === "image" ? (
                          <div className="relative group/image">
                            <img
                              src={msg.fileUrl}
                              alt="attachment"
                              className="w-full max-h-[250px] object-cover cursor-pointer"
                              onClick={() => setExpandedImage(msg.fileUrl)}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                              <Maximize2 className="text-white/80" size={24} />
                            </div>
                          </div>
                        ) : msg.messageType === "video" ? (
                          <video
                            src={msg.fileUrl}
                            controls
                            className="w-full max-h-[250px]"
                          />
                        ) : msg.messageType === "audio" ? (
                          <div className="p-3 flex items-center gap-3 bg-black/10">
                            <FileAudio size={24} />
                            <audio
                              src={msg.fileUrl}
                              controls
                              className="h-8 w-full"
                            />
                          </div>
                        ) : null}
                      </div>
                    )}

                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                      {msg.isEdited && (
                        <span className="text-[10px] opacity-60 ml-1">
                          (edited)
                        </span>
                      )}
                    </p>

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80 ${isMe ? "text-blue-100" : ""}`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>
                      {isMe &&
                        (isPending ? (
                          <Clock size={12} className="animate-pulse" />
                        ) : msg.isRead ? (
                          <CheckCheck size={12} />
                        ) : (
                          <Check size={12} />
                        ))}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}

          <AnimatePresence>
            {otherUserTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-start w-full"
              >
                <div
                  className={`px-4 py-3 rounded-[20px] rounded-bl-[4px] shadow-sm flex items-center gap-1.5 ${isDarkMode ? "bg-slate-800/80 border border-white/5" : "bg-white border border-gray-100"}`}
                >
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="px-4 pb-3 pt-2 md:p-6 z-20 bg-transparent">
          <AnimatePresence>
            {selectedFile && !previewImage && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="absolute bottom-20 left-6 right-6 z-30"
              >
                <div
                  className={`flex items-center gap-3 p-3 rounded-2xl shadow-xl border ${isDarkMode ? "bg-slate-800 border-white/10" : "bg-white border-gray-100"}`}
                >
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                    <Paperclip size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs opacity-60">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-black/5 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {editingMessageId && (
            <div
              className={`mb-2 px-4 py-2 rounded-lg text-xs flex justify-between items-center ${isDarkMode ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-600"}`}
            >
              <span>Editing message...</span>
              <button onClick={handleCancelEdit}>
                <X size={14} />
              </button>
            </div>
          )}

          <div
            className={`flex items-center gap-2 p-1.5 rounded-[2rem] shadow-lg border relative transition-all ${isDarkMode ? "bg-slate-800/80 border-white/10 shadow-black/40" : "bg-white/90 border-white/60 shadow-blue-500/10"}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,audio/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder={isRecording ? "Recording..." : "Type a message..."}
              disabled={uploading || isRecording}
              className={`flex-1 bg-transparent border-none outline-none text-[15px] px-2 ${isDarkMode ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
            />
            {inputText.trim() || selectedFile ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  selectedFile ? handleFileSend() : sendMessage()
                }
                disabled={uploading}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center"
              >
                {uploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : editingMessageId ? (
                  <Check size={20} className="ml-0.5" />
                ) : (
                  <Send size={20} className="ml-0.5" />
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse" : isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
              >
                {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
