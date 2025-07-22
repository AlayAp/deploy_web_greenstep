"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ecoCategories = ["Home", "Travel", "Diet", "Waste"];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for user profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [ecoInterests, setEcoInterests] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState("");
  const [ecoTips, setEcoTips] = useState(0);
  const [challenges, setChallenges] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setEmail(data.email || "");
          setNotifications(data.notifications ?? true);
          setEcoInterests(data.ecoInterests || []);
          setCreatedAt(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "");
          setEcoTips(data.ecoTips ?? 0);
          setChallenges(data.challenges ?? 0);
          setLoading(false);
        });
    }
  }, [status, router]);

  // Toggle eco interest category
  const handleCategoryToggle = (cat: string) => {
    setEcoInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Save profile changes
  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        notifications,
        ecoInterests,
      }),
    });
    setLoading(false);
    alert("Profile updated!");
  };

  // Delete account
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    await fetch("/api/user", { method: "DELETE" });
    signOut({ callbackUrl: "/auth/login" });
  };

  if (loading) return <div>Loading...</div>;
  if (!session) return null;

  return (
    <>
      <h2 style={{
        marginBottom: 24,
        textAlign: "center",
        color: "#388e3c",
        fontSize: "2.2rem",
        fontWeight: 700,
        letterSpacing: "-1px"
      }}>
        Account Settings
      </h2>

      {/* Profile Section */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=4caf50&color=fff&size=64`}
            alt="Profile"
            style={{ borderRadius: "50%", width: 64, height: 64, border: "2px solid #4caf50" }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 20, wordBreak: "break-word" }}>{name || "No Name"}</div>
            <div style={{ color: "#888", fontSize: 15, wordBreak: "break-all" }}>{email}</div>
            <div style={{ color: "#aaa", fontSize: 12 }}>Joined: {createdAt}</div>
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#388e3c", fontSize: "1.1rem" }}>Notifications</h3>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1rem" }}>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications((n) => !n)}
            style={{ width: 18, height: 18 }}
          />
          Receive email notifications about new eco tips and challenges
        </label>
      </section>

      {/* Eco Interests */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#388e3c", fontSize: "1.1rem" }}>Eco Interests</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ecoCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryToggle(cat)}
              style={{
                background: ecoInterests.includes(cat) ? "#4caf50" : "#eee",
                color: ecoInterests.includes(cat) ? "#fff" : "#333",
                border: "none",
                borderRadius: 6,
                padding: "8px 14px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                marginBottom: 4
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#388e3c", fontSize: "1.1rem" }}>Your Stats</h3>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ minWidth: 80 }}>
            <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>{ecoTips}</div>
            <div style={{ color: "#888", fontSize: 13 }}>Eco Tips</div>
          </div>
          <div style={{ minWidth: 80 }}>
            <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>{challenges}</div>
            <div style={{ color: "#888", fontSize: 13 }}>Challenges</div>
          </div>
        </div>
      </section>

      {/* Account Actions */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12, color: "#388e3c", fontSize: "1.2rem" }}>Account Actions</h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center"
        }}>
          <button
            onClick={handleSave}
            style={{
              background: "#4caf50",
              color: "#fff",
              padding: "12px 24px",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: "1rem",
              minWidth: 120,
              flex: 1,
              maxWidth: 200,
              margin: "0 4px"
            }}
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: "#f44336",
              color: "#fff",
              padding: "10px 18px",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              flex: 1,
              minWidth: 120
            }}
          >
            Delete Account
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            style={{
              background: "#888",
              color: "#fff",
              padding: "10px 18px",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              flex: 1,
              minWidth: 120
            }}
          >
            Log Out
          </button>
        </div>
      </section>
    </>
  );
}