import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin_orders.css"; 

interface OrderItem {
  productName: string;
  quantity: number;
  fixedPrice: number;
  lineTotal: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number | null;
  items: OrderItem[];
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/admin/orders", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Błąd pobierania zamówień");
      return res.json();
    })
    .then(data => {
      setOrders(data);
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
        <p className="adminStatusMsg">pobieranie pełnej listy zamówień...</p>
      </div>
    </main>
  );

  return (
    <main className="adminPage">
      <div className="adminContainer">
        <div className="adminSection">
          <div className="adminHeader">
            <h2 className="adminTitle">wszystkie zamówienia w bazie:</h2>
          </div>

          <div className="adminContent">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.orderId} className="adminDashboardRow">
                  <div className="adminInfo">
                    <span className="adminLabel">zamówienie #{order.orderId}</span>
                    
                    <span className="adminSubValue">
                        {order.totalAmount 
                          ? order.totalAmount.toFixed(2) 
                          : order.items.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2)
                        } PLN
                    </span>
                    
                    <span className="adminSubValue" style={{
                        opacity: 0.6, 
                        textTransform: 'uppercase', 
                        color: order.status === 'NEW' ? 'blue' : 'green'
                    }}>
                        status: {order.status}
                    </span>

                    <span className="adminSubValue" style={{fontSize: '0.75em', marginTop: '4px'}}>
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "data nieznana"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="adminEmptyMsg">brak zamówień do wyświetlenia.</p>
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