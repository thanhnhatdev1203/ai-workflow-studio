"use client";
import { useState, type FormEvent } from "react";
import { usePrototype } from "@/components/prototype-provider";
import { Button, Icon, PageHeading } from "@/components/ui";
import type { BrandContext } from "@/lib/prompt-model";
export default function BrandPage() {
  const { brand, saveBrand, ready } = usePrototype();
  if (!ready) return <div className="app-content"><p role="status">Đang mở Brand Context…</p></div>;
  return <BrandEditor initial={brand} saveBrand={saveBrand} />;
}
function BrandEditor({ initial, saveBrand }: { initial: BrandContext; saveBrand: (value: BrandContext) => void }) {
  const [value, setValue] = useState(initial);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); saveBrand(value); }
  const fields = [["name", "Tên thương hiệu"], ["product", "Sản phẩm / Dịch vụ"], ["audience", "Đối tượng"], ["tone", "Giọng điệu"], ["keywords", "Từ khóa"], ["avoid", "Từ / Nội dung cần tránh"], ["cta", "Lời kêu gọi hành động"], ["examples", "Ví dụ về phong cách"]] as const;
  return <div className="app-content"><PageHeading title="Brand Context" description="Bối cảnh hỗ trợ Marketing, E-commerce, Affiliate, Sales và Social. Không bắt buộc cho Coding hay Giáo dục." /><div className="card run-panel"><span className="pill"><Icon name="store" />Bối cảnh tùy chọn</span><p className="run-panel-intro" style={{ marginTop: 15 }}>Lưu trong trình duyệt. Bạn chủ động chọn dùng bối cảnh này khi tối ưu prompt.</p><form onSubmit={submit}><div className="brand-form">{fields.map(([key, label]) => <div className="field" key={key}><label htmlFor={`brand-${key}`}>{label}</label><input id={`brand-${key}`} className="input" maxLength={1000} value={value[key]} onChange={event => setValue(current => ({ ...current, [key]: event.target.value }))} /></div>)}</div><div className="form-footer"><Button type="submit">Lưu Brand Context</Button></div></form></div></div>;
}
