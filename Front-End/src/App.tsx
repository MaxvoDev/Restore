import { useEffect, useState } from "react"
import { Product } from "./product";

function App() {
  const [products, setProducts] = useState<Product[]>([])

  function addProduct(){
    setProducts(prevState => [...prevState, { 
      id: prevState.length + 101,
      name: 'product' + prevState.length,
      price: 500.00,
      brand: 'some brand',
      description: 'some description',
      pictureUrl: 'http://picsum.photos/200'
    }]);
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
    .then(response => response.json())
    .then(response => {
      setProducts(response);
    })  
  }, []);

  return (
    <div>
      <h1>Re-Store</h1>
      <ul>
        {products.map(item => (
          <li key={item.name}>{item.name} - {item.price}</li>
        ))}
      </ul>
      <button onClick={addProduct}>Add Product</button>
    </div>
  )
}

export default App
