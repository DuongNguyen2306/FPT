import ProductPlanCard from "./ProductPlanCard.jsx";

export default function OfferCard({ item, onRegister }) {
  return (
    <ProductPlanCard
      variant="grid"
      id={item.id}
      displayCode={item.displayCode}
      name={item.name}
      tagline={item.tagline}
      promoBadge={item.promoBadge}
      heroImage={item.heroImage}
      accentImage={item.accentImage}
      price={item.price}
      priceNote={item.priceNote}
      priceDisplay={item.priceDisplay}
      specCaption={item.specCaption}
      specLine={item.specLine}
      statIcon={item.statIcon}
      features={item.features}
      onRegister={onRegister}
    />
  );
}
