import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminproductlist.css";

interface Product {
  id: number;
  name: string;
  price: number;
  brandName: string;
}

export default function AdminProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        console.error("Błąd serwera przy usuwaniu");
      }
    } catch (err) {
      console.error("Błąd sieci:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/admin/products", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Błąd pobierania produktów");
      return res.json();
    })
    .then(data => {
      setProducts(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <main className="adminPage">
      <div className="adminContainer">
        <p className="adminStatusMsg">pobieranie pełnej listy produktów...</p>
      </div>
    </main>
  );

  return (
    <main className="adminPage">
      <div className="adminContainer">
        <div className="adminSection">
          <div className="adminHeader">
            <h2 className="adminTitle">wszystkie produkty w bazie:</h2>
            <button 
              className="adminBtnSmall" 
              onClick={() => navigate("/admin/add-product")}
            >
              + DODAJ NOWY PRODUKT
            </button>
          </div>

          <div className="adminContent">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="adminDashboardRow">
                  <div className="adminInfo">
                    <span className="adminLabel">{product.name}</span>
                    <span className="adminSubValue">{product.price} PLN</span>
                    <span className="adminSubValue" style={{opacity: 0.6}}>{product.brandName}</span>
                  </div>
                  <div className="adminActions">
                    <button className="adminBtnSmall" onClick={() => navigate(`/admin/edit/${product.id}`)}>EDYTUJ</button>
                    <button 
                      className="adminBtnSmall" 
                      onClick={() => handleDelete(product.id)}
                    >
                      USUŃ
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="adminEmptyMsg">brak produktów do wyświetlenia.</p>
            )}
          </div>

          <div className="adminFooterLink">
            <button className="adminTextBtn" onClick={() => navigate("/admindashboard")}>powrót do panelu</button>
          </div>
        </div>
      </div>
    </main>
  );
}