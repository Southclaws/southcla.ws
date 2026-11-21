"use client";

import { formatDistance, formatDistanceStrict } from "date-fns";
import { useEffect, useState } from "react";

const epoch = new Date(2012, 4, 24);

function distance(from: Date, to: Date): string {
  return formatDistanceStrict(from, to, { unit: "second" });
}

type Props = {
  date: Date;
};

export function Career({ date }: Props) {
  const [duration, setDuration] = useState(distance(date, epoch));

  // One ticking interval for the lifetime of the component (previously a new
  // interval was added on every render, piling up every 500ms).
  useEffect(() => {
    const tick = () => setDuration(distance(new Date(), epoch));
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <p>
      my professional career in technology has lasted approximately{" "}
      <time>{duration}</time>
      &nbsp;(roughly {formatDistance(date, epoch)}).
    </p>
  );
}
