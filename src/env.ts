import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    AZURE_AD_CLIENT_ID: z.string().min(1),
    AZURE_AD_CLIENT_SECRET: z.string().min(1),
    AZURE_AD_TENANT_ID: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    HALO3_API_BASE_URL: z.string().min(1),
    SUNRISE2_API_BASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),
    // NEXTAUTH_URL: canonical app URL, use https:// in production
    // SITE_URL: optional override for metadata (defaults to NEXTAUTH_URL)
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_HALO3_API_BASE_URL: z.string().min(1),
  },
  runtimeEnv: {
    // destructure client vars
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    HALO3_API_BASE_URL: process.env.HALO3_API_BASE_URL,
    SUNRISE2_API_BASE_URL: process.env.SUNRISE2_API_BASE_URL,
    NEXT_PUBLIC_HALO3_API_BASE_URL: process.env.NEXT_PUBLIC_HALO3_API_BASE_URL,
    PORT: process.env.PORT,
    // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  },
});