import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/users/profile", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Błąd autoryzacji");
      return res.json();
    })
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Błąd ładowania:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <main className="profilePage"><div className="profileContainer">pobieranie danych...</div></main>;
  if (!user) return (
    <main className="profilePage">
      <div className="loginPromptContainer">
        <p className="loginPromptText">zaloguj się, aby zobaczyć profil.</p>
        <button className="profileBtnPrimary" onClick={() => navigate("/login")}>
          ZALOGUJ SIĘ
        </button>
      </div>
    </main>
  );
  
  return (
    <main className="profilePage">
      <div className="profileContainer">
        <div className="profileHeader">
          <h2 className="profileTitleMain">dane użytkownika:</h2>
          <button className="profileEditBtnTop" onClick={() => navigate("/profile/update")}>EDYTUJ</button>
          <button className="profileLogoutBtnTop" onClick={handleLogout}>WYLOGUJ</button>        
        </div>

        <div className="profileContent">
          <div className="profileColumn">
            <div className="profileRow">
              <span className="profileLabel">imię:</span>
              <span className="profileValue">{user.name}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">nazwisko:</span>
              <span className="profileValue">{user.lastName}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">kraj:</span>
              <span className="profileValue">{user.address?.country || "---"}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">miasto:</span>
              <span className="profileValue">{user.address?.city || "---"}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">nr budynku:</span>
              <span className="profileValue">{user.address?.buildingNumber || "---"}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">telefon:</span>
              <span className="profileValue">{user.phoneNumber}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">username:</span>
              <span className="profileValue">{user.username}</span>
            </div>
          </div>

          <div className="profileColumn">
            <div className="profileRow">
              <span className="profileLabel">drugie imię:</span>
              <span className="profileValue">{user.secondName || "---"}</span>
            </div>
            <div className="profileRow" style={{ visibility: 'hidden' }}>
              <span className="profileLabel">spacer:</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">kod pocztowy:</span>
              <span className="profileValue">{user.address?.postalCode || "---"}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">ulica:</span>
              <span className="profileValue">{user.address?.street || "---"}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">nr lokalu:</span>
              <span className="profileValue">{user.address?.apartmentNumber || "---"}</span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">e-mail:</span>
              <span className="profileValue">{user.emailAddress || user.email}</span>
            </div>
          </div>
        </div>
        
        <button className="regSubmit" onClick={() => navigate("/profile/orders")}>zamówienia</button>
      </div>
    </main>
  );
}