import { orbiterBold, orbiterMedium } from "@/app/fonts/og";
import { getPostMetadata } from "@/content/edge";
import { ImageResponse } from "next/og";
import styles from "../../../../../panda.config";

const offblack =
  (styles.theme?.extend?.tokens?.colors?.offblack as any).DEFAULT?.value ??
  "black";

const offwhite =
  (styles.theme?.extend?.tokens?.colors?.offwhite as any).DEFAULT?.value ??
  "white";

export const runtime = "edge";
export const alt = "Barney";
export const size = {
  width: 1600,
  height: 900,
};
export const contentType = "image/png";

type Props = {
  params: {
    post: string;
  };
};

export default async function Image(props: Props) {
  const meta = await getPostMetadata(props.params.post);

  if (meta.hero) {
    return new ImageResponse(
      (
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
            src={meta.hero}
          />
        </div>
      )
    );
  }

  return new ImageResponse(
    (
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
      </div>
    ),
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
    }
  );
}
