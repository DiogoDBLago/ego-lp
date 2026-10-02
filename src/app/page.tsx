import SmoothScroll from "@/components/SmoothScroll";
import GridFloor from "@/components/GridFloor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Rating from "@/components/Rating";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Feedbacks from "@/components/Feedbacks";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <GridFloor />
      <Nav />
      <main className="page">
        <Hero />
        <Rating />
        <Manifesto />
        <Services />
        <Portfolio />
        <Feedbacks />
        <Marquee />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
