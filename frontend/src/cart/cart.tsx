import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  photoPath?: string; 
  manufacturer?: string; 
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/cart", {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error("Błąd pobierania koszyka");
      return res.json();
    })
    .then(data => {
      const items = Array.isArray(data) ? data : (data.items || []);
      setCartItems(items);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleRemove = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/cart/remove/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCartItems(cartItems.filter(item => item.productId !== id));
      }
    } catch (err) { console.error(err); }
  };

  const handleQuantityChange = (productId: number, newQty: number) => {
    if (newQty < 1) return;

    setCartItems(cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: newQty } : item
    ));


    const token = localStorage.getItem("token");
    
    fetch(`http://localhost:8080/api/cart/update/${productId}?quantity=${newQty}`, {
      method: "PUT",
      headers: { 
        'Authorization': `Bearer ${token}` 

      }
    }).then(res => {
      if (!res.ok) {
        console.error("Błąd aktualizacji ilości w bazie");
      }
    }).catch(err => console.error("Błąd sieci:", err));
  };

  const renderProductImage = (item: CartItem) => {
    if (item.photoPath) {
      return (
        <img 
            src={`http://localhost:8080/uploads/${item.photoPath}`}
            alt={item.productName} 
        />
      );
    }
    return (
        <svg className="placeholderIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
    );
  };

  if (loading) return <main className="cartPage"><p>ładowanie...</p></main>;

  return (
    <main className="cartPage">
      <div className="cartContainer">
        
        <div className="cartHeaderBar">
            <h1 className="cartTitle">twój koszyk:</h1>
        </div>

        <div className="cartListBody">
            {cartItems.length > 0 ? (
                <>
                    {cartItems.map((item) => (
                        <div key={item.productId} className="cartItemRow">
                        
                            <div className="cartItemImage">
                                {renderProductImage(item)}
                            </div>

                            <div className="cartItemDetails">
                                <div className="cartDetailRow">
                                    <span className="cartLabel">produkt:</span>
                                    <span className="cartValue">{item.productName}</span>
                                </div>
                                <div className="cartDetailRow">
                                    <span className="cartLabel">producent:</span>
                                    <span className="cartValue">{item.manufacturer || "-"}</span>
                                </div>
                            </div>

                            <div className="cartItemActions">
                                <input 
                                    type="number" 
                                    className="quantityInput"
                                    value={item.quantity} 
                                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                                    min="1"
                                />
                                <button 
                                    className="deleteItemBtn" 
                                    onClick={() => handleRemove(item.productId)}
                                    title="usuń"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="cartItemPrice">
                                {(item.unitPrice * item.quantity).toFixed(2)} pln
                            </div>
                        </div>
                    ))}

                    <div className="cartFooterActions">
                        <button className="checkoutBtn" onClick={() => navigate("/checkout")}>
                            do kasy
                        </button>
                    </div>
                </>
            ) : (
                <p className="emptyCartMessage">twój koszyk jest pusty.</p>
            )}
        </div>
      </div>
    </main>
  );
}