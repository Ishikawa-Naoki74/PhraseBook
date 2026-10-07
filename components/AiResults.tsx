"use client";

import { useState } from "react";
import {
  AiMode,
  AiResult,
  ExamplesResult,
  ParaphraseResult,
  SwapResult,
  IdiomsResult,
  IdiomItem,
} from "@/lib/utils";
import { CloseIcon, SparkleIcon, RepeatIcon, SwapWordIcon, ExtractIcon } from "./icons";

const MODE_LABELS: Record<AiMode, string> = {
  examples: "AIが作成",
  paraphrase: "言い表現",
  swap: "単語を入れ替えてみる",
  idioms: "使える構文・イディオム",
};

const MODE_ICONS: Record<AiMode, React.ReactNode> = {
  examples: <SparkleIcon size={16} />,
  paraphrase: <RepeatIcon size={16} />,
  swap: <SwapWordIcon size={16} />,
  idioms: <ExtractIcon size={16} />,
};

type Props = {
  mode: AiMode;
  loading: boolean;
  error?: string;
  result?: AiResult;
  onClose: () => void;
  // 指定された場合、各結果に「フレーズとして保存」ボタンを表示する
  onSave?: (en: string, ja: string) => void;
  // 指定された場合、イディオム結果に「イディオム集に保存」ボタンを表示する
  onSaveIdiom?: (idiom: IdiomItem) => void;
};

function SaveButton({ en, ja, onSave }: { en: string; ja: string; onSave: (en: string, ja: string) => void }) {
  const [saved, setSaved] っd= useState(false);
  return (
    <button
      className="save-link"
      disabled={saved}
      onClick={() => {
        onSave(en, ja);
        setSaved(true);
      }}
      style={{
        border: "none",
        background: "none",
        color: saved ? "#8a8a9e" : "#a78bff",
        fontSize: 12,
        fontWeight: 600,
        cursor: saved ? "default" : "pointer",
        padding: 0,
        flexShrink: 0,
      }}
    >
      {saved ? "✓ 保存済み" : "+ フレーズとして保存"}
    </button>
  );
}

function ResultRow({
  en,
  ja,
  note,
  onSave,
}: {
  en: string;
  ja: string;
  note?: string;
  onSave?: (en: string, ja: string) => void;
}) {
  return (
    <div
      style={{
        background: "#14131d",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 11,
        padding: "12px 14px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f0f6", lineHeight: 1.5 }}>{en}</div>
        {onSave && <SaveButton en={en} ja={ja} onSave={onSave} />}
      </div>
      <div style={{ fontSize: 13, color: "#9a9ab0", marginTop: 6, lineHeight: 1.5 }}>{ja}</div>
      {note && (
        <div style={{ fontSize: 12, color: "#b6a8e6", marginTop: 6, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600 }}>ニュアンス: </span>
          {note}
        </div>
      )}
    </div>
  );
}

function SwapView({ result, onSave }: { result: SwapResult; onSave?: (en: string, ja: string) => void }) {
  const [selected, setSelected] = useState<{ group: number; alt: number } | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {result.swaps.map((swap, gi) => (
        <div key={gi}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#c3b0ff",
                background: "rgba(124,92,255,0.18)",
                border: "1px solid rgba(124,92,255,0.35)",
                borderRadius: 8,
                padding: "5px 12px",
              }}
            >
              {swap.original}
            </span>
            <span style={{ fontSize: 12, color: "#8a8a9e" }}>({swap.originalJa})</span>
            <span style={{ fontSize: 12, color: "#6f6f83" }}>→</span>
            {swap.alternatives.map((alt, ai) => {
              const active = selected?.group === gi && selected?.alt === ai;
              return (
                <button
                  key={ai}
                  className={active ? undefined : "alt-chip"}
                  onClick={() => setSelected(active ? null : { group: gi, alt: ai })}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: active ? "#fff" : "#c4c4d2",
                    background: active ? "linear-gradient(135deg,#8257ff,#6d3ce6)" : "#14131d",
                    border: active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 8,
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  {alt.word}
                </button>
              );
            })}
          </div>
          {selected?.group === gi && (
            <div style={{ marginTop: 10 }}>
              <ResultRow
                en={swap.alternatives[selected.alt].sentence}
                ja={swap.alternatives[selected.alt].ja}
                onSave={onSave}
              />
            </div>
          )}
        </div>
      ))}
      <div style={{ fontSize: 12, color: "#8a8a9e" }}>単語をクリックすると、入れ替えた英文が表示されます。</div>
    </div>
  );
}

