import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join(process.cwd(), "src/app/fonts/static");

const load = (file: string) => readFile(join(dir, file));

export const orbiterBold = () => load("TASAOrbiterDisplay-Bold.otf");

export const orbiterMedium = () => load("TASAOrbiterDisplay-Medium.otf");

export const interMedium = () => load("Inter-Medium.woff2");

export const hedvig = () =>
  load("hedvig-letters-serif-v2-latin-regular.woff2");
