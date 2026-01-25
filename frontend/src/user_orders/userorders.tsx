import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userorders.css";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Błąd pobierania zamówień");
        return res.json();
      })
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <main className="ordersPage">
        <div className="ordersContainer">
          <div className="ordersHeader">
            <h2 className="ordersTitleMain">zamówienia:</h2>
          </div>

          <div className="ordersEmpty">
            <p>zaloguj się, aby zobaczyć zamówienia.</p>
            <button className="ordersBtn" onClick={() => navigate("/login")}>
              ZALOGUJ SIĘ
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="ordersPage">
        <div className="ordersContainer">
          <div className="ordersHeader">
            <h2 className="ordersTitleMain">zamówienia:</h2>
          </div>
          <div className="ordersEmpty">pobieranie danych...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="ordersPage">
      <div className="ordersContainer">
        <div className="ordersHeader">
          <h2 className="ordersTitleMain">zamówienia:</h2>
        </div>

        {orders.length === 0 ? (
          <div className="ordersEmpty">brak zamówień.</div>
        ) : (
          <div className="ordersList">
            {orders.map((o) => (
              <div className="orderCard" key={o.orderId}>
                <div className="orderTop">
                  <div>
                    <b>Zamówienie: #{o.orderId}</b> data złożenia zamówienia: {o.orderDate}
                  </div>
                  <div>
                    <b>{o.totalAmount} zł</b>
                  </div>
                </div>

                <div className="orderMeta">
                  status: <b>{o.status}</b> - dostawa: <b>{o.deliveryMethod}</b> - płatność:{" "}
                  <b>{o.paymentMethod}</b> - dostawa: <b>{o.shippingCost} zł</b>
                </div>

                <div className="orderItems">
                  {o.items?.map((it: any, idx: number) => (
                    <div className="orderItem" key={idx}>
                      <span className="itName">{it.productName}</span>
                      <span className="itQty">x{it.quantity}</span>
                      <span className="itTotal">{it.lineTotal} zł</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
