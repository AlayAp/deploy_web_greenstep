"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    setLoading(false);
    if (res.ok) router.push("/auth/login");
    else alert("Registration failed");
  };

  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <input
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          style={{
            background: "#388e3c",
            color: "#fff",
            padding: "10px 0",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer"
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p style={{ textAlign: "center", fontSize: 14 }}>
          Already have an account? <a href="/auth/login" style={{ color: "#4caf50" }}>Login</a>
        </p>
      </form>
    </div>
  );
} 