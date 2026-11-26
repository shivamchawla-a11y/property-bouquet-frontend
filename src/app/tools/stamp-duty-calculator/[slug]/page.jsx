import { notFound } from "next/navigation";
import StampDutyCalculatorExperience from "@/components/stamp-duty-calculator/StampDutyCalculatorExperience";
import { getStateBySlug, INDIAN_STATES, slugifyStateName } from "@/components/stamp-duty-calculator/stampDutyRates";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDIAN_STATES.map((state) => ({
    slug: slugifyStateName(state.name),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const state = getStateBySlug(slug);

  if (!state) {
    return { title: "Stamp Duty Calculator | Property Bouquet" };
  }

  const title = `Stamp Duty Calculator in ${state.name} | Property Bouquet`;
  const description = `Estimate stamp duty and property registration charges in ${state.name}. Calculate indicative government charges based on property value, ownership category and location.`;
  const canonical = `/tools/stamp-duty-calculator/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function StateStampDutyCalculatorPage({ params }) {
  const { slug } = await params;
  const state = getStateBySlug(slug);

  if (!state) notFound();

  return (
    <StampDutyCalculatorExperience
      key={state.code}
      initialStateCode={state.code}
      stateLocked={true}
    />
  );
}
