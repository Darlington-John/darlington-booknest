" use client"
import Loader from "./components/loader";
import BestSellers from "./components/sections/home/best-sellers";
import Features from "./components/sections/home/features";
import Hero from "./components/sections/home/hero";
import NewArrivals from "./components/sections/home/new-arrivals";


export default function Home() {
  return (
    <main className="bg-white relative overflow-hidden">

<Hero/>
<Features/>
<NewArrivals/>
<BestSellers/>
    </main>
  );
}
