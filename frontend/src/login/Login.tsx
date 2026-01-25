import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  if (token) {
      return <Navigate to="/profile" replace />;
  }
   
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Błędny login lub hasło");
      }

      const token = (await res.text()).trim();
      console.log("Zalogowano:", token);
      localStorage.setItem("token", token);
      window.location.href = "/";
      

    } catch (err) {
      setError((err as Error).message);
    } finally {
    }
  };
 
  return (
    <main className="loginPage">
      <div className="loginCard">
        <img className="loginLogo" src="/logo.png" alt="essa sk8" />
        <h1 className="loginTitle">logowanie</h1>

        <form className="loginForm" onSubmit={submit}>
          <input
            className="loginInput"
            type="text"
            placeholder="login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="loginInput"
            type="password"
            placeholder="hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="loginError">{error}</p>}

          <button className="loginBtnPrimary" type="submit">
            ZALOGUJ SIĘ
          </button>

          <div className="loginOr">lub</div>

          <button className="loginBtnSecondary" type="button" onClick={() => navigate("/register")}>
            ZAŁÓŻ NOWE KONTO
          </button>

        </form>
      </div>
    </main>
  );
}
