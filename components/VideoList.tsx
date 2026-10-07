"use client";

import { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { thumbGradient, thumbUrl, formatAddedAt } from "@/lib/utils";
import { SortIcon, ChevronLeftIcon, ChevronRightIcon, DotsIcon, GridIcon, ListIcon } from "./icons";

export type VideoWithCount = Doc<"videos"> & { phraseCount: number };

const PAGE_SIZE = 6;

type Props = {
  videos: VideoWithCount[] | undefined;
  channelName: string | null;
  selectedId: Id<"videos"> | null;
  onSelect: (id: Id<"videos">) => void;
  onDelete: (id: Id<"videos">) => void;
};

function Thumbnail({ video, width, height, fontSize }: { video: VideoWithCount; width: number; height: number; fontSize: number }) {
  const url = thumbUrl(video.youtubeId);
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 11,
        overflow: "hidden",
        flexShrink: 0,
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
            fontSize,
            fontWeight: 800,
            color: "#e62b1e",
            letterSpacing: 1,
            fontFamily: "Arial,sans-serif",
            padding: "0 8px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {video.channel.split(" ")[0].toUpperCase().slice(0, 8)}
        </span>
      )}
      {video.duration && (
        <span
          style={{
            position: "absolute",
            right: 5,
            bottom: 5,
            fontSize: 10.5,
            fontWeight: 600,
            color: "#fff",
            background: "rgba(0,0,0,0.78)",
            borderRadius: 5,
            padding: "1px 5px",
          }}
        >
          {video.duration}
        </span>
      )}
    </div>
  );
}

const pageBtnBase: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#14131d",
  color: "#c4c4d2",
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function VideoCard({
  video,
  active,
  viewMode,
  menuOpen,
  onToggleMenu,
  onSelect,
  onDelete,
}: {
  video: VideoWithCount;
  active: boolean;
  viewMode: "grid" | "list";
  menuOpen: boolean;
  onToggleMenu: () => void;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={active ? undefined : "video-card"}
      onClick={onSelect}
      style={{
        display: "flex",
        gap: 13,
        padding: 12,
        borderRadius: 15,
        cursor: "pointer",
        background: active ? "rgba(124,92,255,0.10)" : "#100f18",
        border: active ? "1px solid rgba(124,92,255,0.45)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: active ? "0 0 0 1px rgba(124,92,255,0.15)" : undefined,
        alignItems: viewMode === "list" ? "center" : undefined,
      }}
    >
      {viewMode === "grid" && <Thumbnail video={video} width={120} height={74} fontSize={26} />}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#f0f0f6",
              lineHeight: 1.35,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {video.title}
          </div>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu();
              }}
              style={{ marginTop: 2, cursor: "pointer" }}
            >
              <DotsIcon />
            </div>
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 24,
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMenu();
                    if (confirm(`「${video.title}」を削除しますか?\n保存したフレーズも削除されます。`)) {
                      onDelete();
                    }
                  }}
                  className="nav-item"
                  style={{ padding: "10px 14px", fontSize: 13, color: "#f87171", cursor: "pointer" }}
                >
                  削除する
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "#8a8a9e", marginTop: 5 }}>{video.channel}</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11.5, color: "#6f6f83" }}>{formatAddedAt(video.addedAt)}</span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "#b9a5ff",
              background: "rgba(124,92,255,0.16)",
              borderRadius: 7,
              padding: "3px 9px",
            }}
          >
            {video.phraseCount} フレーズ
          </span>
        </div>
      </div>
    </div>
  );
}

export default function VideoList({ videos, channelName, selectedId, onSelect, onDelete }: Props) {
  const [sort, setSort] = useState<"new" | "old">("new");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [menuFor, setMenuFor] = useState<Id<"videos"> | null>(null);

  const sorted = [...(videos ?? [])].sort((a, b) =>
    sort === "new" ? b.addedAt - a.addedAt : a.addedAt - b.addedAt
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section
      style={{
        width: 512,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div style={{ padding: "22px 26px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: "#fff" }}>
            {channelName ?? "動画一覧"}
          </h1>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#b9a5ff",
              background: "rgba(124,92,255,0.18)",
              borderRadius: 8,
              padding: "3px 11px",
            }}
          >
            {videos?.length ?? 0}
          </span>
        </div>
        <p style={{ margin: "9px 0 18px", fontSize: 13, color: "#8a8a9e" }}>
          {channelName
            ? `「${channelName}」から保存した動画です`
            : "保存したYouTube動画から学んだフレーズを管理できます"}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ position: "relative" }}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "new" | "old")}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                height: 42,
                padding: "0 40px 0 14px",
                background: "#14131d",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 11,
                cursor: "pointer",
                fontSize: 13.5,
                color: "#d7d7e2",
              }}
            >
              <option value="new">新しい順</option>
              <option value="old">古い順</option>
            </select>
            <SortIcon style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 4,
              background: "#14131d",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 11,
            }}
          >
            {(
              [
                { key: "grid", icon: <GridIcon /> },
                { key: "list", icon: <ListIcon /> },
              ] as const
            ).map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                style={{
                  width: 40,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "none",
                  background: viewMode === key ? "linear-gradient(135deg,#8257ff,#6d3ce6)" : "transparent",
                  color: viewMode === key ? "#fff" : "#8a8a9e",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px", display: "flex", flexDirection: "column", gap: 11 }}>
        {videos !== undefined && sorted.length === 0 && (
          <div style={{ textAlign: "center", color: "#8a8a9e", fontSize: 14, padding: "60px 0" }}>
            {channelName
              ? "このチャンネルの動画はまだありません。"
              : "動画がまだありません。「フレーズを追加」から保存しましょう。"}
          </div>
        )}
        {pageItems.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            active={video._id === selectedId}
            viewMode={viewMode}
            menuOpen={menuFor === video._id}
            onToggleMenu={() => setMenuFor(menuFor === video._id ? null : video._id)}
            onSelect={() => onSelect(video._id)}
            onDelete={() => onDelete(video._id)}
          />
        ))}
      </div>

      <div
        style={{
          padding: "13px 22px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 7,
        }}
      >
        <button className="page-btn" onClick={() => setPage(Math.max(1, currentPage - 1))} style={{ ...pageBtnBase, color: "#9a9ab0" }}>
          <ChevronLeftIcon />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={p === currentPage ? undefined : "page-btn"}
            onClick={() => setPage(p)}
            style={
              p === currentPage
                ? {
                    ...pageBtnBase,
                    border: "none",
                    background: "linear-gradient(135deg,#8257ff,#6d3ce6)",
                    color: "#fff",
                    fontWeight: 600,
                  }
                : pageBtnBase
            }
          >
            {p}
          </button>
        ))}
        <button className="page-btn" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} style={{ ...pageBtnBase, color: "#9a9ab0" }}>
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}
