import Craft from "@/components/home/Craft";
import Hero from "@/components/home/Hero";
import NewsLetter from "@/components/home/NewsLetter";
import Preview from "@/components/home/Preview";
import Services from "@/components/home/Services";
import ShopPreview from "@/components/home/ShopPreview";

export default function Home() {
  return (
    <main>
      <Hero />
      <Preview />
      <ShopPreview />
      <Services />
      <Craft />
      <NewsLetter />
    </main>
  );
}
