"use client";

export const dynamic = "force-dynamic";

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

  useEffect(() => {
    setInterval(() => {
      setDuration(distance(new Date(), epoch));
    }, 500);
  });

  return (
    <p>
      my professional career in technology has lasted approximately{" "}
      <time>{duration}</time>
      &nbsp;(roughly {formatDistance(date, epoch)}).
    </p>
  );
}
