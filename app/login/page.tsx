"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "ログインに失敗しました。");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#0c0b13 0%,#08080d 100%)",
        padding: 24,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: 380,
          maxWidth: "100%",
          background: "#100f18",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: 32,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 24 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              background: "linear-gradient(150deg,#8b5cf6,#6d3ce6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(124,60,230,0.45)",
            }}
          >
            <LogoIcon />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>PhraseBook</div>
            <div style={{ fontSize: 11.5, color: "#8a8a9e", marginTop: 2 }}>YouTubeで学ぶ、伝わる英語</div>
          </div>
        </div>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#c4c4d2", display: "block", marginBottom: 6 }}>
          パスワード
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            height: 48,
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 12,
            padding: "0 14px",
            fontSize: 15,
            color: "#e9e9f0",
            background: "#14131d",
          }}
        />

        {error && <div style={{ marginTop: 12, fontSize: 13, color: "#fca5a5" }}>{error}</div>}

        <button
          type="submit"
          className="btn-primary"
          disabled={busy || !password}
          style={{
            width: "100%",
            height: 48,
            marginTop: 20,
            background: "linear-gradient(135deg,#8257ff,#6d3ce6)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 14.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(124,60,230,0.4)",
            opacity: busy || !password ? 0.6 : 1,
          }}
        >
          {busy ? "確認中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
