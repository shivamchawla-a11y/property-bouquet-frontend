import CollectionClient from "./CollectionClient";

export const metadata = {
  title: "SEO Engine | Property Bouquet Admin",
};

export default async function CollectionsPage({
  searchParams,
}) {
  const params = await searchParams;

  return (
    <CollectionClient
      editId={params.edit || null}
    />
  );
}