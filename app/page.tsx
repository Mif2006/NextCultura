import About from '@/components/components/About';
import Contact from '@/components/components/Contact';
import Hero from '@/components/components/Hero';
import Offers from '@/components/components/Offers';
import Rooms from '@/components/components/Rooms';


function Home() {

  return (
    <div className="min-h-screen">
     <>
      <Hero />
      <About />
      <Rooms />
      <Offers />
      <Contact />
    </>
    </div>
  );
}

export default Home;
