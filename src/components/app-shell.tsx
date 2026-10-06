"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Brand, Icon } from "@/components/ui";

const navMain = [
  { href: "/app/optimize", label: "Tối ưu Prompt", icon: "sparkle" },
  { href: "/app/prompts", label: "Prompt của tôi", icon: "layers" },
  { href: "/app/history", label: "Lịch sử", icon: "clock" },
  { href: "/app/templates", label: "Mẫu Prompt", icon: "grid" },
  { href: "/app/favorites", label: "Yêu thích", icon: "heart" },
];
const mobileQuery = "(max-width: 900px)";
function subscribeMobile(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia(mobileQuery).matches, () => false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const close = () => setOpen(false);
  const isActive = (item: (typeof navMain)[number]) => pathname === item.href || pathname.startsWith(`${item.href}/`);
  useEffect(() => {
    if (!mobile || !open) return;
    const sidebar = sidebarRef.current;
    const menuButton = menuRef.current;
    const links = sidebar?.querySelectorAll<HTMLAnchorElement>("a[href]");
    links?.[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab" || !links?.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); menuButton?.focus(); };
  }, [open, mobile]);

  return <div className="app-shell">
    <header className="mobile-header">
      <button ref={menuRef} className="icon-button" onClick={() => setOpen(true)} aria-label="Mở menu" aria-expanded={open} aria-controls="app-sidebar"><Icon name="menu" /></button>
      <Link href="/app" aria-label="StudioFlow - Tối ưu Prompt"><Brand small /></Link>
      <Link href="/app/settings" className="mobile-user" aria-label="AN — Cài đặt tài khoản"><span className="avatar">AN</span></Link>
    </header>
    {mobile && open ? <button className="drawer-backdrop" aria-label="Đóng menu" onClick={close} tabIndex={-1} /> : null}
    <aside ref={sidebarRef} id="app-sidebar" className={`sidebar ${open ? "open" : ""}`} aria-label="Điều hướng chính" role={mobile && open ? "dialog" : undefined} aria-modal={mobile && open ? true : undefined} inert={mobile && !open}>
      <div className="sidebar-brand"><Brand /></div>
      <div className="workspace-label">Không gian làm việc</div>
      <nav className="nav-list">{navMain.map((item) => <Link key={item.href} onClick={close} href={item.href} className={`nav-link ${isActive(item) ? "active" : ""}`} aria-current={isActive(item) ? "page" : undefined}><Icon name={item.icon} />{item.label}</Link>)}</nav>
      <div className="nav-spacer" />
      <div className="sidebar-plan"><div className="sidebar-plan-title">Gói miễn phí</div><p>Optimize và Generate là hai hạn mức riêng. Số liệu trong prototype là minh họa.</p><Link className="button button-primary button-small" href="/app/billing" onClick={close}>Xem các gói</Link></div>
      <div className="workspace-label">Hỗ trợ</div><nav className="nav-list"><Link onClick={close} href="/app/brand" className={`nav-link ${pathname === "/app/brand" ? "active" : ""}`}><Icon name="store" />Brand Context</Link><Link onClick={close} href="/app/billing" className={`nav-link ${pathname === "/app/billing" ? "active" : ""}`}><Icon name="bolt" />Nâng cấp</Link><Link onClick={close} href="/app/settings" className={`nav-link ${pathname === "/app/settings" ? "active" : ""}`}><Icon name="settings" />Cài đặt</Link></nav>
      <div className="sidebar-user"><span className="avatar">AN</span><div><div className="sidebar-user-name">An Nguyễn</div><div className="sidebar-user-plan">Gói miễn phí</div></div></div>
    </aside>
    <main className="app-main" inert={mobile && open}>{children}</main>
  </div>;
}
