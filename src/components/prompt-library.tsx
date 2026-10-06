"use client";

import Link from "next/link";
import { useState } from "react";
import { usePrototype } from "@/components/prototype-provider";
import { Button, EmptyState, Icon, PageHeading } from "@/components/ui";
import { domains, getDomain } from "@/lib/prompt-catalog";
import { versionLabels, type PromptRecord, type PromptVersion } from "@/lib/prompt-model";
import styles from "./prompt-library.module.css";

export function PromptLibrary({ mode }: { mode: "library" | "favorites" | "history" }) {
  const { saved, toggleFavorite, notify } = usePrototype();
  const [search, setSearch] = useState("");
  const [domainId, setDomainId] = useState("all");
  const titles = { library: "Prompt của tôi", favorites: "Yêu thích", history: "Lịch sử Prompt" };
  const descriptions = { library: "Giữ prompt, các phiên bản và cách sửa để tiếp tục khi cần.", favorites: "Những prompt đã đánh dấu để tìm lại nhanh.", history: "Xem các phiên bản gốc, tối ưu và sửa từ phản hồi đã lưu." };
  const filtered = saved.filter(item => (mode !== "favorites" || item.favorite) && (domainId === "all" || item.domainId === domainId) && `${item.name} ${getDomain(item.domainId).label}`.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi"))).toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  async function copy(version: PromptVersion) {
    try { await navigator.clipboard.writeText(version.text); notify(`Đã sao chép prompt V${version.number}.`); }
    catch { notify("Chưa sao chép được. Mở prompt để chọn và sao chép thủ công."); }
  }
  function url(record: PromptRecord, extra = "") { return `/app/optimize?prompt=${encodeURIComponent(record.id)}${extra}`; }
  return <div className={`app-content ${styles.library}`}><PageHeading title={titles[mode]} description={descriptions[mode]} action={<Link href="/app/optimize" className="button button-primary"><Icon name="plus" />Tối ưu prompt mới</Link>} /><div className={styles.tools}><label><span className="sr-only">Tìm prompt đã lưu</span><Icon name="search" /><input className="input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm prompt đã lưu…" /></label><label><span className="sr-only">Lọc lĩnh vực</span><select className="select" value={domainId} onChange={event => setDomainId(event.target.value)}><option value="all">Tất cả lĩnh vực</option>{domains.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div><p className={styles.localNote}>{filtered.length} prompt · Lưu trong trình duyệt · Có dữ liệu mẫu ban đầu</p>
    {filtered.length === 0 ? <EmptyState title="Chưa có prompt phù hợp" description="Thử bộ lọc khác hoặc tối ưu rồi lưu một prompt của bạn." action={<Link href="/app/templates" className="button button-secondary">Khám phá mẫu</Link>} /> : mode === "history" ? <div className={`card ${styles.history}`}>{filtered.flatMap(record => record.versions.toReversed().map(version => <article key={`${record.id}-${version.id}`}><span className={styles.versionMark}>V{version.number}</span><div><Link href={url(record, `&version=${version.id}`)}><strong>{record.name}</strong></Link><p>{getDomain(record.domainId).label} · {versionLabels[version.kind]}{version.parentId ? ` · từ ${version.parentId.toUpperCase()}` : ""} · {version.score}/100 (mẫu)</p><span>{version.text.slice(0, 120)}{version.text.length > 120 ? "…" : ""}</span></div><Link href={url(record, `&version=${version.id}`)} className={styles.openVersion} aria-label={`Xem ${record.name}, V${version.number}`}><Icon name="arrow" /></Link></article>))}</div> : <div className={styles.grid}>{filtered.map(record => {
      const domain = getDomain(record.domainId);
      const current = record.versions.at(-1)!;
      return <article className={`card ${styles.promptCard}`} key={record.id}><div className={styles.cardTop}><span className={`template-symbol tone-${domain.tone}`}><Icon name={domain.icon} /></span><button type="button" className="icon-button" aria-label={record.favorite ? `Bỏ yêu thích ${record.name}` : `Yêu thích ${record.name}`} aria-pressed={record.favorite} onClick={() => toggleFavorite(record.id)}><Icon name="heart" /></button></div><span className={styles.domainLabel}>{domain.label}</span><h2><Link href={url(record)}>{record.name}</Link></h2><p>{domain.tasks.find(task => task.id === record.taskId)?.label}</p><div className={styles.metadata}><span>V{current.number} · {versionLabels[current.kind]}</span><span>{current.score}/100 · Mẫu</span></div><span className={styles.updated}>Cập nhật {new Date(record.updatedAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</span><div className={styles.actions}><Button variant="secondary" size="small" onClick={() => copy(current)}><Icon name="copy" />Sao chép</Button><Link href={url(record)} className="button button-secondary button-small"><Icon name="edit" />Chỉnh sửa</Link><Link href={url(record, "&mode=repair")} className="button button-secondary button-small"><Icon name="sparkle" />Sửa prompt</Link></div><details className={styles.versions}><summary>Xem {record.versions.length} phiên bản <Icon name="chevron" /></summary>{record.versions.map(version => <Link href={url(record, `&version=${version.id}`)} key={version.id}><span>V{version.number} · {versionLabels[version.kind]}</span><span>{version.score}/100</span></Link>)}</details></article>;
    })}</div>}
  </div>;
}
