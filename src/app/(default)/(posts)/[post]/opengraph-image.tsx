import { orbiterBold, orbiterMedium } from "@/app/fonts/og";
import { getContent } from "@/content/content";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import styles from "../../../../../panda.config";

const offblack =
  (styles.theme?.extend?.tokens?.colors?.offblack as any).DEFAULT?.value ??
  "black";

const offwhite =
  (styles.theme?.extend?.tokens?.colors?.offwhite as any).DEFAULT?.value ??
  "white";

export const alt = "Barney";
export const size = {
  width: 1600,
  height: 900,
};
export const contentType = "image/png";

type Props = {
  params: Promise<{
    post: string;
  }>;
};

const mimeTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

// Hero images live in public/, inline them so the renderer doesn't need to
// fetch them over HTTP from the site itself.
async function loadHero(hero: string) {
  const file = path.join(process.cwd(), "public", hero);
  const mime = mimeTypes[path.extname(file).toLowerCase()] ?? "image/png";
  const data = await readFile(file);
  return `data:${mime};base64,${data.toString("base64")}`;
}

export default async function Image(props: Props) {
  const { post } = await props.params;
  const { metadata: meta } = await getContent(post);

  if (meta.hero) {
    const hero = await loadHero(meta.hero);

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          src={hero}
        />
      </div>,
    );
  }

  return new ImageResponse(
    <div
      style={{
        background: offblack,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "80px",
        alignItems: "flex-start",
        justifyContent: "space-between",
        color: offwhite,
        fontFamily: "TASA Orbiter",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            fontSize: "120",
            fontWeight: 800,
            textOverflow: "ellipsis",
            overflow: "hidden",
            lineClamp: 2,
            display: "block",
          }}
        >
          {meta.title}
        </h1>
        <p
          style={{
            fontSize: "80",
            fontWeight: 400,
            textOverflow: "ellipsis",
            overflow: "hidden",
            lineClamp: 3,
            display: "block",
          }}
        >
          {meta.subtitle}
        </p>
      </div>

      <div
        style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
      >
        <p style={{ fontSize: "60", fontWeight: 400 }}>@southclaws</p>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "TASA Orbiter",
          data: await orbiterBold(),
          style: "normal",
          weight: 800,
        },
        {
          name: "TASA Orbiter",
          data: await orbiterMedium(),
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
