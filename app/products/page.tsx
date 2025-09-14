// two ways of defining the types here for the searchParams
// 1. searchParams: Promise<{[key:string]: string | string[] | undefined}>

// 2.
// type ProductSearchParams = {
//   layout?: string;
//   search?: string;
// }

import ProductsContainer from '@/components/products/ProductsContainer'

type ProductSearchParams = {
  layout?: string;
  search?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>;
}) {
  // const params = await searchParams;
  //   const search = params.search;
  // const random = params.random;
  // console.log(params);

  const params = await searchParams;
  const layout = params.layout || "grid";
  const search = params.search || ''

  return <ProductsContainer layout={layout} search={search} />
}
