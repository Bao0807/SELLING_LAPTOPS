import { PromoBar } from "../components/PromoBar";
import { HeroSection } from "../components/HeroSection";
import { BrandBanner } from "../components/BrandBanner";
import { CategorySection } from "../components/CategorySection";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { WhyCAS } from "../components/WhyCAS";
import { Testimonials } from "../components/Testimonials";

export function HomePage() {
  return (
    <main style={{ paddingTop: "140px" }}>
      {/* Promo flash sale bar */}
      <PromoBar />

      {/* Hero banner with slider */}
      <HeroSection />

      {/* Brand logos strip */}
      <BrandBanner />

      {/* Product categories */}
      <CategorySection />

      {/* Featured products grid */}
      <FeaturedProducts />

      {/* Why CAS + stats */}
      <WhyCAS />

      {/* Customer testimonials */}
      <Testimonials />
    </main>
  );
}
