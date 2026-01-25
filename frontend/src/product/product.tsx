import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './product.css';

interface ProductData {
    id: number;
    name: string;
    description: string;
    price: number;
    instock: number;
    photoNames: string[];
    size: string;
    material: string;
    tracks: string;
    concave: string;
    wheels: string;
    bearings: string;
    manufacturersId: number | null;
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [isAdding, setIsAdding] = useState(false); 

    const productId = id || "1";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error("Błąd pobierania produktu");
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError("Nie udało się załadować produktu.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Musisz być zalogowany, aby dodać produkt do koszyka!");
            return;
        }

        setIsAdding(true);

        try {
            const response = await fetch("http://localhost:8080/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: parseInt(productId), 
                    quantity: quantity              
                })
            });

            if (response.ok) {
                alert("Produkt został dodany do koszyka!");
                setQuantity(1);
            } else {
                alert("Wystąpił błąd podczas dodawania do koszyka.");
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
            alert("Nie udało się połączyć z serwerem.");
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) return <div className="productPage">Ładowanie...</div>;
    if (error) return <div className="productPage">{error}</div>;
    if (!product) return <div className="productPage">Nie znaleziono produktu.</div>;

    const availabilityText = product.instock > 20 ? "duża" : (product.instock > 0 ? "mała" : "brak");

    const imageUrl = product.photoNames && product.photoNames.length > 0 
        ? `http://localhost:8080/uploads/${product.photoNames[0]}` 
        : "https://placehold.co/600x400?text=Brak+Zdjecia";

    return (
        <div className="productPage">
            <div className="productContainer">
                
                <div className="productTopSection">
                    <div className="productImageContainer">
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="productImage" 
                        />
                    </div>

                    <div className="productInfoContainer">
                        <h1 className="productTitle">{product.name}</h1>
                        <p className="productPrice">{product.price} PLN</p>

                        <div className="sizeSection">
                            <span style={{fontWeight: 900, fontStyle: 'italic', marginRight: '10px'}}>rozmiar:</span>
                            <div className="sizeBox active">
                                {product.size.replace('"', '”')}
                            </div>
                        </div>
                        <div className="actionSection" style={{ marginTop: '30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            
                            <div className="quantityWrapper">
                                <label style={{ fontWeight: 900, fontStyle: 'italic', marginRight: '5px' }}>ilość:</label>
                                <input 
                                    type="number" 
                                    className="quantityInput"
                                    min="1" 
                                    max={product.instock} 
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                />
                            </div>

                            <button 
                                className="addToCartBtn" 
                                onClick={handleAddToCart}
                                disabled={isAdding || product.instock === 0} 
                            >
                                {isAdding ? "DODAWANIE..." : (product.instock === 0 ? "BRAK TOWARU" : "DODAJ DO KOSZYKA")}
                            </button>
                        </div>
                    

                        <div className="availability" style={{ marginTop: '15px' }}>
                            Dostępność: <span style={{fontWeight: 400}}>{availabilityText} ({product.instock} szt.)</span>
                        </div>
                    </div>
                </div>

                <div className="productDescriptionSection">
                    <h2 className="descriptionTitle">Opis:</h2>
                    <div className="specsList">
                        <div className="specItem"><span className="specLabel">Materiał blatu: </span>{product.material}</div>
                        <div className="specItem"><span className="specLabel">Szerokość blatu: </span>{product.size}</div>
                        <div className="specItem"><span className="specLabel">Concave: </span>{product.concave}</div>
                        <div className="specItem"><span className="specLabel">Koła: </span>{product.wheels}</div>
                        <div className="specItem"><span className="specLabel">Traki: </span>{product.tracks}</div>
                        <div className="specItem"><span className="specLabel">Łożyska: </span>{product.bearings}</div>
                        
                        <div className="specItem" style={{marginTop: '15px'}}>
                           {product.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;