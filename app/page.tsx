"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Header from "@/components/Header";
import Sidebar, { View } from "@/components/Sidebar";
import VideoList from "@/components/VideoList";
import PhrasePanel from "@/components/PhrasePanel";
import AddModal from "@/components/AddModal";
import { AllPhrasesView, IdiomsView, AiPlaygroundView, StatsView, SettingsView } from "@/components/views";

type AddState = { mode: "video" } | { mode: "phrase"; videoId: Id<"videos"> | null } | null;

export default function Home() {
  const videos = useQuery(api.videos.list);
  const removeVideo = useMutation(api.videos.remove);

  const [view, setView] = useState<View>("videos");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<Id<"videos"> | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [add, setAdd] = useState<AddState>(null);

  // チャンネル一覧(動画の並び順=新しい順を保ちつつ重複排除、アイコンも収集)
  const channels = useMemo(() => {
    const map = new Map<string, { count: number; icon?: string }>();
    for (const v of videos ?? []) {
      const entry = map.get(v.channel) ?? { count: 0 };
      entry.count += 1;
      if (!entry.icon && v.channelIcon) entry.icon = v.channelIcon;
      map.set(v.channel, entry);
    }
    return Array.from(map, ([name, { count, icon }]) => ({ name, count, icon }));
  }, [videos]);

  // 選択中チャンネルが無くなったらリセット
  useEffect(() => {
    if (selectedChannel && videos && !videos.some((v) => v.channel === selectedChannel)) {
      setSelectedChannel(null);
    }
  }, [videos, selectedChannel]);

  // 選択中チャンネルの動画(検索は中央リスト側で適用)
  const channelVideos = (videos ?? []).filter(
    (v) => selectedChannel === null || v.channel === selectedChannel
  );

  // チャンネルを切り替えたら、その先頭動画を自動選択
  useEffect(() => {
    if (channelVideos.length === 0) return;
    if (!selectedId || !channelVideos.some((v) => v._id === selectedId)) {
      setSelectedId(channelVideos[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, selectedChannel, selectedId]);

  const visibleVideos = channelVideos.filter(
    (v) =>
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channel.toLowerCase().includes(search.toLowerCase())
  );

  const selectedVideo = videos?.find((v) => v._id === selectedId) ?? null;

  async function handleDeleteVideo(id: Id<"videos">) {
    await removeVideo({ id });
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        minWidth: 1280,
        background: "linear-gradient(180deg,#0c0b13 0%,#08080d 100%)",
        color: "#e9e9f0",
        overflowY: "hidden",
        overflowX: "auto",
        fontSize: 14,
      }}
    >
      <Header search={search} onSearchChange={setSearch} onAddVideo={() => setAdd({ mode: "video" })} />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          view={view}
          onChangeView={setView}
          channels={channels}
          totalVideos={videos?.length ?? 0}
          selectedChannel={selectedChannel}
          onSelectChannel={(channel) => {
            setView("videos");
            setSelectedChannel(channel);
          }}
        />

        {view === "videos" && (
          <>
            <VideoList
              videos={videos === undefined ? undefined : visibleVideos}
              channelName={selectedChannel}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleDeleteVideo}
            />
            <PhrasePanel
              video={selectedVideo}
              search={search}
              onDeleteVideo={handleDeleteVideo}
              onAddPhrase={() => selectedVideo && setAdd({ mode: "phrase", videoId: selectedVideo._id })}
            />
          </>
        )}
        {view === "phrases" && <AllPhrasesView search={search} kind="phrase" />}
        {view === "words" && <AllPhrasesView search={search} kind="word" />}
        {view === "idioms" && <IdiomsView search={search} />}
        {view === "ai" && <AiPlaygroundView />}
        {view === "stats" && <StatsView />}
        {view === "settings" && <SettingsView />}
      </div>

      {add && (
        <AddModal
          mode={add.mode}
          videos={videos ?? []}
          defaultVideoId={add.mode === "phrase" ? add.videoId : selectedId}
          onClose={() => setAdd(null)}
          onVideoAdded={(id) => {
            setView("videos");
            setSelectedChannel(null);
            setSelectedId(id);
          }}
        />
      )}
    </div>
  );
}
