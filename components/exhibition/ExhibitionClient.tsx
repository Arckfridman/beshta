"use client";

import dynamic from "next/dynamic";
import { ExhibitionShell } from "./ExhibitionShell";

const Exhibition = dynamic(
  () =>
    import("@/components/exhibition/Exhibition").then((mod) => mod.Exhibition),
  { ssr: false, loading: () => <ExhibitionShell /> },
);

export function ExhibitionClient() {
  return <Exhibition />;
}
