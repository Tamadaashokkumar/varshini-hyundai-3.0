"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  Send,
  Paperclip,
  X,
  Loader2,
  Check,
  CheckCheck,
  Sun,
  Moon,
} from "lucide-react";

export default function ChatComponent({
  currentUserId,
  otherUserId,
  otherUserModel = "Admin",
  otherUserName = "User",
  token,
  apiUrl = "http://localhost:5000",
  isDarkMode = false,
  toggleTheme,
  onClose,
}) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const roomId = [currentUserId, otherUserId].sort().join("_");

  // --- AUTO SCROLL TO BOTTOM ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping, selectedFile]);

  // --- SOCKET & LOGIC ---
  useEffect(() => {
    if (!token || !currentUserId || !otherUserId) return;
    const socketUrl = apiUrl.replace("/api", "");
    const newSocket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_room", { roomId });
      fetchChatHistory();
    });

    newSocket.on("new_message", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === data.message._id);
          if (exists) return prev;
          // కొత్త మెసేజ్ చివరన యాడ్ అవుతుంది
          return [...prev, data.message];
        });
        if (data.message.senderId !== currentUserId) {
          newSocket.emit("mark_read", { messageId: data.message._id, roomId });
        }
      }
    });

    newSocket.on("typing", (data) => {
      if (data.userId !== currentUserId && data.roomId === roomId)
        setOtherUserTyping(true);
    });

    newSocket.on("stop_typing", (data) => {
      if (data.userId !== currentUserId && data.roomId === roomId)
        setOtherUserTyping(false);
    });

    newSocket.on("message_read", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, isRead: true } : msg,
          ),
        );
      }
    });

    return () => {
      newSocket.off("new_message");
      newSocket.emit("leave_room", { roomId });
      newSocket.disconnect();
    };
  }, [currentUserId, otherUserId, token, roomId, apiUrl]);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/chat/history/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        let historyData = res.data.data?.messages || [];
        // 🔥 Sorting: Oldest First -> Newest Last (WhatsApp Style)
        historyData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setMessages(historyData);
      }
    } catch (error) {
      setMessages([]);
    }
  };

  const uploadAndSendFile = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post(`${apiUrl}/api/chat/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        const { fileUrl, fileType, fileName, fileSize } = res.data.data;
        socket?.emit("send_message", {
          roomId,
          receiverId: otherUserId,
          receiverModel: otherUserModel,
          text: inputText || "",
          messageType: fileType,
          fileUrl: fileUrl,
          fileName: fileName,
          fileSize: fileSize,
          tempId: Date.now(),
        });
        setSelectedFile(null);
        setInputText("");
      }
    } catch (error) {
      alert("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = () => {
    if (selectedFile) {
      uploadAndSendFile();
      return;
    }
    if (!inputText.trim()) return;
    socket?.emit("send_message", {
      roomId,
      receiverId: otherUserId,
      receiverModel: otherUserModel,
      text: inputText,
      messageType: "text",
      tempId: Date.now(),
    });
    setInputText("");
    socket?.emit("stop_typing", { roomId });
  };

  const handleTyping = () => {
    socket?.emit("typing", { roomId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop_typing", { roomId });
    }, 2000);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMessageFromMe = (msg) => {
    const senderId = msg.senderId?._id || msg.senderId;
    return senderId === currentUserId;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==============================
  // UI RENDER
  // ==============================
  return (
    <div
      className={`flex flex-col h-full w-full relative transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950" : "bg-white"
      }`}
    >
      {/* 🔥 HEADER: Reverted to Clean Solid Colors */}
      <div
        className={`h-[70px] flex items-center justify-between px-4 shrink-0 border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
              isDarkMode
                ? "bg-slate-700 text-white border-slate-600"
                : "bg-blue-50 text-blue-600 border-blue-100"
            }`}
          >
            {otherUserName.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col">
            <span
              className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {otherUserName}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span
                className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
              >
                Active now
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode
                  ? "text-slate-400 hover:bg-slate-800"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDarkMode ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        {Array.isArray(messages) &&
          messages.map((msg, index) => {
            const isMe = isMessageFromMe(msg);
            return (
              <div
                key={msg._id || index}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2.5 text-[14px] leading-relaxed relative shadow-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                        : isDarkMode
                          ? "bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm border border-slate-700"
                          : "bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-gray-100"
                    }`}
                  >
                    {(msg.messageType === "image" ||
                      msg.messageType === "video") &&
                      msg.fileUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden">
                          {msg.messageType === "image" ? (
                            <img
                              src={msg.fileUrl}
                              alt="media"
                              className="max-w-full h-auto cursor-pointer"
                              onClick={() => window.open(msg.fileUrl, "_blank")}
                            />
                          ) : (
                            <video
                              src={msg.fileUrl}
                              controls
                              className="max-w-full h-auto"
                            />
                          )}
                        </div>
                      )}
                    {msg.text && (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>

                  {/* Timestamp & Status */}
                  <div
                    className={`text-[10px] mt-1 font-medium flex items-center gap-1 ${
                      isDarkMode ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                    {isMe &&
                      (msg.isRead ? (
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Check className="w-3 h-3" />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}

        {otherUserTyping && (
          <div
            className={`text-xs ml-4 animate-pulse ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
          >
            typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div
        className={`p-3 shrink-0 border-t ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-100"
        }`}
      >
        {selectedFile && (
          <div
            className={`flex items-center gap-2 p-2 rounded-lg mb-2 border w-fit ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <span
              className={`text-xs font-medium truncate max-w-[150px] ${
                isDarkMode ? "text-white" : "text-gray-600"
              }`}
            >
              {selectedFile.name}
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              className="bg-gray-200 rounded-full p-0.5 hover:bg-gray-300 transition"
            >
              <X className="w-3 h-3 text-black" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-full transition-colors ${
              isDarkMode
                ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={uploading}
              className={`w-full rounded-full px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 border text-sm transition-all ${
                isDarkMode
                  ? "bg-slate-800 text-white placeholder-slate-500 border-slate-700 focus:bg-slate-800"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent focus:bg-white focus:border-gray-200"
              }`}
            />
            <button
              onClick={sendMessage}
              disabled={(!inputText.trim() && !selectedFile) || uploading}
              className={`absolute right-1 top-1 bottom-1 p-2 rounded-full transition-all flex items-center justify-center ${
                (!inputText.trim() && !selectedFile) || uploading
                  ? "text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
