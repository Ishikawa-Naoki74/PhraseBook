"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AiMode, AiResult, callAi } from "@/lib/utils";
import AiResults from "./AiResults";
import { SparkleIcon, RepeatIcon, SwapWordIcon, ExtractIcon, StarIcon, ChevronDownIcon } from "./icons";

const sectionStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflowY: "auto",
  padding: "24px 30px 40px",
  display: "flex",
  flexDirection: "column",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  background: "#100f18",
};

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: "#fff" }}>{title}</h1>
      <p style={{ margin: "9px 0 24px", fontSize: 13, color: "#8a8a9e" }}>{subtitle}</p>
    </>
  );
}

// ---------- フレーズ一覧 / 単語一覧(全動画横断・種類で切り替え) ----------

const KIND_META: Record<"phrase" | "word", { title: string; subtitle: string; empty: string }> = {
  phrase: {
    title: "フレーズ一覧",
    subtitle: "すべての動画から保存した英文フレーズの一覧です",
    empty: "まだ保存されたフレーズがありません。",
  },
  word: {
    title: "単語一覧",
    subtitle: "すべての動画から保存した単語の一覧です",
    empty: "まだ保存された単語がありません。",
  },
};

export function AllPhrasesView({ search, kind }: { search: string; kind: "phrase" | "word" }) {
  const phrases = useQuery(api.phrases.listAll);
  const toggleStar = useMutation(api.phrases.toggleStar);
  const meta = KIND_META[kind];

  const visible = (phrases ?? [])
    .filter((p) => p.kind === kind)
    .filter(
      (p) =>
        !search ||
        p.en.toLowerCase().includes(search.toLowerCase()) ||
        p.ja.includes(search) ||
        p.videoTitle.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <section style={sectionStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: "#fff" }}>{meta.title}</h1>
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
          {visible.length}
        </span>
      </div>
      <p style={{ margin: "9px 0 24px", fontSize: 13, color: "#8a8a9e" }}>{meta.subtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visible.length === 0 && (
          <div style={{ textAlign: "center", color: "#8a8a9e", fontSize: 14, padding: "60px 0" }}>
            {search ? "検索に一致する項目がありません。" : meta.empty}
          </div>
        )}
        {visible.map((p) => (
          <div
            key={p._id}
            style={{
              ...cardStyle,
              padding: "16px 20px",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f6", lineHeight: 1.4 }}>{p.en}</div>
              {p.ja && <div style={{ fontSize: 13, color: "#9a9ab0", marginTop: 5 }}>{p.ja}</div>}
              {p.example && (
                <div style={{ borderLeft: "2px solid rgba(124,92,255,0.4)", paddingLeft: 12, marginTop: 8 }}>
                  <div style={{ fontSize: 13.5, color: "#e9e9f0", lineHeight: 1.45 }}>{p.example}</div>
                  {p.exampleJa && (
                    <div style={{ fontSize: 12.5, color: "#8a8a9e", marginTop: 2, lineHeight: 1.45 }}>{p.exampleJa}</div>
                  )}
                </div>
              )}
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.en}
                  style={{
                    display: "block",
                    marginTop: 10,
                    maxWidth: 260,
                    maxHeight: 180,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.10)",
                    objectFit: "contain",
                  }}
                />
              )}
              <div style={{ fontSize: 12, color: "#6f6f83", marginTop: 6 }}>{p.videoTitle}</div>
            </div>
            <div onClick={() => toggleStar({ id: p._id })} style={{ cursor: "pointer", display: "flex", flexShrink: 0 }}>
              <StarIcon filled={p.starred} size={20} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- AI活用(自由入力プレイグラウンド) ----------

export function AiPlaygroundView() {
  const addIdiom = useMutation(api.idioms.add);
  const [en, setEn] = useState("");
  const [ja, setJa] = useState("");
  const [ai, setAi] = useState<{ mode: AiMode; loading: boolean; result?: AiResult; error?: string } | null>(null);

  async function run(mode: AiMode) {
    if (!en.trim()) {
      setAi({ mode, loading: false, error: "英文または単語を入力してください。" });
      return;
    }
    setAi({ mode, loading: true });
    try {
      const result = await callAi(mode, en, ja);
      setAi({ mode, loading: false, result });
    } catch (e) {
      setAi({ mode, loading: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 11,
    padding: "12px 14px",
    fontSize: 14,
    color: "#e9e9f0",
    background: "#14131d",
  };

  const btnStyle = (primary: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 44,
    padding: "0 18px",
    border: primary ? "1px solid rgba(124,92,255,0.30)" : "1px solid rgba(255,255,255,0.10)",
    borderRadius: 11,
    background: primary ? "rgba(124,92,255,0.06)" : "transparent",
    color: primary ? "#d3c9f5" : "#c4c4d2",
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
  });

  return (
    <section style={sectionStyle}>
      <SectionHeader
        title="AI活用"
        subtitle="Gemini を使って、任意の英文・単語から例文作成・言い換え・単語の入れ替え練習ができます"
      />
      <div style={{ ...cardStyle, padding: 24, maxWidth: 760 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#c4c4d2", display: "block", marginBottom: 6 }}>
          英文・単語
        </label>
        <textarea
          value={en}
          onChange={(e) => setEn(e.target.value)}
          placeholder="The best way to predict the future is to invent it."
          style={{ ...inputStyle, height: 80, resize: "vertical" }}
        />
        <label style={{ fontSize: 13, fontWeight: 600, color: "#c4c4d2", display: "block", margin: "14px 0 6px" }}>
          日本語の意味(任意)
        </label>
        <input
          value={ja}
          onChange={(e) => setJa(e.target.value)}
          placeholder="未来を予測する最善の方法は、それを自ら創り出すことだ。"
          style={{ ...inputStyle, height: 44, padding: "0 14px" }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <button className="btn-ai" style={btnStyle(true)} disabled={ai?.loading} onClick={() => run("examples")}>
            <SparkleIcon />
            AIで例文を作成
          </button>
          <button className="btn-ghost" style={btnStyle(false)} disabled={ai?.loading} onClick={() => run("paraphrase")}>
            <RepeatIcon />
            言い換え表現
          </button>
          <button className="btn-ghost" style={btnStyle(false)} disabled={ai?.loading} onClick={() => run("swap")}>
            <SwapWordIcon />
            単語を入れ替えてみる
          </button>
          <button className="btn-ghost" style={btnStyle(false)} disabled={ai?.loading} onClick={() => run("idioms")}>
            <ExtractIcon />
            構文を抽出
          </button>
        </div>
        {ai && (
          <AiResults
            mode={ai.mode}
            loading={ai.loading}
            error={ai.error}
            result={ai.result}
            onClose={() => setAi(null)}
            onSaveIdiom={(idiom) =>
              addIdiom({ pattern: idiom.pattern, meaning: idiom.meaning, examples: idiom.examples })
            }
          />
        )}
      </div>
    </section>
  );
}

// ---------- 学習記録 ----------

export function StatsView() {
  const videos = useQuery(api.videos.list);
  const phrases = useQuery(api.phrases.listAll);

  const total = phrases?.length ?? 0;
  const starred = phrases?.filter((p) => p.starred).length ?? 0;
  const words = phrases?.filter((p) => p.kind === "word").length ?? 0;
  const memos = phrases?.filter((p) => p.kind === "memo").length ?? 0;
  const sentences = total - words - memos;

  const cards = [
    { label: "保存した動画", value: videos?.length ?? 0, unit: "本" },
    { label: "フレーズ", value: sentences, unit: "件" },
    { label: "単語", value: words, unit: "語" },
    { label: "スター付き", value: starred, unit: "件" },
  ];

  const ranking = [...(videos ?? [])].sort((a, b) => b.phraseCount - a.phraseCount).slice(0, 5);
  const maxCount = Math.max(1, ...ranking.map((v) => v.phraseCount));

  return (
    <section style={sectionStyle}>
      <SectionHeader title="学習記録" subtitle="保存状況のサマリーです" />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...cardStyle, width: 172, padding: "20px 22px" }}>
            <div style={{ fontSize: 13, color: "#8a8a9e" }}>{c.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", marginTop: 8 }}>
              {c.value}
              <span style={{ fontSize: 14, fontWeight: 500, color: "#8a8a9e", marginLeft: 4 }}>{c.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, padding: 24, maxWidth: 760 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 18 }}>フレーズ数の多い動画</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ranking.length === 0 && <div style={{ fontSize: 13, color: "#8a8a9e" }}>まだデータがありません。</div>}
          {ranking.map((v) => (
            <div key={v._id}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span
                  style={{
                    color: "#d7d7e2",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 520,
                  }}
                >
                  {v.title}
                </span>
                <span style={{ color: "#8a8a9e", flexShrink: 0 }}>{v.phraseCount} 件</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(v.phraseCount / maxCount) * 100}%`,
                    background: "linear-gradient(90deg,#8257ff,#6d3ce6)",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- イディオム集 ----------

export function IdiomsView({ search }: { search: string }) {
  const idioms = useQuery(api.idioms.list);
  const addIdiom = useMutation(api.idioms.add);
  const removeIdiom = useMutation(api.idioms.remove);
  const toggleStar = useMutation(api.idioms.toggleStar);

  const [showForm, setShowForm] = useState(false);
  const [pattern, setPattern] = useState("");
  const [meaning, setMeaning] = useState("");
  const [exEn, setExEn] = useState("");
  const [exJa, setExJa] = useState("");
  // 初期表示は閉じた状態(=パターンのみ表示)。開いたカードのidを保持する
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const visible = (idioms ?? []).filter(
    (i) =>
      !search ||
      i.pattern.toLowerCase().includes(search.toLowerCase()) ||
      i.meaning.includes(search)
  );

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const allRevealed = visible.length > 0 && visible.every((i) => revealed.has(i._id));
  function toggleAll() {
    setRevealed(allRevealed ? new Set() : new Set(visible.map((i) => i._id)));
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13.5,
    color: "#e9e9f0",
    background: "#14131d",
  };

  async function submit() {
    if (!pattern.trim() || !meaning.trim()) return;
    await addIdiom({
      pattern: pattern.trim(),
      meaning: meaning.trim(),
      examples: exEn.trim() ? [{ en: exEn.trim(), ja: exJa.trim() }] : [],
    });
    setPattern("");
    setMeaning("");
    setExEn("");
    setExJa("");
    setShowForm(false);
  }

  return (
    <section style={sectionStyle}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: "#fff" }}>イディオム集</h1>
          <p style={{ margin: "9px 0 24px", fontSize: 13, color: "#8a8a9e" }}>
            使い回せる構文・定型表現のコレクションです。各フレーズの「構文を抽出」から追加できます
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {visible.length > 0 && (
            <button
              className="btn-ghost"
              onClick={toggleAll}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                height: 40,
                padding: "0 14px",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 11,
                background: "transparent",
                color: "#c4c4d2",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {allRevealed ? "意味・例文を隠す" : "意味・例文を表示"}
            </button>
          )}
          <button
            className="btn-ai"
            onClick={() => setShowForm((s) => !s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              height: 40,
              padding: "0 15px",
              border: "1px solid rgba(124,92,255,0.30)",
              borderRadius: 11,
              background: "rgba(124,92,255,0.06)",
              color: "#d3c9f5",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bff" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            手動で追加
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ ...cardStyle, padding: 20, marginBottom: 18, maxWidth: 760, display: "flex", flexDirection: "column", gap: 10 }}>
          <input style={fieldStyle} value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="構文パターン(例: the best way to ~ is to ...)" />
          <input style={fieldStyle} value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="意味・使いどころ(例: 「~する最善の方法は…だ」)" />
          <div style={{ display: "flex", gap: 10 }}>
            <input style={fieldStyle} value={exEn} onChange={(e) => setExEn(e.target.value)} placeholder="例文(英語・任意)" />
            <input style={fieldStyle} value={exJa} onChange={(e) => setExJa(e.target.value)} placeholder="例文の訳(任意)" />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{ height: 38, padding: "0 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.10)", background: "transparent", color: "#c4c4d2", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
            >
              キャンセル
            </button>
            <button
              className="btn-primary"
              onClick={submit}
              style={{ height: 38, padding: "0 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#8257ff,#6d3ce6)", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
            >
              保存する
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {visible.length === 0 && (
          <div style={{ textAlign: "center", color: "#8a8a9e", fontSize: 14, padding: "60px 0", lineHeight: 1.7 }}>
            {search
              ? "検索に一致する構文がありません。"
              : "まだイディオムがありません。フレーズの「構文を抽出」ボタンから、AIの候補を選んで保存できます。"}
          </div>
        )}
        {visible.map((idiom) => {
          const isOpen = revealed.has(idiom._id);
          return (
            <div
              key={idiom._id}
              onClick={() => toggleReveal(idiom._id)}
              style={{ ...cardStyle, padding: "18px 20px", maxWidth: 860, cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#c3b0ff",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    lineHeight: 1.4,
                  }}
                >
                  {idiom.pattern}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <div
                    title={isOpen ? "意味・例文を隠す" : "意味・例文を表示"}
                    style={{
                      display: "flex",
                      transform: isOpen ? "none" : "rotate(-90deg)",
                      transition: "transform 0.15s",
                      color: "#8a8a9e",
                    }}
                  >
                    <ChevronDownIcon size={18} color="currentColor" />
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); toggleStar({ id: idiom._id }); }} style={{ cursor: "pointer", display: "flex" }}>
                    <StarIcon filled={idiom.starred} size={20} />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("このイディオムを削除しますか?")) removeIdiom({ id: idiom._id });
                    }}
                    style={{ cursor: "pointer", display: "flex", color: "#6f6f83" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
                    </svg>
                  </div>
                </div>
              </div>
              {isOpen ? (
                <>
                  <div style={{ fontSize: 14, color: "#c4c4d2", marginTop: 8, lineHeight: 1.5 }}>{idiom.meaning}</div>
                  {idiom.examples.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 12 }}>
                      {idiom.examples.map((ex, j) => (
                        <div key={j} style={{ borderLeft: "2px solid rgba(124,92,255,0.4)", paddingLeft: 12 }}>
                          <div style={{ fontSize: 14, color: "#e9e9f0", lineHeight: 1.45 }}>{ex.en}</div>
                          <div style={{ fontSize: 12.5, color: "#8a8a9e", marginTop: 2, lineHeight: 1.45 }}>{ex.ja}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {idiom.sourceVideoTitle && (
                    <div style={{ fontSize: 11.5, color: "#6f6f83", marginTop: 12 }}>
                      出典: {idiom.sourceVideoTitle}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 12.5, color: "#6f6f83", marginTop: 8 }}>
                  クリックして意味・例文を表示
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- 設定 ----------

export function SettingsView() {
  const [status, setStatus] = useState<{ hasKey: boolean; model: string } | null>(null);

  useEffect(() => {
    fetch("/api/ai")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const codeStyle: React.CSSProperties = {
    background: "#201f2c",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "2px 6px",
    borderRadius: 5,
    color: "#c3b0ff",
  };

  return (
    <section style={sectionStyle}>
      <SectionHeader title="設定" subtitle="各種設定・データ管理" />
      <div style={{ ...cardStyle, padding: 24, maxWidth: 680 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Gemini API</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: status?.hasKey ? "#5ec98a" : "#f87171",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 14, color: "#d7d7e2" }}>
            {status === null
              ? "確認中..."
              : status.hasKey
                ? `APIキー設定済み(モデル: ${status.model})`
                : "APIキーが未設定です"}
          </span>
        </div>
        {status !== null && !status.hasKey && (
          <div style={{ fontSize: 13, color: "#9a9ab0", lineHeight: 1.8 }}>
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
            でAPIキーを取得し、プロジェクト直下の <code style={codeStyle}>.env.local</code> に
            <div
              style={{
                background: "#14131d",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#d7d7e2",
                borderRadius: 8,
                padding: "10px 14px",
                fontFamily: "monospace",
                fontSize: 12,
                margin: "8px 0",
              }}
            >
              GEMINI_API_KEY=あなたのAPIキー
            </div>
            を追加して、開発サーバーを再起動してください。
          </div>
        )}
        <div style={{ fontSize: 12, color: "#8a8a9e", marginTop: 14, lineHeight: 1.7 }}>
          モデルは環境変数 <code style={codeStyle}>GEMINI_MODEL</code> で変更できます(既定: gemini-2.5-flash)。
        </div>
      </div>
    </section>
  );
}
