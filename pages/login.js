import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
        <h2>Přihlášen jako: {session.user.email}</h2>
        <p>Odkaz na kalendář: <a href="https://calendar.google.com" target="_blank">Google Calendar</a></p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h1>Přihlášení</h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          background: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: 20,
        }}
      >
        Přihlásit se s Google
      </button>
    </div>
  );
}