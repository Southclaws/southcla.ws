import localFont from "next/font/local";

export const orbiter = localFont({
  src: [
    { path: "./static/TASAOrbiterVF.woff2", weight: "100 900" },
    { path: "./static/TASAOrbiterDisplay-Medium.otf", weight: "500" },
    { path: "./static/TASAOrbiterDisplay-Bold.otf", weight: "700" },
  ],
  preload: true,
  variable: "--font-orbiter",
});

export const explorer = localFont({
  src: [{ path: "./static/TASAExplorerVF.woff2", weight: "100 900" }],
  preload: true,
  variable: "--font-orbiter",
});

export const inter = localFont({
  src: [
    { path: "static/Inter-Thin.woff2", weight: "100" },
    { path: "static/Inter-ThinItalic.woff2", weight: "100" },
    { path: "static/Inter-ExtraLight.woff2", weight: "200" },
    { path: "static/Inter-ExtraLightItalic.woff2", weight: "200" },
    { path: "static/Inter-Light.woff2", weight: "300" },
    { path: "static/Inter-LightItalic.woff2", weight: "300" },
    { path: "static/Inter-Regular.woff2", weight: "400" },
    { path: "static/Inter-Italic.woff2", weight: "400" },
    { path: "static/Inter-Medium.woff2", weight: "500" },
    { path: "static/Inter-MediumItalic.woff2", weight: "500" },
    { path: "static/Inter-SemiBold.woff2", weight: "600" },
    { path: "static/Inter-SemiBoldItalic.woff2", weight: "600" },
    { path: "static/Inter-Bold.woff2", weight: "700" },
    { path: "static/Inter-BoldItalic.woff2", weight: "700" },
    { path: "static/Inter-ExtraBold.woff2", weight: "800" },
    { path: "static/Inter-ExtraBoldItalic.woff2", weight: "800" },
    { path: "static/Inter-Black.woff2", weight: "900" },
    { path: "static/Inter-BlackItalic.woff2", weight: "900" },
    { path: "static/InterDisplay-Thin.woff2", weight: "100" },
    { path: "static/InterDisplay-ThinItalic.woff2", weight: "100" },
    { path: "static/InterDisplay-ExtraLight.woff2", weight: "200" },
    { path: "static/InterDisplay-ExtraLightItalic.woff2", weight: "200" },
    { path: "static/InterDisplay-Light.woff2", weight: "300" },
    { path: "static/InterDisplay-LightItalic.woff2", weight: "300" },
    { path: "static/InterDisplay-Regular.woff2", weight: "400" },
    { path: "static/InterDisplay-Italic.woff2", weight: "400" },
    { path: "static/InterDisplay-Medium.woff2", weight: "500" },
    { path: "static/InterDisplay-MediumItalic.woff2", weight: "500" },
    { path: "static/InterDisplay-SemiBold.woff2", weight: "600" },
    { path: "static/InterDisplay-SemiBoldItalic.woff2", weight: "600" },
    { path: "static/InterDisplay-Bold.woff2", weight: "700" },
    { path: "static/InterDisplay-BoldItalic.woff2", weight: "700" },
    { path: "static/InterDisplay-ExtraBold.woff2", weight: "800" },
    { path: "static/InterDisplay-ExtraBoldItalic.woff2", weight: "800" },
    { path: "static/InterDisplay-Black.woff2", weight: "900" },
    { path: "static/InterDisplay-BlackItalic.woff2", weight: "900" },
    { path: "static/InterVariable-Italic.woff2", weight: "100 900" },
    { path: "static/InterVariable.woff2", weight: "100 900" },
  ],
  preload: true,
  variable: "--font-inter",
});

export const hedvig = localFont({
  src: "./static/hedvig-letters-serif-v2-latin-regular.woff2",
  preload: true,
  variable: "--font-hedvig",
});
