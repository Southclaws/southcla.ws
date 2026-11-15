import localFont from "next/font/local";

// The stylesheet is inlined into the document, so @font-face rules are
// discovered immediately and the browser only fetches the faces a page
// renders. Only the text faces are preloaded (a late swap would shift the
// layout); heading faces would otherwise compete with the LCP for bandwidth.

export const orbiter = localFont({
  src: [
    { path: "./static/TASAOrbiterVF.woff2", weight: "100 900" },
    { path: "./static/web/TASAOrbiterDisplay-Medium.woff2", weight: "500" },
    { path: "./static/web/TASAOrbiterDisplay-Bold.woff2", weight: "700" },
  ],
  preload: false,
  variable: "--font-orbiter",
});

// UI copy is set in Inter Display Italic. These faces are deliberately
// registered as the *normal* style: that is how the site has always rendered
// (the previous 38-file declaration resolved to these faces), but now only the
// two weights in use are shipped, subset to Latin/Latin Extended (~45KB each
// instead of ~4MB of preloaded fonts).
//
// For upright Inter instead, swap these for InterDisplay-Regular/-Medium.
export const inter = localFont({
  src: [
    { path: "./static/web/InterDisplay-Italic.woff2", weight: "400" },
    { path: "./static/web/InterDisplay-MediumItalic.woff2", weight: "500" },
  ],
  preload: true,
  variable: "--font-inter",
});

export const hedvig = localFont({
  src: "./static/hedvig-letters-serif-v2-latin-regular.woff2",
  preload: true,
  variable: "--font-hedvig",
});
