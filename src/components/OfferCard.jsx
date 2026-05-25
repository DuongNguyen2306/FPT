import ProductPlanCard from "./ProductPlanCard.jsx";

export default function OfferCard({ item, onRegister, onViewDetails, variant = "grid" }) {
  return (
    <ProductPlanCard
      variant={variant}
      id={item.id}
      displayCode={item.displayCode}
      name={item.name}
      tagline={item.tagline}
      promoBadge={item.promoBadge}
      heroImage={item.heroImage}
      accentImage={item.accentImage}
      price={item.price}
      priceNote={item.priceNote ?? "/tháng"}
      priceDisplay={item.priceDisplay}
      specCaption={item.specCaption}
      specLine={item.specLine}
      downloadMbps={item.downloadMbps}
      uploadMbps={item.uploadMbps}
      statIcon={item.statIcon}
      features={item.features}
      onRegister={onRegister}
      onViewDetails={onViewDetails ? () => onViewDetails(item) : undefined}
    />
  );
}
