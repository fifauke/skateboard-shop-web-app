import { useEffect, useState } from "react";
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/navbar.tsx";
import Footer from "./components/footer/footer.tsx";
import Login from "./login/Login.tsx";
import Register from "./register/Register.tsx"
import Profile from './profile/profile.tsx';
import AdminDashboard from './admindashboard/AdminDashboard.tsx';
import AdminRegister from  './admin_register/admin_register.tsx';
import AdminProductList from  './adminproductlist/adminproductlist.tsx'
import AddProduct from  './addproduct/addproduct.tsx'
import SortBar from "./components/sortbar/sortbar.tsx";
import EditProduct from "./editproduct/editproduct.tsx";
import Cart from "./cart/cart.tsx";
import Product from "./product/product.tsx";
import Checkout from "./checkout/checkout.tsx";
import EditProfile from "./editprofile/editprofile.tsx";
import AdminOrders from './admin_orders/admin_orders.tsx';
import Orders from './user_orders/userorders.tsx';

type Product = {
  id: number;
  name: string;
  price: number;
  brandName: string;
  photoPath: string | null;
};

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const phrase = searchParams.get("search");

useEffect(() => {
    setLoading(true);

    const url = phrase
      ? `http://localhost:8080/api/products/search?phrase=${encodeURIComponent(phrase)}`
      : `http://localhost:8080/api/products${sortBy ? `?sortBy=${sortBy}` : ""}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [phrase, sortBy]);

  return (
    <main style={{ padding: 24 }}>
      {!phrase && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <SortBar value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {loading && <p>Ładowanie…</p>}

      <div className="grid">
        {products.map((p) => (
          <div 
            key={p.id} 
            className="card"
            onClick={() => navigate(`/${p.id}`)}
            style={{ cursor: "pointer" }} 
          >
            {p.photoPath ? (
               <img 
                 src={`http://localhost:8080/uploads/${p.photoPath}`} 
                 alt={p.name} 
                 className="product-thumb"
               />
            ) : (
               <div className="placeholder-img">brak zdjęcia</div>
            )}
            
            <div className="name">{p.name}</div>
            <div className="price">{p.price.toFixed(2)} PLN</div>
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && <p>Brak produktów</p>}
    </main>
  );
}

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        onSearch={(value) => {
          const query = value ? `?search=${encodeURIComponent(value)}` : "";
          navigate(`/${query}`);
        }}
      />

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminregistration" element={<AdminRegister />} />
        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/edit/:id" element={<EditProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile/update" element={<EditProfile />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/profile/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </>
  );
}