function SaveIdiomButton({ idiom, onSave }: { idiom: IdiomItem; onSave: (idiom: IdiomItem) => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      className="save-link"
      disabled={saved}
      onClick={() => {
        onSave(idiom);
        setSaved(true);
      }}
      style={{
        border: "none",
        background: "none",
        color: saved ? "#8a8a9e" : "#a78bff",
        fontSize: 12,
        fontWeight: 600,
        cursor: saved ? "default" : "pointer",
        padding: 0,
        flexShrink: 0,
      }}
    >
      {saved ? "✓ 保存済み" : "+ イディオム集に保存"}
    </button>
  );
}

function IdiomView({ result, onSaveIdiom }: { result: IdiomsResult; onSaveIdiom?: (idiom: IdiomItem) => void }) {
  if (result.idioms.length === 0) {
    return (
      <div style={{ fontSize: 13, color: "#9a9ab0", lineHeight: 1.6 }}>
        この文からは、特に使い回せる構文は見つかりませんでした。
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {result.idioms.map((idiom, i) => (
        <div
          key={i}
          style={{
            background: "#14131d",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 11,
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: "#c3b0ff",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                lineHeight: 1.4,
              }}
            >
              {idiom.pattern}
            </div>
            {onSaveIdiom && <SaveIdiomButton idiom={idiom} onSave={onSaveIdiom} />}
          </div>
          <div style={{ fontSize: 13, color: "#c4c4d2", marginTop: 7, lineHeight: 1.5 }}>{idiom.meaning}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 9 }}>
            {idiom.examples.map((ex, j) => (
              <div key={j} style={{ borderLeft: "2px solid rgba(124,92,255,0.4)", paddingLeft: 10 }}>
                <div style={{ fontSize: 13, color: "#e9e9f0", lineHeight: 1.45 }}>{ex.en}</div>
                <div style={{ fontSize: 12, color: "#8a8a9e", marginTop: 2, lineHeight: 1.45 }}>{ex.ja}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AiResults({ mode, loading, error, result, onClose, onSave, onSaveIdiom }: Props) {
  return (
    <div
      style={{
        marginTop: 14,
        border: "1px solid rgba(124,92,255,0.28)",
        borderRadius: 13,
        background: "linear-gradient(180deg,rgba(124,92,255,0.08),rgba(124,92,255,0.02))",
        padding: "16px 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#c3b0ff" }}>
          {MODE_ICONS[mode]}
          {MODE_LABELS[mode]}
        </div>
        <button
          onClick={onClose}
          style={{ border: "none", background: "none", cursor: "pointer", padding: 2, display: "flex" }}
        >
          <CloseIcon />
        </button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", fontSize: 13, color: "#9a9ab0" }}>
          <div className="spinner" />
          Gemini が生成中...
        </div>
      )}

      {error && (
        <div
          style={{
            fontSize: 13,
            color: "#fca5a5",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10,
            padding: "10px 14px",
            lineHeight: 1.6,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && result && mode === "examples" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(result as ExamplesResult).examples.map((ex, i) => (
            <ResultRow key={i} en={ex.en} ja={ex.ja} onSave={onSave} />
          ))}
        </div>
      )}

      {!loading && !error && result && mode === "paraphrase" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(result as ParaphraseResult).paraphrases.map((p, i) => (
            <ResultRow key={i} en={p.en} ja={p.ja} note={p.nuance} onSave={onSave} />
          ))}
        </div>
      )}

      {!loading && !error && result && mode === "swap" && (
        <SwapView result={result as SwapResult} onSave={onSave} />
      )}

      {!loading && !error && result && mode === "idioms" && (
        <IdiomView result={result as IdiomsResult} onSaveIdiom={onSaveIdiom} />
      )}
    </div>
  );
}
