import { TemplateBrowser } from "@/components/template-browser";
import { PageHeading } from "@/components/ui";
export default function TemplatesPage() { return <div className="app-content"><PageHeading title="Mẫu Prompt" description="Một điểm bắt đầu cho nhiều lĩnh vực. Chọn mẫu, bổ sung bối cảnh rồi tối ưu." /><TemplateBrowser /></div>; }
