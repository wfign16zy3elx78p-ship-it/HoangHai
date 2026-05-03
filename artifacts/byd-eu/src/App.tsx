import { useRouter, matchPath } from "@/lib/router";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Models from "@/components/Models";
import Technology from "@/components/Technology";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import GenericCarPage from "@/pages/GenericCarPage";
import Sealion7Page from "@/pages/Sealion7Page";
import TestDrivePage from "@/pages/TestDrivePage";
import AdminPanelPage from "@/pages/AdminPanelPage";

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

  if (path === "/test-drive") return <TestDrivePage />;
  if (path === "/adminpanel") return <AdminPanelPage />;

  const carMatch = matchPath("/car/:slug", path);
  if (carMatch) {
    if (carMatch.slug === "sealion-7") return <Sealion7Page />;
    return <GenericCarPage slug={carMatch.slug} />;
  }

  return <HomePage />;
}

export default App;
