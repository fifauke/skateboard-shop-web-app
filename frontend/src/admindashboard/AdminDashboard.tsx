import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

interface Product {
  id: number;
  name: string;
  price: number;
  brandName: string; 
  photoPath: string | null;
}

interface Order {
  id: number;
  orderNumber: string; 
  price: number;       
  date: string;
  customerEmail: string;
}

interface DashboardState {
  recentProducts: Product[]; 
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardState>({ recentProducts: [], recentOrders: [] });
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setData((prev: DashboardState) => ({
          ...prev,
          recentProducts: prev.recentProducts.filter((p: Product) => p.id !== id)
        }));
      }
    } catch (err) {
      console.error("Błąd sieci:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/admin/dashboard", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 403) throw new Error("Brak uprawnień pracownika");
      if (!res.ok) throw new Error("Błąd pobierania danych");
      return res.json();
    })
    .then((result: any) => {
      setData({
        recentProducts: result.recentProducts || [],
        recentOrders: result.recentOrders || []
      });
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return (
    <main className="adminPage">
      <div className="adminContainer">
        <p className="adminStatusMsg">ładowanie danych z bazy...</p>
      </div>
    </main>
  );

  return (
    <main className="adminPage">
      <div className="adminContainer">
        
        <div className="adminSection">
          <div className="adminHeader">
            <h2 className="adminTitle">ostatnio dodane produkty:</h2>
          </div>
          <div className="adminContent">
            {data.recentProducts.length > 0 ? (
              data.recentProducts.slice(0, 2).map((product) => (
                <div key={product.id} className="adminDashboardRow">
                  <div className="adminInfo">
                    <span className="adminLabel">{product.name}</span>
                    <span className="adminSubValue">{product.price} PLN</span>
                  </div>
                  <div className="adminActions">
                    <button className="adminBtnSmall" onClick={() => navigate(`/admin/edit/${product.id}`)}>EDYTUJ</button>
                    <button className="adminBtnSmall" onClick={() => handleDelete(product.id)}>USUŃ</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="adminEmptyMsg">w bazie nie ma jeszcze żadnych produktów.</p>
            )}
          </div>
          <div className="adminFooterLink">
            <button className="adminTextBtn" onClick={() => navigate("/admin/products")}>pokaż wszystkie produkty</button>
          </div>
        </div>

        <div className="adminSection">
          <div className="adminHeader">
            <h2 className="adminTitle">ostatnie zamówienia:</h2>
          </div>
          <div className="adminContent">
            {data.recentOrders.length > 0 ? (
              data.recentOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="adminDashboardRow">
                  <div className="adminInfo">
                    <span className="adminLabel">zamówienie #{order.id}</span>
                    <span className="adminSubValue">{order.price} PLN</span>
                  </div>
              
                </div>
              ))
            ) : (
              <p className="adminEmptyMsg">w bazie nie ma jeszcze żadnych zamówień.</p>
            )}
          </div>
          <div className="adminFooterLink">
            <button className="adminTextBtn" onClick={() => navigate("/admin/orders")}>pokaż wszystkie zamówienia</button>
          </div>
        </div>
        
        <button className="regSubmit" onClick={() => navigate("/adminregistration")}>dodaj pracownika</button>

      </div>
    </main>
  );
}