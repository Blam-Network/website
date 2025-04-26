import { api } from "@/src/trpc/server";
import { ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Input } from "@mui/material";
import Link from "next/link";
import { ServiceRecord } from "@/src/api/sunrise/serviceRecord";
import { ScreenshotViewer } from "@/src/components/ScreenshotViewer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography variant='h4'>Screenshot Viewer</Typography>
      <Typography>Select a screenshot file to view the image.</Typography>
      <ScreenshotViewer/>
    </main>
  );
}
