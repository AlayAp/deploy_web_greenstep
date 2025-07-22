"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res && !res.error) router.push("/settings");
    else alert("Invalid credentials");
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
        <h2 style={{ textAlign: "center" }}>Login</h2>
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
            background: "#4caf50",
            color: "#fff",
            padding: "10px 0",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>
        <p style={{ textAlign: "center", fontSize: 14 }}>
          Don't have an account? <a href="/auth/register" style={{ color: "#388e3c" }}>Register</a>
        </p>
      </form>
    </div>
  );
} 