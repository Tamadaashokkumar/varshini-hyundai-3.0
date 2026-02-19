"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Send,
  Paperclip,
  X,
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
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";

import socketService from "@/services/socketService";
import apiClient from "@/services/apiClient";

// --- CONFIG ---
const SEND_SOUND_URL = "/sounds/message-send.mp3";
const RECEIVE_SOUND_URL = "/sounds/message-receive.mp3";
const MESSAGES_PER_PAGE = 50;

interface ChatForPopupProps {
  currentUserId: string;
  otherUserId: string;
  otherUserModel?: string;
  onClose: () => void;
  isDarkModeParent?: boolean;
  toggleThemeParent?: () => void;
}

// 🔥 FIX: Define Message Interface (Optional but good for TS)
interface Message {
  _id: string;
  text?: string;
  senderId: string | { _id: string };
  senderModel: string;
  createdAt: string;
  isRead: boolean;
  status?: string;
  tempId?: string;
  fileUrl?: string;
  messageType?: "text" | "image" | "video" | "audio";
  isEdited?: boolean;
}

export default function ChatComponentPopup({
  currentUserId,
  otherUserId,
  otherUserModel = "Admin",
  onClose,
  isDarkModeParent,
  toggleThemeParent,
}: ChatForPopupProps) {
  // --- STATE ---
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [otherUserInfo, setOtherUserInfo] = useState({
    name: otherUserModel,
    profilePicture: null,
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingOld, setIsFetchingOld] = useState(false);

  // Features
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);

  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  // UI Prefs (Synced with parent or local)
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeParent || false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioSendRef = useRef<HTMLAudioElement | null>(null);
  const audioReceiveRef = useRef<HTMLAudioElement | null>(null);

  // Sync dark mode if parent changes
  useEffect(() => {
    if (isDarkModeParent !== undefined) {
      setIsDarkMode(isDarkModeParent);
    }
  }, [isDarkModeParent]);

  // Safe Room ID
  const roomId =
    currentUserId && otherUserId
      ? [currentUserId, otherUserId].sort().join("_")
      : null;

  const isMyMessage = (msg: any) => {
    if (msg.senderModel === "User") return true;
    if (msg.senderModel === "Admin") return false;
    const sender =
      typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
    if (sender) return String(sender) === String(currentUserId);
    return false;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioSendRef.current = new Audio(SEND_SOUND_URL);
      audioReceiveRef.current = new Audio(RECEIVE_SOUND_URL);
    }
  }, []);

  const playSound = (type: "send" | "receive") => {
    if (!isSoundEnabled) return;
    try {
      const audioRef = type === "send" ? audioSendRef : audioReceiveRef;
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch (e) {}
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    if (!isFetchingOld) scrollToBottom();
  }, [messages, otherUserTyping, selectedFile, isFetchingOld]);

  const fetchChatHistory = async (pageNum = 1) => {
    if (!roomId) return;
    if (pageNum === 1) setIsLoadingHistory(true);
    else setIsFetchingOld(true);

    try {
      const res = await apiClient.get(
        `/chat/history/${roomId}?page=${pageNum}&limit=${MESSAGES_PER_PAGE}`,
      );

      if (res.data.success) {
        let historyData = res.data.data?.messages || [];
        historyData.sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        if (historyData.length < MESSAGES_PER_PAGE) setHasMore(false);

        setMessages((prev) => {
          if (pageNum === 1) return historyData;
          const existingIds = new Set(prev.map((m) => m._id));
          const uniqueHistory = historyData.filter(
            (m: any) => !existingIds.has(m._id),
          );
          return [...uniqueHistory, ...prev];
        });

        if (pageNum === 1 && socketService.socket?.connected) {
          socketService.emit("mark_read", { roomId, userId: currentUserId });
        }
      }
    } catch (error) {
      console.error("History Error:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingHistory(false);
      setIsFetchingOld(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchChatHistory(1);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !currentUserId || !otherUserId) return;

    const connectSocketWithFreshToken = async () => {
      try {
        console.log("🔌 Fetching latest token and Connecting Socket...");

        // 1. API కాల్ చేసి ఫ్రెష్ టోకెన్ తెచ్చుకోవడం (ఇది ముఖ్యం!)
        const { data } = await apiClient.get("/auth/get-socket-token");

        // 2. ఆ టోకెన్ తో సాకెట్ ని కనెక్ట్ చేయడం
        if (data?.token) {
          socketService.connect(data.token);
        } else {
          // ఒకవేళ టోకెన్ రాకపోతే, ఉన్నదానితో ట్రై చేయి (Fallback)
          socketService.connect();
        }
      } catch (err) {
        console.error("Socket Auth Error:", err);
        socketService.connect();
      }
    };

    // ఫంక్షన్ కాల్ చేయడం
    connectSocketWithFreshToken();

    const handleConnect = () => {
      socketService.emit("join_room", { roomId });
      socketService.emit("check_online_status", { userId: otherUserId });
      socketService.emit("mark_read", { roomId, userId: currentUserId });
    };

    if (socketService.socket?.connected) {
      handleConnect();
    }

    const unsubConnect = socketService.on("connect", handleConnect);

    const unsubOnlineRes = socketService.on(
      "is_user_online_response",
      (data: any) => {
        if (String(data.userId) === String(otherUserId)) {
          setOnlineStatus(data.isOnline ? "online" : "offline");
        }
      },
    );

    const unsubStatusUpdate = socketService.on(
      "user_status_update",
      (data: any) => {
        if (String(data.userId) === String(otherUserId)) {
          setOnlineStatus(data.isOnline ? "online" : "offline");
        }
      },
    );

    const unsubMsg = socketService.on("receive_message", (message: any) => {
      if (message.roomId === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          const tempMatchIndex = prev.findIndex(
            (m) => m.tempId && m.tempId === message.tempId,
          );
          if (tempMatchIndex !== -1) {
            const newMessages = [...prev];
            newMessages[tempMatchIndex] = {
              ...message,
              status: "sent",
              tempId: undefined,
            };
            return newMessages;
          }
          if (isMyMessage(message)) return prev;
          playSound("receive");
          socketService.emit("mark_read", { messageId: message._id, roomId });
          return [...prev, message];
        });
      }
    });

    const unsubSent = socketService.on("message_sent", (data: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === data.tempId
            ? { ...msg, _id: data.messageId, status: "sent", tempId: undefined }
            : msg,
        ),
      );
    });

    const unsubTyping = socketService.on("display_typing", (data: any) => {
      const isOtherUser = String(data.userId) === String(otherUserId);
      const isSameRoom = String(data.roomId) === String(roomId);
      if (isOtherUser && isSameRoom) {
        setOtherUserTyping(true);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      }
    });

    const unsubStopTyping = socketService.on("hide_typing", (data: any) => {
      const isOtherUser = String(data.userId) === String(otherUserId);
      const isSameRoom = String(data.roomId) === String(roomId);
      if (isOtherUser && isSameRoom) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      unsubConnect();
      unsubOnlineRes();
      unsubStatusUpdate();
      unsubMsg();
      unsubSent();
      unsubTyping();
      unsubStopTyping();
      socketService.emit("leave_room", { roomId });
    };
  }, [roomId, currentUserId, otherUserId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMore && !isFetchingOld && !isLoadingHistory) {
      const oldScrollHeight = messagesContainerRef.current?.scrollHeight || 0;
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchChatHistory(nextPage).then(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
              messagesContainerRef.current.scrollHeight - oldScrollHeight;
          }
        });
        return nextPage;
      });
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);
    try {
      const res = await apiClient.post(`/chat/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) return res.data.data;
    } catch (error) {
      toast.error("File upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (
    fileData: any = null,
    captionOverride: string | null = null,
  ) => {
    const textToSend = captionOverride !== null ? captionOverride : inputText;
    if ((!textToSend.trim() && !fileData) || !roomId) return;

    if (editingMessageId && !fileData) {
      socketService.emit("edit_message", {
        roomId,
        messageId: editingMessageId,
        newText: textToSend,
      });
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

    const tempId = Date.now().toString();
    const messagePayload = {
      roomId,
      receiverId: otherUserId,
      receiverModel: otherUserModel,
      text: textToSend || "",
      messageType: fileData ? fileData.fileType : "text",
      fileUrl: fileData ? fileData.fileUrl : null,
      fileName: fileData ? fileData.fileName : null,
      fileSize: fileData ? fileData.fileSize : null,
      tempId,
    };

    setMessages((prev) => [
      ...prev,
      {
        ...messagePayload,
        _id: tempId,
        senderId: currentUserId,
        senderModel: "User",
        createdAt: new Date().toISOString(),
        isRead: false,
        status: "pending",
      },
    ]);

    setInputText("");
    playSound("send");
    socketService.emit("send_message", messagePayload);
    setPreviewImage(null);
    setCaptionText("");
    setSelectedFile(null);
    socketService.emit("stop_typing", { roomId });
  };

  const handleTyping = () => {
    if (!roomId) return;
    if (!typingTimeoutRef.current) socketService.emit("typing", { roomId });
    clearTimeout(typingTimeoutRef.current as any);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit("stop_typing", { roomId });
      typingTimeoutRef.current = null;
    }, 800);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
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

  const handleEditClick = (msg: any) => {
    setInputText(msg.text);
    setEditingMessageId(msg._id);
    setActiveMenuId(null);
    fileInputRef.current?.focus();
  };

  const handleDeleteTrigger = (msgId: string) => {
    setDeleteConfirmationId(msgId);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmationId) {
      socketService.emit("delete_message", {
        roomId,
        messageId: deleteConfirmationId,
      });
      setMessages((prev) => prev.filter((m) => m._id !== deleteConfirmationId));
      setDeleteConfirmationId(null);
      toast.success("Message deleted");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks: Blob[] = [];
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
      toast.error("Microphone access denied.");
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

  const formatLastSeen = (status: string) => {
    if (status === "online") return "Online";
    return "Offline";
  };

  if (!roomId || !currentUserId || !otherUserId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-sm text-slate-400">Initializing secure chat...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col relative transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <Toaster position="top-center" />

      {/* --- PREVIEW MODAL --- */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-lg rounded-2xl overflow-hidden flex flex-col shadow-2xl ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
                <h3 className="font-semibold">Preview</h3>
                <button onClick={cancelPreview}>
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-black flex items-center justify-center p-2 min-h-[300px]">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-[50vh] object-contain rounded-lg"
                />
              </div>
              <div className="p-4 space-y-4">
                <input
                  type="text"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full p-3 rounded-xl outline-none border bg-transparent"
                />
                <button
                  onClick={handleFileSend}
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full ml-auto"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}{" "}
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- IMAGE EXPAND MODAL --- */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setExpandedImage(null)}
          >
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
            >
              <X size={28} />
            </button>
            <img
              src={expandedImage}
              alt="Full View"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div
        className={`h-20 px-6 flex items-center justify-between border-b z-20 shrink-0 transition-colors ${
          isDarkMode
            ? "border-white/5 bg-slate-900/90"
            : "border-gray-200 bg-white/90"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors md:hidden ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-blue-400 to-indigo-600">
              <div
                className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
              >
                <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
                  {otherUserInfo.name
                    ? otherUserInfo.name.charAt(0).toUpperCase()
                    : "?"}
                </span>
              </div>
            </div>
            {onlineStatus === "online" && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-base">{otherUserModel}</h2>
            <p
              className={`text-xs font-medium ${onlineStatus === "online" ? "text-emerald-500" : "text-slate-400"}`}
            >
              {formatLastSeen(onlineStatus)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {toggleThemeParent && (
            <button
              onClick={toggleThemeParent}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700"
        onClick={() => setActiveMenuId(null)}
      >
        {isFetchingOld && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        )}
        {isLoadingHistory ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <MessageSquareDashed size={48} />
            <p>No messages yet.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = isMyMessage(msg);
            const isPending = msg.status === "pending";
            const uniqueKey = msg._id || msg.tempId || `msg-${idx}`;

            return (
              <motion.div
                key={uniqueKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isPending ? 0.7 : 1, y: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-[20px] relative shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-[4px]"
                      : isDarkMode
                        ? "bg-slate-800 text-slate-200 rounded-bl-[4px]"
                        : "bg-white text-slate-800 border rounded-bl-[4px]"
                  }`}
                >
                  {isMe && !msg.fileUrl && !isPending && (
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === msg._id ? null : msg._id,
                          );
                        }}
                        className="p-1 hover:bg-black/10 rounded-full"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {activeMenuId === msg._id && (
                        <div
                          className={`absolute right-0 top-6 w-24 border rounded shadow-lg z-20 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
                        >
                          <button
                            onClick={() => handleEditClick(msg)}
                            className="w-full text-left px-2 py-1 text-xs flex gap-2 hover:bg-black/5"
                          >
                            <Edit2 size={10} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTrigger(msg._id)}
                            className="w-full text-left px-2 py-1 text-xs text-red-400 flex gap-2 hover:bg-black/5"
                          >
                            <Trash2 size={10} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-[15px] whitespace-pre-wrap leading-relaxed">
                    {msg.text}{" "}
                    {msg.isEdited && (
                      <span className="text-[10px] opacity-60 ml-1">
                        (edited)
                      </span>
                    )}
                  </p>
                  {msg.fileUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      {msg.messageType === "image" && (
                        <img
                          src={msg.fileUrl}
                          alt="file"
                          className="max-h-40 cursor-pointer object-cover"
                          onClick={() => setExpandedImage(msg.fileUrl)}
                        />
                      )}
                      {msg.messageType === "audio" && (
                        <audio
                          src={msg.fileUrl}
                          controls
                          className="h-8 w-full"
                        />
                      )}
                      {msg.messageType === "video" && (
                        <video
                          src={msg.fileUrl}
                          controls
                          className="max-h-40"
                        />
                      )}
                    </div>
                  )}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80 ${isMe ? "text-blue-100" : ""}`}
                  >
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe &&
                      (isPending ? (
                        <Clock size={12} className="animate-pulse" />
                      ) : (
                        <CheckCheck size={12} />
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
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
      <div className={`px-4 pb-4 pt-2 md:p-6 bg-transparent z-20 shrink-0`}>
        <AnimatePresence>
          {selectedFile && !previewImage && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="absolute bottom-24 left-6 right-6 z-30"
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

        <div
          className={`flex items-center gap-2 p-1.5 rounded-[2rem] shadow-lg border ${isDarkMode ? "bg-slate-800/80 border-white/10" : "bg-white/90 border-white/60"}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-blue-500 transition-colors"
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className={`flex-1 bg-transparent border-none outline-none px-2 ${isDarkMode ? "text-white placeholder:text-slate-500" : "text-slate-900"}`}
          />
          {inputText.trim() || selectedFile ? (
            <button
              onClick={() => (selectedFile ? handleFileSend() : sendMessage())}
              disabled={uploading}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          ) : (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse" : isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
            >
              {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
