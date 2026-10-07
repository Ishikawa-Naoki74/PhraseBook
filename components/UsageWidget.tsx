"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { todayKey } from "@/lib/utils";
import { SparkleIcon } from "./icons";

type Status = { hasKey: boolean; model: string; dailyLimit: number };

export default function UsageWidget() {
  const date = useMemo(() => todayKey(), []);
  const usedToday = useQuery(api.usage.forDate, { date });
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/ai")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const limit = status?.dailyLimit ?? 0;
  const used = usedToday ?? 0;
  const remaining = Math.max(0, limit - used);
  const ratio = limit > 0 ? Math.min(1, used / limit) : 0;
  const low = limit > 0 && remaining <= Math.max(3, Math.ceil(limit * 0.1));

  const container: React.CSSProperties = {
    border: "1px solid rgba(124,92,255,0.28)",
    borderRadius: 18,
    padding: "16px 17px",
    background: "linear-gradient(180deg,rgba(124,92,255,0.10),rgba(124,92,255,0.03))",
    flexShrink: 0,
  };

  return (
    <div style={container}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <SparkleIcon size={16} />
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>Gemini API</span>
      </div>

      {status && !status.hasKey ? (
        <div style={{ fontSize: 12, color: "#9a9ab0", lineHeight: 1.6 }}>
          APIキーが未設定です。「設定」から追加してください。
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#8a8a9e" }}>本日の残り</span>
            <span style={{ fontSize: 12, color: "#8a8a9e" }}>
              {used} / {limit || "―"} 回
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: low ? "#fca5a5" : "#fff", lineHeight: 1 }}>
              {limit > 0 ? remaining : "―"}
            </span>
            <span style={{ fontSize: 12, color: "#8a8a9e" }}>回</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${ratio * 100}%`,
                background: low
                  ? "linear-gradient(90deg,#f87171,#ef4444)"
                  : "linear-gradient(90deg,#8257ff,#6d3ce6)",
                transition: "width 0.2s",
              }}
            />
          </div>
          <div style={{ fontSize: 10.5, color: "#6f6f83", marginTop: 9, lineHeight: 1.5 }}>
            当日のAI利用回数(このアプリでの集計)。上限は無料枠の目安です。
          </div>
        </>
      )}
    </div>
  );
}
