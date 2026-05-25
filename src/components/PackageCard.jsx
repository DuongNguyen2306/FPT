import ProductPlanCard from "./ProductPlanCard.jsx";

export default function PackageCard({ pkg, onRegister, onViewDetails, variant = "grid" }) {
  return (
    <ProductPlanCard
      variant={variant}
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
      downloadMbps={pkg.downloadMbps}
      uploadMbps={pkg.uploadMbps}
      features={pkg.features}
      onRegister={onRegister}
      onViewDetails={onViewDetails ? () => onViewDetails(pkg) : undefined}
    />
  );
}
