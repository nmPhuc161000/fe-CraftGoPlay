import ArtisanProducts from "./components/ArtisanProducts";
import ArtisanDetail from "./components/ArtisanDetail";
import MainLayout from "../../components/layout/MainLayout";
import { useParams } from "react-router-dom";

const ShopArtisan = () => {
  const { id } = useParams(); 

  return (
    <MainLayout>
      <ArtisanDetail artisanId={id} />
      <ArtisanProducts artisanId={id} />
    </MainLayout>
  );
};

export default ShopArtisan;
