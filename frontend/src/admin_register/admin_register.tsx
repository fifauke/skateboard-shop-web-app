import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../register/Register.css";

type RegisterPayload = {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  name: string;
  lastName: string;
  secondName: string;
  gender: string;
  birthDate: string;
  pesel: string;
  hireDate: string;
  bankAccountNumber: string;
  country: string;
  city: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  postalCode: string;
  storeId: number; 
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
  "gender",
  "birthDate",
  "pesel",
  "hireDate",
  "bankAccountNumber",
  "country",
  "city",
  "street",
  "buildingNumber",
  "apartmentNumber",
  "postalCode",
];

export default function AdminRegister() {
  const [form, setForm] = useState<Omit<RegisterPayload, "storeId">>({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    name: "",
    lastName: "",
    secondName: "",
    gender: "",
    birthDate: "",
    pesel: "",
    hireDate: "",
    bankAccountNumber: "",
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

  const [isStaff, setIsStaff] = useState(false);
  const [checkingStaff, setCheckingStaff] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsStaff(false);
      setCheckingStaff(false);
      return;
    }
    
    fetch("http://localhost:8080/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Błąd autoryzacji profilu");
        return res.json();
      })
      .then((data) => {
        console.log("Dane otrzymane z profilu:", data);

        if (data.staff === true) {
          setIsStaff(true);
        } else {
          setIsStaff(false);
        }

        setCheckingStaff(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania uprawnień:", err);
        setIsStaff(false);
        setCheckingStaff(false); 
      });
  }, []);

  if (checkingStaff) return null;

  if (!isStaff) return <Navigate to="/" replace />;

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const payload = JSON.stringify({...form, storeId:1})
    console.log("SENDING PAYLOAD:", payload);

    try {
      const res = await fetch("http://localhost:8080/api/admin/register-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({...form, storeId:1}),
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

          console.log("STATUS", res.status);
          console.log("CONTENT-TYPE", res.headers.get("content-type"));
          console.log("RAW", raw);


          setError(msg);
        } catch {
          setError("Wpisz poprawne dane");
        }
        return;
      }

      setOk("Konto utworzone!");
      navigate("/admindashboard");
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

            <select className={inputClass("gender")} value={form.gender} onChange={setField("gender")}>
              <option value="">Płeć (obowiązkowe)</option>
              <option value="m">mężczyzna</option>
              <option value="k">kobieta</option>
            </select>

            <div className="regDateRow">
              <span className="regDateLabel">Data urodzenia (obowiązkowe)</span>

              <input
                type="date"
                className={`regInput regInputDate${fieldErrors.birthDate ? " regInput--error" : ""}`}
                max={new Date().toISOString().split("T")[0]}
                value={form.birthDate}
                onChange={setField("birthDate")}
              />
            </div>

            <input className={inputClass("pesel")} placeholder="PESEL" value={form.pesel} onChange={setField("pesel")} />

            <input className={inputClass("country")} placeholder="Kraj (obowiązkowe)" value={form.country} onChange={setField("country")} />
            <input className={inputClass("postalCode")} placeholder="Kod pocztowy (xx-xxx) (obowiązkowe)" value={form.postalCode} onChange={setField("postalCode")} />
            <input className={inputClass("city")} placeholder="Miasto (obowiązkowe)" value={form.city} onChange={setField("city")} />
            <input className={inputClass("street")} placeholder="Ulica (obowiązkowe)" value={form.street} onChange={setField("street")} />
            <input className={inputClass("buildingNumber")} placeholder="Nr budynku (obowiązkowe)" value={form.buildingNumber} onChange={setField("buildingNumber")} />
            <input className={inputClass("apartmentNumber")} placeholder="Nr lokalu" value={form.apartmentNumber} onChange={setField("apartmentNumber")} />

            <input className={inputClass("phoneNumber")} type="tel" placeholder="Telefon (obowiązkowe)" value={form.phoneNumber} onChange={setField("phoneNumber")} />
            <input className={inputClass("email")} type="email" placeholder="E-mail (obowiązkowe)" value={form.email} onChange={setField("email")} />
            <input className={inputClass("username")} placeholder="Username (obowiązkowe)" value={form.username} onChange={setField("username")} />
            <input className={inputClass("password")} type="password (obowiązkowe)" placeholder="Hasło (obowiązkowe)" value={form.password} onChange={setField("password")} />

            <input
              className={`regInput${fieldErrors.password ? " regInput--error" : ""}`}
              type="password"
              placeholder="Powtórz hasło (obowiązkowe)"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
            <small className="regHint"> *Hasło musi zawierać co najmniej 6 znaków</small>

            <div className="regDateRow">
              <span className="regDateLabel">Data zatrudnienia (obowiązkowe)</span>

              <input
                type="date"
                className={`regInput regInputDate${fieldErrors.hireDate ? " regInput--error" : ""}`}
                value={form.hireDate}
                onChange={setField("hireDate")}
              />
            </div>

            <input
              className={inputClass("bankAccountNumber")}
              placeholder="Numer konta (IBAN)"
              value={form.bankAccountNumber}
              onChange={setField("bankAccountNumber")}
            />
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
