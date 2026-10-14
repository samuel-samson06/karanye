import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

// Storefront chrome: universal Header → page → Footer. Admin routes live
// outside this group and never inherit it.
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}
