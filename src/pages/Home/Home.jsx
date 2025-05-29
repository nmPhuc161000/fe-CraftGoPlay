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
      <h1>Sản phẩm</h1>
    </MainLayout>
  );
};

export default Home;
