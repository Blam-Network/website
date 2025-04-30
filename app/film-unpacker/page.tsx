import { api } from "@/src/trpc/server";
import { ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Input } from "@mui/material";
import Link from "next/link";
import { ServiceRecord } from "@/src/api/sunrise/serviceRecord";
import { FilmUnpacker } from "@/src/components/FilmUnpacker";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography variant='h4'>Film Unpacker</Typography>
      <Typography>Select a film file to extract the map and game variant. Currently supports Halo 3 films.</Typography>
      <FilmUnpacker/>
    </main>
  );
}
