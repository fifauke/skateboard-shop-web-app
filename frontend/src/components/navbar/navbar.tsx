import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./navbar.css";
import { FiSearch } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

type NavbarProps = {
  onSearch: (phrase: string) => void;
};

export default function Navbar({ onSearch }: NavbarProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchParams] = useSearchParams();

  const phraseFromUrl = searchParams.get("search") ?? "";

  useEffect(() => {
    setInputValue(phraseFromUrl);
  }, [phraseFromUrl]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  return (
    <header className="nav">
      <div className="nav__left">
        <Link to="/" className="nav__logoLink">
          <img className="nav__logo" src="/logo.png" alt="logo" />
        </Link>
      </div>

      <div className="nav__center">
        <form className="search" onSubmit={submit}>
          <FiSearch className="search__icon" />
          <input
            className="search__input"
            placeholder="Znajdź produkt"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="search__btn" type="submit">
            Szukaj
          </button>
        </form>
      </div>

      <div className="nav__right">
        <Link to="/login" className="iconBtn" aria-label="Zaloguj">
          <CiUser />
        </Link>

        <Link to="/cart" className="iconBtn">
          <PiShoppingCartSimpleLight />
        </Link>
      </div>
    </header>
  );
}
