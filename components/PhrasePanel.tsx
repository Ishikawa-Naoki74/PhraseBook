"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { thumbGradient, thumbUrl, formatAddedAt, AiMode, AiResult, callAi } from "@/lib/utils";
import AiResults from "./AiResults";
import {
  ChevronDownIcon,
  DotsIcon,
  ExternalLinkIcon,
  StarIcon,
  CheckWhiteIcon,
  SparkleIcon,
  RepeatIcon,
  SwapWordIcon,
  ExtractIcon,
  YoutubeBadgeIcon,
  PlayIcon,
} from "./icons";
import ChannelAvatar from "./ChannelAvatar";

type Kind = "phrase" | "word" | "memo";

const TAB_LABELS: { key: Kind; label: string }[] = [
  { key: "phrase", label: "保存したフレーズ" },
  { key: "word", label: "単語" },
  { key: "memo", label: "メモ" },
];

type AiState = { mode: AiMode; loading: boolean; result?: AiResult; error?: string } | null;

function AiActionButton({
  icon,
  label,
  loading,
  primary,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  loading: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={primary ? "btn-ai" : "btn-ghost"}
      disabled={loading}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 42,
        padding: "0 16px",
        border: primary ? "1px solid rgba(124,92,255,0.30)" : "1px solid rgba(255,255,255,0.10)",
        borderRadius: 11,
        background: primary ? "rgba(124,92,255,0.06)" : "transparent",
        color: primary ? "#d3c9f5" : "#c4c4d2",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function PhraseCard({ phrase }: { phrase: Doc<"phrases"> }) {
  const toggleStar = useMutation(api.phrases.toggleStar);
  const removePhrase = useMutation(api.phrases.remove);
  const addPhrase = useMutation(api.phrases.add);
  const addIdiom = useMutation(api.idioms.add);
  const savedIdioms = useQuery(api.idioms.bySourcePhrase, { phraseId: phrase._id });

  const [checked, setChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [ai, setAi] = useState<AiState>(null);

  const isMemo = phrase.kind === "memo";
  // メモ以外はカード全体をクリックするとAI機能が開く
  const collapsible = !isMemo;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  async function runAi(mode: AiMode) {
    setAi({ mode, loading: true });
    try {
      const result = await callAi(mode, phrase.en, phrase.ja);
      setAi({ mode, loading: false, result });
    } catch (e) {
      setAi({ mode, loading: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return (
    <div
      onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "18px 20px",
        background: "#100f18",
        cursor: collapsible ? "pointer" : undefined,
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <div
          onClick={(e) => {
            stop(e);
            setChecked(!checked);
          }}
          style={{
            width: 19,
            height: 19,
            flexShrink: 0,
            borderRadius: 6,
            border: checked ? "none" : "1.8px solid rgba(255,255,255,0.22)",
            marginTop: 2,
            cursor: "pointer",
            background: checked ? "linear-gradient(135deg,#8257ff,#6d3ce6)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {checked && <CheckWhiteIcon />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f6", lineHeight: 1.4 }}>{phrase.en}</div>
          {phrase.ja && (
            <div style={{ fontSize: 13.5, color: "#9a9ab0", marginTop: 8, lineHeight: 1.5 }}>{phrase.ja}</div>
          )}
          {phrase.example && (
            <div style={{ borderLeft: "2px solid rgba(124,92,255,0.4)", paddingLeft: 12, marginTop: 10 }}>
              <div style={{ fontSize: 13.5, color: "#e9e9f0", lineHeight: 1.45 }}>{phrase.example}</div>
              {phrase.exampleJa && (
                <div style={{ fontSize: 12.5, color: "#8a8a9e", marginTop: 2, lineHeight: 1.45 }}>{phrase.exampleJa}</div>
              )}
            </div>
          )}
          {phrase.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={phrase.imageUrl}
              alt={phrase.en}
              style={{
                display: "block",
                marginTop: 12,
                maxWidth: 260,
                maxHeight: 180,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexShrink: 0 }}>
          {collapsible && (
            <div
              title={open ? "AI機能を隠す" : "AI機能を表示"}
              style={{
                display: "flex",
                marginTop: 1,
                color: "#8a8a9e",
                transform: open ? "none" : "rotate(-90deg)",
                transition: "transform 0.15s",
              }}
            >
              <ChevronDownIcon size={18} color="currentColor" />
            </div>
          )}
          <div onClick={(e) => { stop(e); toggleStar({ id: phrase._id }); }} style={{ cursor: "pointer", display: "flex" }}>
            <StarIcon filled={phrase.starred} />
          </div>
          <div style={{ position: "relative" }}>
            <div onClick={(e) => { stop(e); setMenuOpen(!menuOpen); }} style={{ cursor: "pointer", display: "flex" }}>
              <DotsIcon size={20} />
            </div>
            {menuOpen && (
              <div
                onClick={stop}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 26,
                  background: "#1c1b27",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 10,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                  zIndex: 10,
                  minWidth: 120,
                  overflow: "hidden",
                }}
              >
                <div
                  className="nav-item"
                  onClick={() => {
                    setMenuOpen(false);
                    if (confirm("このフレーズを削除しますか?")) {
                      removePhrase({ id: phrase._id });
                    }
                  }}
                  style={{ padding: "10px 14px", fontSize: 13, color: "#f87171", cursor: "pointer" }}
                >
                  削除する
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isMemo && open && savedIdioms && savedIdioms.length > 0 && (
        <div onClick={stop} style={{ marginTop: 16, paddingLeft: 33, cursor: "default" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "#c3b0ff" }}>
            <ExtractIcon size={14} />
            抽出した構文 ({savedIdioms.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {savedIdioms.map((idiom) => (
              <div key={idiom._id} style={{ borderLeft: "2px solid rgba(124,92,255,0.4)", paddingLeft: 12 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "#c3b0ff",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    lineHeight: 1.4,
                  }}
                >
                  {idiom.pattern}
                </div>
                <div style={{ fontSize: 12.5, color: "#8a8a9e", marginTop: 2, lineHeight: 1.45 }}>{idiom.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isMemo && open && (
        <div onClick={stop} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, paddingLeft: 33, flexWrap: "wrap", cursor: "default" }}>
          <AiActionButton
            icon={<SparkleIcon />}
            label="AIで例文を作成"
            primary
            loading={ai?.loading ?? false}
            onClick={() => runAi("examples")}
          />
          <AiActionButton
            icon={<RepeatIcon />}
            label="言い換え表現"
            loading={ai?.loading ?? false}
            onClick={() => runAi("paraphrase")}
          />
          <AiActionButton
            icon={<SwapWordIcon />}
            label="単語を入れ替えてみる"
            loading={ai?.loading ?? false}
            onClick={() => runAi("swap")}
          />
          <AiActionButton
            icon={<ExtractIcon />}
            label="構文を抽出"
            loading={ai?.loading ?? false}
            onClick={() => runAi("idioms")}
          />
        </div>
      )}

      {!isMemo && open && ai && (
        <div onClick={stop} style={{ cursor: "default" }}>
          <AiResults
            mode={ai.mode}
            loading={ai.loading}
            error={ai.error}
            result={ai.result}
            onClose={() => setAi(null)}
            onSave={(en, ja) => addPhrase({ videoId: phrase.videoId, kind: "phrase", en, ja })}
            onSaveIdiom={(idiom) =>
              addIdiom({
                pattern: idiom.pattern,
                meaning: idiom.meaning,
                examples: idiom.examples,
                sourceVideoId: phrase.videoId,
                sourcePhraseId: phrase._id,
              })
            }
          />
        </div>
      )}
    </div>
  );
}

type Props = {
  video: (Doc<"videos"> & { phraseCount: number }) | null;
  search: string;
  onDeleteVideo: (id: Id<"videos">) => void;
  onAddPhrase: () => void;
};

export default function PhrasePanel({ video, search, onDeleteVideo, onAddPhrase }: Props) {
  const [tab, setTab] = useState<Kind>("phrase");
  const [sortDesc, setSortDesc] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const phrases = useQuery(api.phrases.listByVideo, video ? { videoId: video._id } : "skip");

  if (!video) {
    return (
      <section
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8a8a9e",
          fontSize: 14,
        }}
      >
        左の一覧から動画を選択してください。
      </section>
    );
  }

  const url = thumbUrl(video.youtubeId);
  const counts: Record<Kind, number> = { phrase: 0, word: 0, memo: 0 };
  for (const p of phrases ?? []) counts[p.kind]++;

  const visible = (phrases ?? [])
    .filter((p) => p.kind === tab)
    .filter(
      (p) =>
        !search ||
        p.en.toLowerCase().includes(search.toLowerCase()) ||
        p.ja.includes(search)
    )
    .sort((a, b) => (sortDesc ? b.addedAt - a.addedAt : a.addedAt - b.addedAt));

  return (
    <section
      style={{
        flex: 1,
        minWidth: 0,
        overflowY: "auto",
        padding: "24px 30px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      <div style={{ display: "flex", gap: 18 }}>
        <div
          style={{
            position: "relative",
            width: 238,
            height: 134,
            flexShrink: 0,
            borderRadius: 14,
            overflow: "hidden",
            background: thumbGradient(video.title),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#e62b1e",
                letterSpacing: 2,
                fontFamily: "Arial,sans-serif",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {video.channel.split(" ")[0].toUpperCase().slice(0, 8)}
            </span>
          )}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "rgba(20,20,25,0.55)",
                backdropFilter: "blur(2px)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <PlayIcon />
            </a>
          </div>
          {video.duration && (
            <span
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
                fontSize: 11,
                fontWeight: 600,
                color: "#fff",
                background: "rgba(0,0,0,0.78)",
                borderRadius: 5,
                padding: "2px 6px",
              }}
            >
              {video.duration}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{video.title}</h2>
            <div style={{ display: "flex", gap: 14, flexShrink: 0, paddingTop: 4 }}>
              <div style={{ position: "relative" }}>
                <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: "pointer", display: "flex" }}>
                  <DotsIcon size={22} color="#8a8a9e" />
                </div>
                {menuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 28,
                      background: "#1c1b27",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 10,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                      zIndex: 10,
                      minWidth: 120,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="nav-item"
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`「${video.title}」を削除しますか?\n保存したフレーズも削除されます。`)) {
                          onDeleteVideo(video._id);
                        }
                      }}
                      style={{ padding: "10px 14px", fontSize: 13, color: "#f87171", cursor: "pointer" }}
                    >
                      削除する
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <a
            href={video.channelUrl ?? video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 14, color: "inherit" }}
          >
            {video.channelIcon ? (
              <ChannelAvatar name={video.channel} iconUrl={video.channelIcon} size={28} />
            ) : (
              <YoutubeBadgeIcon />
            )}
            <span style={{ fontSize: 13.5, color: "#c4c4d2", fontWeight: 500 }}>{video.channel}</span>
          </a>
          <div style={{ fontSize: 13, color: "#8a8a9e", marginTop: 10 }}>{formatAddedAt(video.addedAt)}</div>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13.5, fontWeight: 500 }}
          >
            YouTubeで視聴 <ExternalLinkIcon />
          </a>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 28 }}>
          {TAB_LABELS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: "0 2px 13px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  whiteSpace: "nowrap",
                  color: active ? "#c3b0ff" : "#8a8a9e",
                  boxShadow: active ? "inset 0 -2px 0 #8257ff" : "none",
                }}
              >
                {label} ({counts[key]})
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 12 }}>
          <button
            className="btn-ai"
            onClick={onAddPhrase}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              height: 34,
              padding: "0 13px",
              border: "1px solid rgba(124,92,255,0.30)",
              borderRadius: 9,
              background: "rgba(124,92,255,0.06)",
              color: "#d3c9f5",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span style={{ display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bff" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            フレーズを追加
          </button>
          <div
            onClick={() => setSortDesc(!sortDesc)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              color: "#9a9ab0",
              cursor: "pointer",
            }}
          >
            {sortDesc ? "新しい順" : "古い順"} <ChevronDownIcon size={15} color="currentColor" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {visible.length === 0 && (
          <div style={{ textAlign: "center", color: "#8a8a9e", fontSize: 14, padding: "40px 0" }}>
            {search ? "検索に一致する項目がありません。" : "まだ登録がありません。「フレーズを追加」から保存しましょう。"}
          </div>
        )}
        {visible.map((phrase) => (
          <PhraseCard key={phrase._id} phrase={phrase} />
        ))}
      </div>
    </section>
  );
}
