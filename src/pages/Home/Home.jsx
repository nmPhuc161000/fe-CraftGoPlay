import React, { useEffect, useState } from "react";
import { homeApi } from "../../services";
import MainLayout from "../../components/layout/MainLayout";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    homeApi.getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-lg">Here are some products:...</p>
        <ul className="mt-4">
          {products.map((product) => (
            <li key={product.id} className="mb-2">
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

export default Home;
