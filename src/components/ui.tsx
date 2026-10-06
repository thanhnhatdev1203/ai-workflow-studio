import type { ButtonHTMLAttributes, ReactNode } from "react";

const iconShapes: Record<string, ReactNode> = {
  sparkle: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
  right: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1V10Z"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  grid: <><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  heart: <path d="M20.8 8.7c0 4.3-8.8 10-8.8 10s-8.8-5.7-8.8-10A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.8 2.2Z"/>,
  store: <><path d="M3 10h18l-2-7H5l-2 7Z"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2L5.9 12l1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 2Z" transform="translate(-1 -1)"/></>,
  message: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8v.5Z"/></>,
  bag: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  play: <><rect x="3" y="4" width="18" height="16" rx="4"/><path d="m10 9 5 3-5 3V9Z"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  headset: <><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 12h3v7H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 1-2ZM20 12h-3v7h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-1-2Z"/></>,
  edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l0 5Z"/></>,
  light: <><path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 12.7c.6.4 1 1 1 1.8h6c0-.8.4-1.4 1-1.8A7 7 0 0 0 12 2Z"/></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/></>,
  chevron: <path d="m7 10 5 5 5-5"/>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>,
  book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5v-13Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/></>,
  chevronRight: <path d="m9 18 6-6-6-6"/>,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  return <svg className={`icon ${className ?? ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconShapes[name] ?? iconShapes.sparkle}</svg>;
}

export function Brand({ small = false }: { small?: boolean }) {
  return <span className={`brand ${small ? "mobile-brand" : ""}`}><span className="brand-mark"><Icon name="sparkle" /></span><span>Studio<span style={{ color: "var(--green)" }}>Flow</span></span></span>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet"; size?: "default" | "small"; children: ReactNode };
export function Button({ variant = "primary", size = "default", children, className = "", ...props }: ButtonProps) {
  return <button className={`button button-${variant} ${size === "small" ? "button-small" : ""} ${className}`} {...props}>{children}</button>;
}

export function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{action ? <div className="heading-actions">{action}</div> : null}</div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="card empty-state"><div><span className="empty-icon"><Icon name="layers" /></span><h3>{title}</h3><p>{description}</p>{action}</div></div>;
}
