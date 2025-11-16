import RestaurantAbout from "@/components/components/restaurant/RestaurantAbout";
import RestaurantGallery from "@/components/components/restaurant/RestaurantGallery";
import RestaurantHero from "@/components/components/restaurant/RestaurantHero";
import RestaurantMenu from "@/components/components/restaurant/RestaurantMenu";
import RestaurantReservation from "@/components/components/restaurant/RestaurantReservation";



function Home() {

  return (
    <div className="min-h-screen">
     <>
     <RestaurantHero />
      <RestaurantAbout />
      <RestaurantMenu />
      <RestaurantGallery />
      <RestaurantReservation />
    </>
    </div>
  );
}

export default Home;
