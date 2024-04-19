import { z } from "zod";

const ConfigSchema = z.object({
  NEXT_PUBLIC_VERCEL_URL: z
    .string()
    .optional()
    .default("localhost:3000")
    .transform((s) => `https://${s}`),
});
type Config = z.infer<typeof ConfigSchema>;

const config: Config = ConfigSchema.parse(process.env);

export default config;
