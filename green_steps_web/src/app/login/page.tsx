"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/users");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#f6faf7]">
      <h1 className="text-2xl font-bold mb-4">Login to GreenSteps</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-8 flex flex-col gap-4 min-w-[300px]"
      >
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
        <div className="text-sm text-center mt-2">
          Do not have an account?
          <Link href="/register" className="underline ml-2 text-blue-600">
            Register
          </Link>
        </div>
      </form>
    </main>
  );
}
