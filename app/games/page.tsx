import { GamesPage } from "@/src/components/games/GamesPage";
import { gamesPageMetadata } from "@/src/utils/sectionMetadata";

export const metadata = gamesPageMetadata;

export default function GamesRoutePage() {
  return <GamesPage />;
}
