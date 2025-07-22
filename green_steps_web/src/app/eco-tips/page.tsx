"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EcoTipsPage() {
  const { data: session, status } = useSession();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tips?user=" + session!.user!.email)
        .then(res => res.json())
        .then(data => {
          setTips(data);
          setLoading(false);
        });
    }
  }, [status, session]);

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (!session) return <div>Please log in to view your eco tips.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 2px 12px #0002" }}>
      <h2 style={{ color: "#388e3c", marginBottom: 24 }}>My Eco Tips</h2>
      {tips.length === 0 ? (
        <div>No eco tips found. Start contributing!</div>
      ) : (
        <ul>
          {tips.map((tip, idx) => (
            <li key={idx} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
              <strong>{tip.title || "Untitled Tip"}</strong>
              <div>{tip.content || tip.description}</div>
              <div style={{ color: "#888", fontSize: 12 }}>Created: {new Date(tip.createdAt).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 