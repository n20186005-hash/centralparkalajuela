import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import WeatherSection from '@/components/WeatherSection';
import BasicInfo from '@/components/BasicInfo';
import HistoryTimeline from '@/components/HistoryTimeline';
import Legends from '@/components/Legends';
import RouteSection from '@/components/RouteSection';
import Wildlife from '@/components/Wildlife';
import HoursSection from '@/components/HoursSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import TopicLinks from '@/components/TopicLinks';
import Layover from '@/components/Layover';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import FAQSection from '@/components/FAQSection';
import SourcesSection from '@/components/SourcesSection';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';
import { fetchWeather } from '@/lib/weather';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Server-side weather snapshot: fetched and cached during page generation.
  const weatherInitial = await fetchWeather();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <WeatherSection initial={weatherInitial} />
        <BasicInfo />
        <HistoryTimeline />
        <Legends />
        <RouteSection />
        <Wildlife />
        <HoursSection />
        <FacilitiesSection />
        <TicketsSection />
        <TransportSection />
        <TopicLinks />
        <Layover />
        <Gallery />
        <Reviews />
        <FAQSection />
        <SourcesSection />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
