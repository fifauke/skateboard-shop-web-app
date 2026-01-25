import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./editprofile.css"; 

export default function EditProfile() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    emailAddress: "",
    name: "",
    lastName: "",
    secondName: "",
    phoneNumber: "",
    password: "", 
    address: {
      country: "Polska",
      city: "",
      street: "",
      buildingNumber: "",
      apartmentNumber: "",
      postalCode: ""
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    const updateData: any = {};

    if (formData.username) updateData.username = formData.username;
    if (formData.emailAddress) updateData.emailAddress = formData.emailAddress;
    if (formData.name) updateData.name = formData.name;
    if (formData.lastName) updateData.lastName = formData.lastName;
    if (formData.secondName) updateData.secondName = formData.secondName;
    if (formData.phoneNumber) updateData.phoneNumber = formData.phoneNumber;
    if (formData.password) updateData.password = formData.password;

    const addressFields = Object.entries(formData.address).filter(([key, val]) => val !== "" && key !== "country");
    if (addressFields.length > 0) {
      updateData.address = { country: formData.address.country };
      addressFields.forEach(([key, val]) => {
        updateData.address[key] = val;
      });
    }

    if (Object.keys(updateData).length === 0) {
      setValidationError("wpisz przynajmniej jedną zmianę.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/profile/update", {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        navigate("/profile"); 
      } else {
        setValidationError("błąd serwera. upewnij się, że dane są poprawne.");
      }
    } catch (err) {
      setValidationError("brak połączenia z serwerem.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="editProductPage">
      <div className="editProductContainer">
        <h1 className="formMainTitle">edytuj profil:</h1>
        <form className="sk8Form" onSubmit={handleSubmit} noValidate>
          {validationError && <p className="adminStatusMsg" style={{color: 'red'}}>{validationError}</p>}
          <div className="formGrid">
            <div className="formColumn">
              <div className="inputRow">
                <label>imię:</label>
                <input name="name" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>nazwisko:</label>
                <input name="lastName" onChange={handleChange}  />
              </div>
              <div className="inputRow">
                <label>kraj:</label>
                <input name="address.country" onChange={handleChange}  />
              </div>
              <div className="inputRow">
                <label>miasto:</label>
                <input name="address.city" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>nr budynku:</label>
                <input name="address.buildingNumber" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>telefon:</label>
                <input name="phoneNumber" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>username:</label>
                <input name="username" onChange={handleChange} />
              </div>
            </div>
            <div className="formColumn">
              <div className="inputRow">
                <label>drugie imię:</label>
                <input name="secondName" onChange={handleChange} />
              </div>
              <div className="inputRow" style={{visibility: 'hidden'}}><label>-</label><input disabled /></div>
              
              <div className="inputRow">
                <label>kod pocztowy:</label>
                <input name="address.postalCode" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>ulica:</label>
                <input name="address.street" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>nr lokalu:</label>
                <input name="address.apartmentNumber" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>e-mail:</label>
                <input name="emailAddress" type="email" onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>nowe hasło:</label>
                <input name="password" type="password" onChange={handleChange} />
              </div>
            </div>

          </div>
          <div className="formFooterActions">
            <button className="submitBtn" type="submit" disabled={saving}>
              {saving ? "ZAPISYWANIE..." : "ZAKTUALIZUJ"}
            </button>
            <button className="submitBtn" type="button" onClick={() => navigate("/profile")}>
              ANULUJ
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}