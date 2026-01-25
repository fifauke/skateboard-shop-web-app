import React, { useEffect, useState } from "react";
import "./footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Footer: Brak tokena, ukrywam panel.");
      setIsStaff(false);
      return;
    }

    fetch("http://localhost:8080/api/users/profile", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Błąd autoryzacji profilu");
      return res.json();
    })
    .then(data => {
      console.log("Dane otrzymane z profilu:", data);
    
      if (data.staff === true) {
        setIsStaff(true);
      } else {
        setIsStaff(false);
      }
    })
        .catch(err => {
          console.error("Footer: Błąd pobierania uprawnień:", err);
          setIsStaff(false);
        });
      }, []);
  
  return (
    <footer className="footer">
      <div className="footer__links-section">
        <div className="footer__column1">
          <span className="footer__title">Kontakt:</span>
          <p className="footer__text">tel: 123 456 789</p>
          <p className="footer__text">e-mail: essa-sk8@gmail.com</p>
          <p className="footer__text">00-665 Warszawa</p>
          <p className="footer__text">ul. Nowowiejska 15/19</p>
        </div>
        <div className="footer__column2">
          <span className="footer__title">Konto:</span>
          <ul className="footer__list">
            <li><Link to="/profile" className="footer__link">moje konto</Link></li>
            <li><Link to="/cart" className="footer__link">koszyk</Link></li>
            <li><Link to="/login" className="footer__link">zaloguj się</Link></li>
            {isStaff && (
              <li>
                <Link to="/admindashboard" className="footer__link">panel pracownika</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="footer__right">
        <img className="footer__logo" src="/logo.png" alt="essa sk8 logo" />
      </div>
    </footer>
  );
}