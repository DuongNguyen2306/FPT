import ProductPlanCard from "./ProductPlanCard.jsx";

export default function SpeedXCard({ item, onRegister }) {
  return (
    <ProductPlanCard
      variant="scroll"
      id={item.id}
      displayCode={item.displayCode}
      name={item.shortName}
      tagline={item.tagline}
      promoBadge={item.promoBadge}
      heroImage={item.heroImage}
      accentImage={item.routerImage}
      price={item.price}
      priceNote="/tháng"
      specCaption={item.specCaption}
      specLine={item.specLine}
      statIcon={item.statIcon}
      features={item.features}
      onRegister={onRegister}
    />
  );
}
