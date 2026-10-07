"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { extractYoutubeId } from "@/lib/utils";
import { CloseIcon } from "./icons";
import { VideoWithCount } from "./VideoList";

type Props = {
  mode: "video" | "phrase";
  videos: VideoWithCount[];
  defaultVideoId: Id<"videos"> | null;
  onClose: () => void;
  onVideoAdded: (id: Id<"videos">) => void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 11,
  padding: "0 14px",
  fontSize: 14,
  color: "#e9e9f0",
  background: "#14131d",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#c4c4d2",
  marginBottom: 6,
  display: "block",
};

export default function AddModal({ mode, videos, defaultVideoId, onClose, onVideoAdded }: Props) {
  const addVideo = useMutation(api.videos.add);
  const addPhrase = useMutation(api.phrases.add);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // 動画タブ
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("");
  const [duration, setDuration] = useState("");
  const [channelUrl, setChannelUrl] = useState<string | undefined>();
  const [channelIcon, setChannelIcon] = useState<string | undefined>();
  const [fetching, setFetching] = useState(false);

  // フレーズタブ
  const [videoId, setVideoId] = useState<string>(defaultVideoId ?? videos[0]?._id ?? "");
  const [kind, setKind] = useState<"phrase" | "word" | "memo">("phrase");
  const [en, setEn] = useState("");
  const [ja, setJa] = useState("");
  const [example, setExample] = useState("");
  const [exampleJa, setExampleJa] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  async function fetchMeta(u: string) {
    setUrl(u);
    setError("");
    if (!extractYoutubeId(u)) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/youtube?url=${encodeURIComponent(u)}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title ?? "");
        setChannel(data.channel ?? "");
        setChannelUrl(data.channelUrl ?? undefined);
        setChannelIcon(data.channelIcon ?? undefined);
      }
    } finally {
      setFetching(false);
    }
  }

  async function submitVideo() {
    if (!title.trim()) {
      setError("タイトルを入力してください。");
      return;
    }
    setBusy(true);
    try {
      const youtubeId = extractYoutubeId(url) ?? undefined;
      const id = await addVideo({
        title: title.trim(),
        channel: channel.trim() || "不明なチャンネル",
        url: url.trim() || "https://www.youtube.com",
        youtubeId,
        duration: duration.trim() || undefined,
        channelUrl,
        channelIcon,
      });
      onVideoAdded(id);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  async function submitPhrase() {
    if (!videoId) {
      setError("動画を選択してください。先に動画を追加してください。");
      return;
    }
    if (!en.trim()) {
      setError(kind === "memo" ? "メモを入力してください。" : "英文・単語を入力してください。");
      return;
    }
    setBusy(true);
    try {
      await addPhrase({
        videoId: videoId as Id<"videos">,
        kind,
        en: en.trim(),
        ja: ja.trim(),
        example: kind === "word" && example.trim() ? example.trim() : undefined,
        exampleJa: kind === "word" && exampleJa.trim() ? exampleJa.trim() : undefined,
        imageUrl: kind === "word" && imageUrl.trim() ? imageUrl.trim() : undefined,
      });
      onClose();
    } finally {
      setBusy(false);
    }
  }

  const title_ = mode === "video" ? "動画を追加" : "フレーズを追加";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxWidth: "92vw",
          background: "#100f18",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{title_}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}>
            <CloseIcon />
          </button>
        </div>

        {mode === "video" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>YouTube URL</label>
              <input
                style={inputStyle}
                value={url}
                onChange={(e) => fetchMeta(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                autoFocus
              />
              <div style={{ fontSize: 12, color: "#8a8a9e", marginTop: 6 }}>
                {fetching
                  ? "動画情報を取得中..."
                  : "URLを貼り付けるとタイトル・チャンネル名・アイコンを自動取得します。"}
              </div>
            </div>
            {channelIcon && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={channelIcon}
                  alt=""
                  width={28}
                  height={28}
                  style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ fontSize: 13, color: "#c4c4d2" }}>{channel}</span>
              </div>
            )}
            <div>
              <label style={labelStyle}>タイトル</label>
              <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="動画のタイトル" />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>チャンネル名</label>
                <input style={inputStyle} value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="チャンネル名" />
              </div>
              <div style={{ width: 130 }}>
                <label style={labelStyle}>長さ(任意)</label>
                <input style={inputStyle} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="11:23" />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>保存先の動画</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
              >
                {videos.length === 0 && <option value="">(動画がありません)</option>}
                {[...new Set(videos.map((v) => v.channel))].map((ch) => (
                  <optgroup key={ch} label={ch}>
                    {videos
                      .filter((v) => v.channel === ch)
                      .map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.title}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>種類</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(
                  [
                    { key: "phrase", label: "フレーズ" },
                    { key: "word", label: "単語" },
                    { key: "memo", label: "メモ" },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setKind(key)}
                    style={{
                      flex: 1,
                      height: 38,
                      border: kind === key ? "1px solid rgba(124,92,255,0.45)" : "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 9,
                      background: kind === key ? "rgba(124,92,255,0.15)" : "#14131d",
                      color: kind === key ? "#c3b0ff" : "#9a9ab0",
                      fontSize: 14,
                      fontWeight: kind === key ? 600 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{kind === "memo" ? "メモ" : kind === "word" ? "単語" : "英文"}</label>
              <textarea
                style={{ ...inputStyle, height: kind === "word" ? 44 : 80, padding: "12px 14px", resize: "vertical" }}
                value={en}
                onChange={(e) => setEn(e.target.value)}
                placeholder={
                  kind === "memo"
                    ? "メモを入力..."
                    : kind === "word"
                      ? "remarkable"
                      : "The best way to predict the future is to invent it."
                }
                autoFocus
              />
            </div>
            {kind !== "memo" && (
              <div>
                <label style={labelStyle}>{kind === "word" ? "意味(任意)" : "日本語訳(任意)"}</label>
                <textarea
                  style={{ ...inputStyle, height: 60, padding: "12px 14px", resize: "vertical" }}
                  value={ja}
                  onChange={(e) => setJa(e.target.value)}
                  placeholder={kind === "word" ? "注目に値する、目覚ましい" : "未来を予測する最善の方法は、それを自ら創り出すことだ。"}
                />
              </div>
            )}
            {kind === "word" && (
              <>
                <div>
                  <label style={labelStyle}>例文(英語・任意)</label>
                  <textarea
                    style={{ ...inputStyle, height: 60, padding: "12px 14px", resize: "vertical" }}
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    placeholder="Small habits lead to remarkable results."
                  />
                </div>
                <div>
                  <label style={labelStyle}>例文の訳(任意)</label>
                  <textarea
                    style={{ ...inputStyle, height: 50, padding: "12px 14px", resize: "vertical" }}
                    value={exampleJa}
                    onChange={(e) => setExampleJa(e.target.value)}
                    placeholder="小さな習慣が目覚ましい結果につながる。"
                  />
                </div>
                <div>
                  <label style={labelStyle}>画像URL(任意・イメージで覚える用)</label>
                  <input
                    style={inputStyle}
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageError(false);
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div style={{ fontSize: 12, color: "#8a8a9e", marginTop: 6 }}>
                    画像のURL(リンク)を貼り付けると、単語と一緒に画像で覚えられます。
                  </div>
                  {imageUrl.trim() &&
                    (imageError ? (
                      <div style={{ fontSize: 12, color: "#fca5a5", marginTop: 8 }}>
                        画像を読み込めませんでした。URLを確認してください。
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl.trim()}
                        alt=""
                        onError={() => setImageError(true)}
                        style={{
                          marginTop: 10,
                          maxWidth: "100%",
                          maxHeight: 180,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.10)",
                          objectFit: "contain",
                        }}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {error && <div style={{ marginTop: 14, fontSize: 13, color: "#fca5a5" }}>{error}</div>}

        <button
          className="btn-primary"
          disabled={busy}
          onClick={mode === "video" ? submitVideo : submitPhrase}
          style={{
            width: "100%",
            height: 48,
            marginTop: 22,
            background: "linear-gradient(135deg,#8257ff,#6d3ce6)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 14.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(124,60,230,0.4)",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? "保存中..." : "保存する"}
        </button>
      </div>
    </div>
  );
}
