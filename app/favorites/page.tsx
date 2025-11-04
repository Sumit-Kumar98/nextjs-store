import SectionTitle from "@/components/global/SectionTitle";
import ProductsGrid from "@/components/products/ProductsGrid";
import { fetchUserFavorites } from "@/utils/action";

const FavoritesPage = async () => {
  const favorites = await fetchUserFavorites();

  if (favorites.length === 0)
    return <SectionTitle text="You have no favorites yet" />;

  return (
    <div>
      <SectionTitle text="Favorites" />
      <ProductsGrid products={favorites.map((favorite) => favorite.product)} />
    </div>
  );
};

export default FavoritesPage;
