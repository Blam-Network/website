import { z } from "zod";
import { publicProcedure } from "../trpc";
import { halo3Axios } from "../halo3/halo3Axios";
import { jsonStringifySchema } from "@/src/zod";

const HealthCheckSchema = z.object({
  status: z.enum(["pass", "fail"]),
  latencyMs: z.number().optional(),
  message: z.string().optional(),
});

export const HealthReportSchema = jsonStringifySchema(
  z.object({
    service: z.enum(["full", "partial", "none"]),
    status: z.enum(["healthy", "degraded", "unhealthy"]),
    timestamp: z.string(),
    version: z.string(),
    checks: z.record(HealthCheckSchema),
  }),
);

export type ServiceHealthReport = z.infer<typeof HealthReportSchema>;

function parseAxiosBody(data: unknown): unknown {
  return typeof data === "string" ? JSON.parse(data) : data;
}

/** Fetches GET /health; 503 still returns a JSON body with `service: "none"`. */
export const serviceHealth = publicProcedure.query(async (): Promise<ServiceHealthReport> => {
  try {
    const response = await halo3Axios.get("/health");
    const parsed = HealthReportSchema.safeParse(parseAxiosBody(response.data));
    if (parsed.success) {
      return parsed.data;
    }
  } catch {
    // fall through
  }

  return {
    service: "none",
    status: "unhealthy",
    timestamp: new Date().toISOString(),
    version: "unknown",
    checks: {},
  };
});
