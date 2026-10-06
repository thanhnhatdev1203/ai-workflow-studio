"use client";

import { useState } from "react";
import Link from "next/link";
import { domains, getDomain, promptTemplates, promptTypes } from "@/lib/prompt-catalog";
import { EmptyState, Icon } from "@/components/ui";
import styles from "./prompt-library.module.css";

export function TemplateBrowser() {
  const [domainId, setDomainId] = useState("all");
  const [search, setSearch] = useState("");
  const results = promptTemplates.filter(item => (domainId === "all" || item.domainId === domainId) && `${item.title} ${item.description} ${getDomain(item.domainId).label}`.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")));
  return <><div className={styles.tools}><label><Icon name="search" /><span className="sr-only">Tìm mẫu prompt</span><input className="input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm mẫu prompt, lĩnh vực…" /></label><label><span className="sr-only">Danh mục mẫu prompt</span><select className="select" value={domainId} onChange={event => setDomainId(event.target.value)}><option value="all">Tất cả lĩnh vực</option>{domains.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div><div className="category-tabs" aria-label="Lọc nhanh lĩnh vực">{domains.slice(0, 6).map(item => <button key={item.id} className={`category-tab ${domainId === item.id ? "active" : ""}`} aria-pressed={domainId === item.id} onClick={() => setDomainId(domainId === item.id ? "all" : item.id)}>{item.label}</button>)}</div><p className={styles.localNote}>{results.length} mẫu · {domains.length} lĩnh vực · Chọn mẫu để chỉnh và tối ưu prompt</p><div className="workflow-grid">{results.map(template => { const domain = getDomain(template.domainId); return <Link className="card workflow-card" href={`/app/optimize?template=${template.id}`} key={template.id}><span className={`template-symbol tone-${domain.tone}`}><Icon name={domain.icon} /></span><h3>{template.title}</h3><p>{template.description}</p><div className="workflow-footer"><span className="workflow-meta">{domain.label} · {promptTypes.find(type => type.id === template.type)?.label}</span><Icon name="arrow" /></div></Link>; })}</div>{results.length === 0 && <EmptyState title="Chưa tìm thấy mẫu" description="Thử từ khóa khác hoặc chọn tất cả lĩnh vực." />}</>;
}
