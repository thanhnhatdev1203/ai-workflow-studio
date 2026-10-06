import { OptimizerEntry } from "@/components/prompt-optimizer";
export default async function OptimizePage({ searchParams }: { searchParams: Promise<{ template?: string; prompt?: string; mode?: string; version?: string }> }) {
  const params = await searchParams;
  return <OptimizerEntry templateId={params.template} promptId={params.prompt} mode={params.mode} versionId={params.version} />;
}
