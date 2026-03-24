import { loadItinerary } from "@/application/itinerary";
import HomeIntro from "@/components/home/HomeIntro";
import ItineraryDayList from "@/components/home/ItineraryDayList";

export default function HomePage() {
  const data = loadItinerary();

  return (
    <div>
      <HomeIntro />
      <ItineraryDayList days={data.days} stages={data.stages} />
    </div>
  );
}
