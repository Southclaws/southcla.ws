import { ImageResponse } from "next/og";
import styles from "../../panda.config";
import { orbiterBold } from "./fonts/og";

const offblack =
  (styles.theme?.extend?.tokens?.colors?.offblack as any).DEFAULT?.value ??
  "black";

const offwhite =
  (styles.theme?.extend?.tokens?.colors?.offwhite as any).DEFAULT?.value ??
  "white";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: offblack,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: offwhite,
        }}
      >
        s
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
      ],
    }
  );
}
