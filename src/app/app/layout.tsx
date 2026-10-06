import { AppShell } from "@/components/app-shell";
import { PrototypeProvider } from "@/components/prototype-provider";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeProvider><AppShell>{children}</AppShell></PrototypeProvider>;
}
