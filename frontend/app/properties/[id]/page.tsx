import PropertyClientPage from './property-client';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const propertyId = decodeURIComponent(resolved.id);
  return <PropertyClientPage propertyId={propertyId} />;
}
