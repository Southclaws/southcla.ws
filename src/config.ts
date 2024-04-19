import { z } from "zod";

const ConfigSchema = z.object({
  baseURL: z
    .string()
    .optional()
    .default("localhost:3000")
    .transform((s) => `https://${s}`),
});
type Config = z.infer<typeof ConfigSchema>;

const config: Config = ConfigSchema.parse({
  baseURL: process.env.NEXT_PUBLIC_VERCEL_URL,
});

export default config;
