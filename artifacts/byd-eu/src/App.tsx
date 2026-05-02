import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Models from "@/components/Models";
import Technology from "@/components/Technology";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

function App() {
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

export default App;
