import React from "react";
import Header from "../../components/Header/Header";
import ArtisanProducts from "./components/ArtisanProducts";
import ArtisanDetail from "./components/ArtisanDetail";
import Footer from "../../components/Footer/Footer";

const ShopArtisan = () => {
    return (
        <div>
            <Header />
            <ArtisanDetail />
            <ArtisanProducts />
            <Footer />
        </div>
    )
}

export default ShopArtisan;
