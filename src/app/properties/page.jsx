import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesClient />
    </Suspense>
  );
}