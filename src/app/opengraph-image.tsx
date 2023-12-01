import { ImageResponse } from "next/og";
import styles from "../../panda.config";

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

export default async function Image() {
  const orbiterBold = fetch(
    new URL("./TASAOrbiterDisplay-Bold.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const orbiterMedium = fetch(
    new URL("./TASAOrbiterDisplay-Medium.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());

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
          <h1 style={{ fontSize: "120", fontWeight: 800 }}>barney</h1>
          <p style={{ fontSize: "80", fontWeight: 400 }}>
            multidisciplinary maker
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
          data: await orbiterBold,
          style: "normal",
          weight: 800,
        },
        {
          name: "TASA Orbiter",
          data: await orbiterMedium,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
