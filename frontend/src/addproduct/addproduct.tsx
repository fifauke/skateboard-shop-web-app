import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addproduct.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    storeId: 1,
    photoPaths: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ["price", "instock", "manufacturersId", "storeId"];
    
    if (numericFields.includes(name) && parseFloat(value) < 0) return;

    const finalValue = numericFields.includes(name) 
      ? (value === "" ? "" : parseFloat(value)) 
      : value;

    setFormData({ ...formData, [name]: finalValue });
    if (validationError) setValidationError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ["name", "description", "price", "size", "material", "tracks", "concave", "wheels", "bearings", "instock"];
    const isAnyEmpty = requiredFields.some(field => formData[field as keyof typeof formData] === "");

    if (isAnyEmpty) {
      setValidationError("proszę popraw dane i wypełnij wszystkie pola produktu.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/api/admin/products", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const createdProduct = await res.json(); 
        const newProductId = createdProduct.id;

        if (selectedFile && newProductId) {
            const uploadData = new FormData();
            uploadData.append("file", selectedFile);

            const photoRes = await fetch(`http://localhost:8080/api/products/${newProductId}/photo`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });

            if (!photoRes.ok) {
                alert("Produkt dodano, ale wystąpił błąd przy wysyłaniu zdjęcia.");
            }
        }
        navigate("/admin/products");
      } else {
        setValidationError("nie udało się dodać produktu. sprawdź poprawność danych.");
      }
    } catch (err) {
      console.error("Błąd sieci:", err);
      setValidationError("błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="addProductPage">
      <div className="addProductContainer">
        <h1 className="formMainTitle">dodaj produkt:</h1>
        
        <form className="sk8Form" onSubmit={handleSubmit} noValidate>
        
          {validationError && (
            <p className="adminStatusMsg" style={{ color: 'red', paddingBottom: '20px', fontWeight: 'bold' }}>
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
                <label>cena (PLN):</label>
                <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
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
                <input name="instock" type="number" value={formData.instock} onChange={handleChange} />
              </div>
              <div className="inputRow">
                <label>zdjęcie:</label>
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
            <textarea 
              name="description" 
              className="formDescription"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="formFooterActions">
            <button className="submitBtn" type="submit" disabled={loading}>
              {loading ? "ZAPISYWANIE..." : "ZAPISZ"}
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