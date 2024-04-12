export const orbiterBold = () =>
  fetch(new URL("./static/TASAOrbiterDisplay-Bold.otf", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

export const orbiterMedium = () =>
  fetch(
    new URL("./static/TASAOrbiterDisplay-Medium.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());

export const interMedium = () =>
  fetch(new URL("./static/Inter-Medium.woff2", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

export const hedvig = () =>
  fetch(
    new URL(
      "./static/hedvig-letters-serif-v2-latin-regular.woff2",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());
