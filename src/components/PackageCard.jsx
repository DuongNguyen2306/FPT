import ProductPlanCard from "./ProductPlanCard.jsx";

export default function PackageCard({ pkg, onRegister }) {
  return (
    <ProductPlanCard
      variant="grid"
      id={pkg.id}
      displayCode={pkg.displayCode}
      name={pkg.name}
      tagline={pkg.tagline}
      promoBadge={pkg.promoBadge}
      heroImage={pkg.heroImage}
      accentImage={pkg.accentImage}
      price={pkg.price}
      priceNote="/tháng"
      specCaption={pkg.specCaption}
      specLine={pkg.specLine}
      statIcon={pkg.statIcon}
      features={pkg.features}
      onRegister={onRegister}
    />
  );
}
