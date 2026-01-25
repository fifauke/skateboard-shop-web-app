import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.css";

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    postalCode: "",
    deliveryMethod: "COURIER", 
    paymentMethod: "BLIK"
  });

  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:8080/api/cart", {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        if (!res.ok) throw new Error("Błąd pobierania");
        return res.json();
    })
    .then(data => {
      const items: CartItem[] = data.items || [];
      const total = items.reduce((acc, item) => {
          return acc + (item.unitPrice * item.quantity);
      }, 0);
      setCartTotal(total);
    })
    .catch(err => console.error("Błąd pobierania koszyka", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const orderRequest = {
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      address: {
        city: formData.city,
        street: formData.street,
        postalCode: formData.postalCode,
        country: "Poland",
        buildingNumber: "1" 
      }
    };

    try {
      const res = await fetch("http://localhost:8080/api/cart/checkout", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequest)
      });

      if (res.ok) {
        alert("Zamówienie zostało złożone pomyślnie!");
        navigate("/profile"); 
      } else {
        const txt = await res.text();
        alert("Błąd: " + txt);
      }
    } catch (err) {
      console.error(err);
      alert("Błąd połączenia.");
    } finally {
      setLoading(false);
    }
  };
  const shippingCost = formData.deliveryMethod === "COURIER" ? 15.00 : 12.00;
  const safeCartTotal = isNaN(cartTotal) ? 0 : cartTotal;
  const finalTotal = safeCartTotal + shippingCost;

  return (
    <main className="checkoutPage">
      <div className="checkoutContainer">
        <div className="checkoutHeaderBar">
            <h1 className="checkoutTitle">kasa / finalizacja:</h1>
        </div>
        <form className="checkoutContent" onSubmit={handleSubmit}>
          <div className="leftColumn">
            <div className="checkoutSection">
              <div className="sectionHeader">adres dostawy:</div>
              <div className="checkoutInputGroup">
                <label className="checkoutLabel">miasto:</label>
                <input 
                    name="city" 
                    className="checkoutInput" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                />
              </div>
              <div className="checkoutInputGroup">
                <label className="checkoutLabel">ulica i numer:</label>
                <input 
                    name="street" 
                    className="checkoutInput" 
                    value={formData.street} 
                    onChange={handleChange} 
                    required 
                />
              </div>
              
              <div className="checkoutInputGroup">
                <label className="checkoutLabel">kod pocztowy:</label>
                <input 
                    name="postalCode" 
                    className="checkoutInput" 
                    value={formData.postalCode} 
                    onChange={handleChange} 
                    required 
                />
              </div>
            </div>
            <div className="checkoutSection">
              <div className="sectionHeader">dostawa i płatność:</div>
              
              <div className="checkoutInputGroup">
                <label className="checkoutLabel">metoda dostawy:</label>
                <select 
                    name="deliveryMethod" 
                    className="checkoutSelect" 
                    value={formData.deliveryMethod} 
                    onChange={handleChange}
                >
                  <option value="COURIER">Kurier DPD (+15 PLN)</option>
                  <option value="PARCEL_LOCKER">Paczkomat InPost (+12 PLN)</option>
                </select>
              </div>
              
              <div className="checkoutInputGroup">
                <label className="checkoutLabel">metoda płatności:</label>
                <select 
                    name="paymentMethod" 
                    className="checkoutSelect" 
                    value={formData.paymentMethod} 
                    onChange={handleChange}
                >
                  <option value="BLIK">BLIK</option>
                  <option value="CARD">Karta Płatnicza</option>
                  <option value="TRANSFER">Przelew Tradycyjny</option>
                </select>
              </div>
            </div>
          </div>
          <div className="rightColumn">
            <div className="orderSummaryBox">
              <div className="sectionHeader" style={{ border: 'none', marginBottom: '10px' }}>
                  podsumowanie:
              </div>
              
              <div className="summaryRow">
                <span>Wartość koszyka:</span>
                <span>{safeCartTotal.toFixed(2)} PLN</span>
              </div>
              <div className="summaryRow">
                <span>Dostawa:</span>
                <span>{shippingCost.toFixed(2)} PLN</span>
              </div>
              
              <div className="totalRow">
                <span>DO ZAPŁATY:</span>
                <span>{finalTotal.toFixed(2)} PLN</span>
              </div>

              <button type="submit" className="placeOrderBtn" disabled={loading}>
                {loading ? "PRZETWARZANIE..." : "ZAMAWIAM I PŁACĘ"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}