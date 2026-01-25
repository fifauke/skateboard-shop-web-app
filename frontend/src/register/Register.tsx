import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./Register.css";

type RegisterPayload = {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  name: string;
  lastName: string;
  secondName: string;
  country: string;
  city: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  postalCode: string;
};

type FieldErrors = Partial<Record<keyof RegisterPayload, boolean>>;

const allowedKeys: (keyof RegisterPayload)[] = [
  "username",
  "password",
  "email",
  "phoneNumber",
  "name",
  "lastName",
  "secondName",
  "country",
  "city",
  "street",
  "buildingNumber",
  "apartmentNumber",
  "postalCode",
];

export default function Register() {
  const [form, setForm] = useState<RegisterPayload>({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    name: "",
    lastName: "",
    secondName: "",
    country: "",
    city: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    postalCode: "",
  });

  const token = localStorage.getItem("token");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});


  const navigate = useNavigate();

  if (token) {
      return <Navigate to="/profile" replace />;
  }

  const setField = (key: keyof RegisterPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const inputClass = (key: keyof RegisterPayload) =>
    `regInput${fieldErrors[key] ? " regInput--error" : ""}`;

  const applyBackendFieldErrors = (obj: unknown) => {
    const next: FieldErrors = {};


    if (!obj || typeof obj !== "object") {
      setFieldErrors({});
      return null;
    }

    const rec = obj as Record<string, unknown>;

    for (const k of allowedKeys) {
      if (k in rec) next[k] = true;
    }

    setFieldErrors(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setFieldErrors({});

    if (form.password !== passwordRepeat) {
      setError("Hasła nie są takie same.");
      setFieldErrors({ password: true });
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain",
        },
        body: JSON.stringify(form),
      });

      const raw = await res.text();

      if (!res.ok) {
        try {
          const parsed = JSON.parse(raw);
          applyBackendFieldErrors(parsed);

          const msg =
            (typeof parsed.message === "string" && parsed.message) ||
            (typeof parsed.error === "string" && parsed.error) ||
            "Wpisz poprawne dane";


          setError(msg);
        } catch {
          setError(raw || "Błąd rejestracji");
        }
        return;
      }

      const resLogin = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password
        }),
      });

      if (!resLogin.ok) {
        throw new Error("Nieudane logowanie");
      }

      const token = (await resLogin.text()).trim();
      localStorage.setItem("token", token);

      setOk("Konto utworzone!");
      console.log("Zalogowano:", token);

      navigate('/');

    } catch (err) {
      setError((err as Error).message);
    } 
  };

  return (
    <main className="registerPage">
      <div className="registerCard">
        <img className="registerLogo" src="/logo.png" alt="essa sk8" />
        <h1 className="registerTitle">rejestracja</h1>

        <form className="registerForm" onSubmit={submit}>
          <div className="registerGrid">
            <input className={inputClass("name")} placeholder="Imię (obowiązkowe)" value={form.name} onChange={setField("name")} />
            <input className={inputClass("secondName")} placeholder="Drugie imię" value={form.secondName} onChange={setField("secondName")} />
            <input className={inputClass("lastName")} placeholder="Nazwisko (obowiązkowe)" value={form.lastName} onChange={setField("lastName")} />
            <div className="regSpacer" />
            <input className={inputClass("country")} placeholder="Kraj (obowiązkowe)" value={form.country} onChange={setField("country")} />
            <input className={inputClass("postalCode")} placeholder="Kod pocztowy (xx-xxx) (obowiązkowe)" value={form.postalCode} onChange={setField("postalCode")} />            
            <input className={inputClass("city")} placeholder="Miasto (obowiązkowe)" value={form.city} onChange={setField("city")} />
            <input className={inputClass("street")} placeholder="Ulica (obowiązkowe)" value={form.street} onChange={setField("street")} />
            <input className={inputClass("buildingNumber")} placeholder="Nr budynku (obowiązkowe)" value={form.buildingNumber} onChange={setField("buildingNumber")} />
            <input className={inputClass("apartmentNumber")} placeholder="Nr lokalu" value={form.apartmentNumber} onChange={setField("apartmentNumber")} />
      
            <input className={inputClass("phoneNumber")} type="tel" placeholder="Telefon (obowiązkowe)" value={form.phoneNumber} onChange={setField("phoneNumber")} />
            <input className={inputClass("email")} type="email" placeholder="E-mail (obowiązkowe)" value={form.email} onChange={setField("email")} />
            <input className={inputClass("username")} placeholder="Username (obowiązkowe)" value={form.username} onChange={setField("username")} />
            <input className={inputClass("password")} type="password" placeholder="Hasło (obowiązkowe)" value={form.password} onChange={setField("password")} />
            <input
              className={`regInput${fieldErrors.password ? " regInput--error" : ""}`}
              type="password"
              placeholder="Powtórz hasło (obowiązkowe)"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
            <small className="regHint"> *Hasło musi zawierać co najmniej 6 znaków</small>
          </div>

          {error && <p className="regMsg regError">{error}</p>}
          {ok && <p className="regMsg regOk">{ok}</p>}

          <button className="regSubmit" type="submit">
            POTWIERDŹ
          </button>
        </form>
      </div>
    </main>
  );
}
