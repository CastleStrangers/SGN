import { HomePageClient } from "./home-page-client";

export const revalidate = 60;

export default function Home() {
  return <HomePageClient />;
}

