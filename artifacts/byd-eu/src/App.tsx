import { useRouter, matchPath } from "@/lib/router";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Models from "@/components/Models";
import Technology from "@/components/Technology";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CarDetailPage from "@/pages/CarDetailPage";
import Sealion7Page from "@/pages/Sealion7Page";

function HomePage() {
  return (
    <div className="byd-app">
      <Header />
      <main>
        <Hero />
        <Models />
        <Technology />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const { path } = useRouter();

  const carMatch = matchPath("/car/:slug", path);
  if (carMatch) {
    if (carMatch.slug === "sealion-7") return <Sealion7Page />;
    return <CarDetailPage slug={carMatch.slug} />;
  }

  return <HomePage />;
}

export default App;
