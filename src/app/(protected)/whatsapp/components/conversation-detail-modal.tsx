"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Phone,
  Send,
  Check,
  CheckCheck,
  XCircle,
  ArrowLeft,
  Trash2,
  RefreshCw,
  ImagePlus,
  X,
  MapPin,
  User,
  FileText,
} from "lucide-react";
import { uploadService } from "@/service/upload.service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRBAC } from "@/hooks/use-rbac";
import { getErrorMessage } from "@/lib/get-error-message";
import { whatsappService } from "@/service/whatsapp.service";
import { renderTemplateTextWithValues } from "@/lib/whatsapp-template-runtime";
import type {
  WhatsAppConversation,
  WhatsAppMessage,
} from "@/types/whatsapp.types";

interface ConversationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: WhatsAppConversation | null;
  companyId?: string | null;
}

/** Per-media-type file-type + size limits (mirrors backend `meta-media.util.ts`). */
const MEDIA_LIMITS: Record<
  "image" | "video" | "audio" | "document",
  { acceptRx: RegExp; maxBytes: number; label: string }
> = {
  image: {
    acceptRx: /^image\/(jpeg|png|gif|webp)$/i,
    maxBytes: 5 * 1024 * 1024,
    label: "Image",
  },
  video: {
    acceptRx: /^video\/(mp4|quicktime|webm|x-matroska)$/i,
    maxBytes: 25 * 1024 * 1024,
    label: "Video",
  },
  audio: {
    acceptRx: /^audio\/(mpeg|mp4|ogg|aac|amr)$/i,
    maxBytes: 25 * 1024 * 1024,
    label: "Audio",
  },
  document: {
    acceptRx:
      /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation|zip)|text\/plain)$/i,
    maxBytes: 25 * 1024 * 1024,
    label: "Document",
  },
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)}MB`;
  }
  return `${(bytes / 1024).toFixed(0)}KB`;
}

/** Returns a human-friendly error, or null when the file passes limits for its detected type. */
function validateMediaFile(file: File): string | null {
  const detect: "image" | "video" | "audio" | "document" | null =
    /^image\//i.test(file.type)
      ? "image"
      : /^video\//i.test(file.type)
        ? "video"
        : /^audio\//i.test(file.type)
          ? "audio"
          : /^(application\/|text\/plain)/i.test(file.type)
            ? "document"
            : null;
  const lim = detect ? MEDIA_LIMITS[detect] : null;
  if (!detect || !lim || !lim.acceptRx.test(file.type)) {
    return "Unsupported file type";
  }
  if (file.size > lim.maxBytes) {
    return `${lim.label} must be ${formatBytes(lim.maxBytes)} or smaller (got ${formatBytes(file.size)})`;
  }
  return null;
}

function MessageStatusIcon({ status }: { status: WhatsAppMessage["status"] }) {
  switch (status) {
    case "sent":
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case "delivered":
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case "read":
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    case "failed":
      return <XCircle className="h-3 w-3 text-destructive" />;
    default:
      return <Spinner className="h-3 w-3" />;
  }
}

function parseStructuredBody(body: string): Record<string, unknown> | null {
  if (!body) return null;
  try {
    const parsed: unknown = JSON.parse(body);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function resolveMediaInfo(message: WhatsAppMessage) {
  const src = message.media?.s3Url ?? message.mediaUrl ?? null;
  const baseType =
    message.media?.mediaType ??
    (message.messageType === "contacts" ? "contact" : message.messageType);
  const type = baseType === "media" ? detectMediaTypeFromUrl(src) : baseType;
  return { src, type };
}

/** Renders the raw media element (image/video/audio/…) WITHOUT the bubble frame. */
function MediaElement({
  message,
  src,
  type,
}: {
  message: WhatsAppMessage;
  src: string | null;
  type: NonNullable<ReturnType<typeof resolveMediaInfo>["type"]>;
}) {
  const { body } = message;
  switch (type) {
    case "image":
    case "sticker":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- S3 URLs; avoid remotePatterns
        <img
          src={src ?? undefined}
          alt={body && !isPlaceholderBody(body) ? body : type}
          className={
            type === "sticker"
              ? "max-h-40 w-auto object-contain"
              : "max-h-[340px] w-auto object-cover"
          }
        />
      );
    case "video":
      return (
        <video
          src={src ?? undefined}
          controls
          className="max-h-[340px] w-auto bg-black"
        />
      );
    case "audio": {
      const inbound = message.direction === "inbound";
      return (
        <div
          className={`flex items-center gap-3 rounded-xl border p-3.5 min-w-[260px] ${
            inbound
              ? "border-border bg-muted-foreground/5 text-foreground"
              : "border-black/10 bg-black/5 text-primary-foreground"
          }`}
        >
          <audio
            src={src ?? undefined}
            controls
            className="min-w-[220px] h-9"
          />
        </div>
      );
    }
    case "document": {
      const name =
        src?.split("/").pop() ||
        (body && !isPlaceholderBody(body) ? body : "Document");
      const inbound = message.direction === "inbound";
      return (
        <a
          href={src ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 rounded-xl border p-4 min-w-52 transition-colors ${
            inbound
              ? "border-border bg-muted-foreground/5 text-foreground hover:bg-muted/60"
              : "border-black/10 bg-black/5 text-primary-foreground hover:bg-black/10"
          }`}
        >
          <div className="flex items-center justify-center rounded-lg bg-primary/15 h-10 w-10 shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">{name}</p>
            <p className="text-[10px] opacity-60 mt-0.5">
              Document · tap to open
            </p>
          </div>
        </a>
      );
    }
    case "location": {
      const location = message.media?.structuredData?.location;
      const parsed = parseStructuredBody(body);
      const parsedMeta = parsed as {
        latitude?: unknown;
        lat?: unknown;
        longitude?: unknown;
        lng?: unknown;
        name?: unknown;
        address?: unknown;
      } | null;
      const lat = Number(
        location?.latitude ?? parsedMeta?.latitude ?? parsedMeta?.lat,
      );
      const lng = Number(
        location?.longitude ?? parsedMeta?.longitude ?? parsedMeta?.lng,
      );
      const label =
        location?.name ||
        location?.address ||
        String(
          parsedMeta?.name ?? parsedMeta?.address ?? "View on Google Maps",
        );
      const valid =
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        (lat !== 0 || lng !== 0);
      const inbound = message.direction === "inbound";
      return (
        <a
          href={
            valid ? `https://www.google.com/maps?q=${lat},${lng}` : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 rounded-lg p-3 min-w-44 ${
            inbound
              ? "bg-muted-foreground/5 text-foreground"
              : "bg-black/10 text-primary-foreground"
          }`}
        >
          <MapPin className="h-5 w-5 shrink-0" />
          <span className="text-xs font-medium truncate">{label}</span>
        </a>
      );
    }
    case "contact":
    case "contacts": {
      const contacts = message.media?.structuredData?.contacts;
      const parsed = parseStructuredBody(body);
      const parsedMeta = parsed as {
        name?: unknown;
        phone?: unknown;
        phones?: unknown[];
        wa_id?: unknown;
      } | null;
      const name = String(
        contacts?.[0]?.name ?? parsedMeta?.name ?? body ?? "Contact",
      );
      const phone = String(
        contacts?.[0]?.phones?.[0] ??
          parsedMeta?.phone ??
          parsedMeta?.phones?.[0] ??
          parsedMeta?.wa_id ??
          "",
      );
      const inbound = message.direction === "inbound";
      return (
        <a
          href={
            phone ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}` : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 rounded-lg p-3 min-w-44 ${
            inbound
              ? "bg-muted-foreground/5 text-foreground"
              : "bg-black/5 text-primary-foreground"
          }`}
        >
          <User className="h-5 w-5 shrink-0" />
          <span className="text-xs font-medium truncate">
            {name}
            {phone ? ` · ${phone}` : ""}
          </span>
        </a>
      );
    }
    case "interactive":
    default:
      if (!src) return null;
      const inbound = message.direction === "inbound";
      return (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs underline ${
            inbound ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          View {message.messageType}
        </a>
      );
  }
}

function MediaContent({ message }: { message: WhatsAppMessage }) {
  const { src, type } = resolveMediaInfo(message);
  if (!src) return <MediaPlaceholder label={type} />;
  return <MediaElement message={message} src={src} type={type} />;
}

/** Backend stores `[image]`, `[video]`, etc. as body when a media message has no caption/text. */
function isPlaceholderBody(body: string): boolean {
  return (
    /^\[(image|sticker|video|audio|document|location|contacts|contact)\]$/.test(
      body.trim(),
    ) || /^\[media:/.test(body.trim())
  );
}

function detectMediaTypeFromUrl(
  url: string | null,
): WhatsAppMessage["messageType"] {
  if (!url) return "image";
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp)$/.test(clean)) return "image";
  if (/\.(mp4|webm|mov|avi|mkv)$/.test(clean)) return "video";
  if (/\.(mp3|m4a|wav|ogg|opus|aac)$/.test(clean)) return "audio";
  if (/\.(pdf|docx?|xlsx?|pptx?|txt|csv|zip)$/.test(clean)) return "document";
  return "image";
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
      <FileText className="h-4 w-4 shrink-0" />
      {label}
    </div>
  );
}

function MessageBubble({
  message,
  isLast,
  onDelete,
  onRetry,
  deleting,
  retrying,
}: {
  message: WhatsAppMessage;
  isLast: boolean;
  onDelete: (msg: WhatsAppMessage) => void;
  onRetry: (msg: WhatsAppMessage) => void;
  deleting: boolean;
  retrying: boolean;
}) {
  const isInbound = message.direction === "inbound";
  const time = message.createdAt
    ? format(new Date(message.createdAt), "h:mm a")
    : "";
  const isFailed = message.status === "failed";
  const canDelete = message.status !== "pending" && message.status !== "queued";

  const { src, type: mediaType } = resolveMediaInfo(message);
  const hasMedia =
    message.mediaUrl ||
    message.media ||
    message.messageType === "location" ||
    message.messageType === "contact" ||
    message.messageType === "contacts";
  // Bubbled like WhatsApp: text, image, and video. Standalone: sticker/audio/document/location/contact.
  const isImageVideo = mediaType === "image" || mediaType === "video";
  const isSticker = mediaType === "sticker";
  const isStandaloneMedia =
    hasMedia && !isImageVideo && !isSticker && mediaType !== "text";
  const inBubble = !isSticker && !isStandaloneMedia;

  const corner = isInbound ? "rounded-bl-md" : "rounded-br-md";
  const bubbleBg = isInbound
    ? "bg-muted text-foreground"
    : "bg-primary text-primary-foreground";
  // Image/video: thin WhatsApp-style wrapper (p-1) around the media.
  const bubblePadding = isImageVideo ? "p-1" : "px-4 py-2.5";

  const caption =
    message.body && !isPlaceholderBody(message.body) ? message.body : "";
  const metaRow = (
    <div
      className={`flex items-center gap-1 mt-1 ${
        isInbound ? "justify-start" : "justify-end"
      }`}
    >
      <span
        className={`text-[10px] ${
          isInbound ? "text-muted-foreground" : "text-primary-foreground/70"
        }`}
      >
        {time}
      </span>
      {!isInbound && <MessageStatusIcon status={message.status} />}
    </div>
  );

  return (
    <div
      className={`group flex ${isInbound ? "justify-start" : "justify-end"} mb-3`}
    >
      <div className="flex items-center gap-1.5 max-w-[80%]">
        <div className="min-w-0 flex flex-col items-start">
          {inBubble ? (
            <div
              className={`rounded-2xl ${corner} ${bubbleBg} ${bubblePadding} ${
                isFailed && !isInbound ? "ring-1 ring-destructive/50" : ""
              }`}
            >
              {isImageVideo && (
                <div className="overflow-hidden rounded-xl">
                  {hasMedia && <MediaContent message={message} />}
                </div>
              )}
              {!isImageVideo && hasMedia && <MediaContent message={message} />}
              {caption && (
                <p
                  className={`text-sm whitespace-pre-wrap ${
                    isImageVideo ? "px-2.5 pt-2" : "px-1 pt-1.5"
                  }`}
                >
                  {message.templateParameters
                    ? renderTemplateTextWithValues(
                        message.body,
                        message.templateParameters,
                      )
                    : message.body}
                </p>
              )}
              {message.errorMessage && (
                <p className="text-[10px] text-destructive mt-1">
                  {message.errorMessage}
                </p>
              )}
              {metaRow}
            </div>
          ) : (
            <div className="flex flex-col">
              {hasMedia && <MediaContent message={message} />}
              {caption && (
                <p className="text-sm whitespace-pre-wrap mt-1.5 px-1 text-foreground/90">
                  {message.templateParameters
                    ? renderTemplateTextWithValues(
                        message.body,
                        message.templateParameters,
                      )
                    : message.body}
                </p>
              )}
              {message.errorMessage && (
                <p className="text-[10px] text-destructive mt-1">
                  {message.errorMessage}
                </p>
              )}
              <div
                className={`flex items-center gap-1 mt-1 ${
                  isInbound ? "justify-start" : "justify-end"
                }`}
              >
                <span className="text-[10px] text-muted-foreground">
                  {time}
                </span>
                {!isInbound && <MessageStatusIcon status={message.status} />}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5 order-first opacity-0 group-hover:opacity-100 transition-opacity">
          {isFailed && !isInbound && (
            <button
              onClick={() => onRetry(message)}
              disabled={retrying}
              className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0"
              title="Retry"
            >
              {retrying ? (
                <Spinner className="h-3.5 w-3.5" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          )}
          {isLast && !isInbound && canDelete && (
            <button
              onClick={() => onDelete(message)}
              disabled={deleting}
              className="p-1.5 rounded-full hover:bg-destructive/10 transition-colors shrink-0"
              title="Delete this message"
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive/70" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ConversationDetailModal({
  open,
  onOpenChange,
  conversation,
  companyId,
}: ConversationDetailModalProps) {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [deletingLast, setDeletingLast] = useState(false);
  const [retryingMsgId, setRetryingMsgId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    file: File | null;
    fileUrl: string;
    previewUrl: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && conversation) {
      setLoading(true);
      whatsappService
        .getConversation(conversation.id, companyId ?? undefined)
        .then((data) => {
          setMessages(data.messages || []);
        })
        .catch((err) => {
          toast.error(getErrorMessage(err, "Failed to load conversation"));
        })
        .finally(() => setLoading(false));
    }
  }, [open, conversation, companyId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = async (file: File | undefined) => {
    if (!file || !conversation) return;
    const error = validateMediaFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    // Stage a local preview only — the S3 upload happens when the message is sent (Enter).
    const previewUrl = URL.createObjectURL(file);
    setPendingImage((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return { file, fileUrl: "", previewUrl };
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleImageSelect(e.target.files?.[0]);
    e.target.value = "";
  };

  const clearPendingImage = () => {
    setPendingImage((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  };

  /** Uploads the staged file (if any) and returns its S3 URL. */
  const uploadStagedImage = async (file: File | null): Promise<string> => {
    if (!file) return "";
    const result = await uploadService.uploadImage(file);
    return result.fileUrl;
  };

  const handleSend = async () => {
    if (!conversation) return;
    const body = newMessage.trim();
    const media = pendingImage;
    if (!body && !media) return;
    setSending(true);
    try {
      let mediaUrl = media?.fileUrl || "";
      if (media && !mediaUrl && media.file) {
        setUploadingImage(true);
        try {
          mediaUrl = await uploadStagedImage(media.file);
        } finally {
          setUploadingImage(false);
        }
      }
      const res = await whatsappService.sendMessage({
        to: conversation.contactPhone,
        body,
        mediaUrl: mediaUrl ? [mediaUrl] : undefined,
        mediaType: mediaUrl ? "image" : undefined,
      });
      const newMsg: WhatsAppMessage = {
        id: res.messageId,
        conversationId: conversation.id,
        direction: "outbound",
        messageType: mediaUrl ? "image" : "text",
        body,
        mediaUrl: mediaUrl || null,
        metaWamid: res.metaWamid,
        status: "sent",
        statusUpdatedAt: new Date().toISOString(),
        errorCode: null,
        errorMessage: null,
        sentAt: new Date().toISOString(),
        deliveredAt: null,
        readAt: null,
        failedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      clearPendingImage();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send message"));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleRetryMessage = async (msg: WhatsAppMessage) => {
    if (!conversation || retryingMsgId) return;
    setRetryingMsgId(msg.id);
    try {
      await whatsappService.retryMessage(conversation.id, msg.id);
      toast.success("Message retried");
      const data = await whatsappService.getConversation(conversation.id);
      setMessages(data.messages || []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to retry message"));
    } finally {
      setRetryingMsgId(null);
    }
  };

  const handleDeleteLastMessage = async () => {
    if (!conversation || messages.length === 0 || deletingLast) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.status === "pending" || lastMsg.status === "queued") {
      toast.error("Cannot delete a message that is still sending");
      return;
    }
    setDeletingLast(true);
    try {
      await whatsappService.deleteMessage(conversation.id, lastMsg.id);
      toast.success("Last message deleted");
      setMessages((prev) => prev.filter((m) => m.id !== lastMsg.id));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete message"));
    } finally {
      setDeletingLast(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex flex-col md:flex-row md:items-center gap-2 p-3 border-b shrink-0">
          <div className="flex flex-row items-center gap-2">
            <button onClick={() => onOpenChange(false)}>
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-sm truncate">
                  {conversation?.contactPhone || "Conversation"}
                </DialogTitle>
                {conversation?.contactName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.contactName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {conversation && (
            <span className="text-xs capitalize text-muted-foreground">
              {conversation.status}
            </span>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background to-muted/20">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner className="h-6 w-6" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Phone className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No messages yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Send a message to start the conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLast={i === messages.length - 1}
                  onDelete={handleDeleteLastMessage}
                  onRetry={handleRetryMessage}
                  deleting={deletingLast}
                  retrying={retryingMsgId === msg.id}
                />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isPlatformAdmin &&
          conversation &&
          conversation.status !== "closed" && (
            <div className="p-4 border-t shrink-0">
              {pendingImage && (
                <div className="relative mb-3 inline-flex">
                  {/* eslint-disable-next-line @next/next/no-img-element -- S3/blob URLs */}
                  <img
                    src={pendingImage.previewUrl}
                    alt="Selected"
                    className="max-h-36 rounded-lg border border-border object-contain"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60">
                      <Spinner className="h-5 w-5" />
                    </div>
                  )}
                  {!uploadingImage && (
                    <button
                      type="button"
                      onClick={clearPendingImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-background border shadow-sm hover:bg-muted"
                      title="Remove image"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-background px-1.5 py-0.5 rounded border border-border whitespace-nowrap">
                    {pendingImage.file
                      ? `${formatBytes(pendingImage.file.size)} · press Enter to send`
                      : "Ready to send"}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending || uploadingImage}
                  title="Send an image"
                >
                  {uploadingImage ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  showLeftBorder={false}
                  disabled={sending || uploadingImage}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={() => void handleSend()}
                  disabled={
                    sending ||
                    uploadingImage ||
                    (!newMessage.trim() && !pendingImage)
                  }
                >
                  {sending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
