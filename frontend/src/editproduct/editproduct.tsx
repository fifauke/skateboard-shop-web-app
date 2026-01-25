import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editproduct.css"; 

export default function EditProduct() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    size: "",
    material: "",
    tracks: "",
    concave: "",
    wheels: "",
    bearings: "",
    instock: "",
    manufacturersId: 1,
    storeId: 1
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/admin/products/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        size: data.size || "",
        material: data.material || "",
        tracks: data.tracks || "",
        concave: data.concave || "",
        wheels: data.wheels || "",
        bearings: data.bearings || "",
        instock: data.instock || "",
        manufacturersId: data.manufacturersId || data.manufacturer?.id || 1,
        storeId: data.storeId || data.store?.id || 1
      });
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue: any = value;
    
    if (name === "price") {
      finalValue = value === "" ? "" : parseFloat(value);
    } else if (["instock", "manufacturersId", "storeId"].includes(name)) {
      finalValue = value === "" ? "" : parseInt(value, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (validationError) setValidationError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    const updateData: any = {};

    if (formData.name) updateData.name = formData.name;
    if (formData.description) updateData.description = formData.description;
    if (formData.price !== "") updateData.price = formData.price;
    if (formData.size) updateData.size = formData.size;
    if (formData.material) updateData.material = formData.material;
    if (formData.tracks) updateData.tracks = formData.tracks;
    if (formData.concave) updateData.concave = formData.concave;
    if (formData.wheels) updateData.wheels = formData.wheels;
    if (formData.bearings) updateData.bearings = formData.bearings;
    if (formData.instock !== "") updateData.instock = formData.instock;
    if (formData.manufacturersId) updateData.manufacturersId = formData.manufacturersId;
    if (formData.storeId) updateData.storeId = formData.storeId;

    if (Object.keys(updateData).length === 0) {
        setValidationError("brak danych do aktualizacji.");
        setSaving(false);
        return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        if (selectedFile) {
            const uploadData = new FormData();
            uploadData.append("file", selectedFile);
            await fetch(`http://localhost:8080/api/products/${id}/photo`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });
        }
        navigate("/admin/products");
      } else {
        setValidationError("błąd serwera. sprawdź poprawność danych.");
      }
    } catch (err) {
      console.error("Błąd połączenia:", err);
      setValidationError("brak połączenia z serwerem.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="adminStatusMsg">ładowanie danych...</p>;

  return (
    <main className="editProductPage">
      <div className="editProductContainer">
        <h1 className="formMainTitle">edytuj produkt #{id}:</h1>
        
        <form className="sk8Form" onSubmit={handleSubmit} noValidate>
          
          {validationError && (
            <p className="adminStatusMsg" style={{ color: 'red', padding: '10px 0' }}>
              {validationError}
            </p>
          )}

          <div className="formGrid">
            <div className="formColumn">
              <div className="inputRow">
                <label>nazwa:</label>
                <input name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>cena (pln):</label>
                <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>szerokość blatu:</label>
                <input name="size" value={formData.size} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>materiał blatu:</label>
                <input name="material" value={formData.material} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>liczba:</label>
                <input name="instock" type="number" min="0" value={formData.instock} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>zmień zdjęcie:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ paddingTop: '3px' }} />
              </div>
            </div>

            <div className="formColumn">
              <div className="inputRow">
                <label>concave:</label>
                <input name="concave" value={formData.concave} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>koła:</label>
                <input name="wheels" value={formData.wheels} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>traki:</label>
                <input name="tracks" value={formData.tracks} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>łożyska:</label>
                <input name="bearings" value={formData.bearings} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="descriptionSection">
            <label>opis produktu:</label>
            <textarea name="description" className="formDescription" value={formData.description} onChange={handleChange} />
          </div>

          <div className="formFooterActions">
            <button className="submitBtn" type="submit" disabled={saving}>
              {saving ? "ZAPISYWANIE..." : "ZAKTUALIZUJ"}
            </button>
            <button className="cancelBtn" type="button" onClick={() => navigate("/admin/products")}>
              ANULUJ
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}