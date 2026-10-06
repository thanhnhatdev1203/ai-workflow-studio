import { redirect } from "next/navigation";
export default async function LegacyNewPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  redirect(`/app/optimize${template ? `?template=${encodeURIComponent(template)}` : ""}`);
}
