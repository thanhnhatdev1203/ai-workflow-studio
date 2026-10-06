"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, Icon, PageHeading } from "@/components/ui";
import { usePrototype } from "@/components/prototype-provider";
import { domains, getDomain, getDynamicFields, getTemplate, promptTemplates, promptTypes, repairProblems, type PromptType } from "@/lib/prompt-catalog";
import { defaultAdvanced, mockOptimize, mockOutput, mockRepair, versionLabels, type AdvancedOptions, type PromptRecord, type PromptVersion } from "@/lib/prompt-model";
import styles from "./prompt-optimizer.module.css";

type Props = { templateId?: string; promptId?: string; mode?: string; versionId?: string };
function scrollToSection(section: HTMLElement | null) {
  section?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}
export function OptimizerEntry(props: Props) {
  const { saved, ready } = usePrototype();
  if (props.promptId && !ready) return <div className="app-content"><p role="status">Đang mở prompt trong trình duyệt…</p></div>;
  const record = saved.find(item => item.id === props.promptId);
  if (props.promptId && !record) return <div className="app-content"><PageHeading title="Chưa tìm thấy prompt" description="Prompt này không có trong thư viện của trình duyệt hiện tại." /><Link href="/app/prompts" className="button button-primary">Về Prompt của tôi</Link></div>;
  return <PromptOptimizer key={`${props.promptId ?? props.templateId ?? "new"}-${props.mode ?? ""}-${props.versionId ?? ""}`} {...props} record={record} />;
}

function PromptOptimizer({ templateId, mode, versionId, record }: Props & { record?: PromptRecord }) {
  const template = getTemplate(templateId);
  const { savePrompt, brand, notify } = usePrototype();
  const [domainId, setDomainId] = useState(record?.domainId ?? template?.domainId ?? "marketing");
  const [taskId, setTaskId] = useState(record?.taskId ?? template?.taskId ?? "facebook");
  const [type, setType] = useState<PromptType>(record?.type ?? template?.type ?? "text");
  const [input, setInput] = useState(record?.input ?? template?.prompt ?? "");
  const [context, setContext] = useState<Record<string, string>>(record?.context ?? template?.context ?? {});
  const [advanced, setAdvanced] = useState<AdvancedOptions>(record?.advanced ?? { ...defaultAdvanced });
  const [useBrand, setUseBrand] = useState(record?.brandUsed ?? false);
  const [versions, setVersions] = useState<PromptVersion[]>(record?.versions ?? []);
  const [selectedId, setSelectedId] = useState(versionId && record?.versions.some(item => item.id === versionId) ? versionId : record?.versions.at(-1)?.id ?? "");
  const [savedId, setSavedId] = useState(record?.id);
  const [name, setName] = useState(record?.name ?? template?.title ?? "Prompt của tôi");
  const [favorite, setFavorite] = useState(record?.favorite ?? false);
  const [dirty, setDirty] = useState(false);
  const [showRepair, setShowRepair] = useState(mode === "repair");
  const [repairOutput, setRepairOutput] = useState("");
  const [source, setSource] = useState<"external" | "runner">("external");
  const [problems, setProblems] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [diagnosed, setDiagnosed] = useState(false);
  const [notice, setNotice] = useState("");
  const resultRef = useRef<HTMLElement>(null);
  const repairRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const domain = getDomain(domainId);
  const fields = getDynamicFields(domainId, taskId, type);
  const selected = versions.find(item => item.id === selectedId);
  const before = versions.find(item => item.id === selected?.parentId) ?? versions[0];
  const canRun = type !== "image" && type !== "video";
  const canRepair = !!selected && !dirty && repairOutput.trim().length >= 10 && problems.length > 0 && (!problems.includes("other") || feedback.trim().length >= 5);

  useEffect(() => { if (showRepair) scrollToSection(repairRef.current); }, [showRepair]);
  function resetContext() {
    setContext({}); setVersions([]); setSelectedId(""); setSavedId(undefined); setShowRepair(false); setRepairOutput(""); setProblems([]); setDiagnosed(false); setUseBrand(false); setDirty(false); setNotice("");
  }
  function updateInput(value: string) { setInput(value); setDirty(versions.length > 0); setDiagnosed(false); }
  function updateContext(id: string, value: string) { setContext(current => ({ ...current, [id]: value })); setDirty(versions.length > 0); setDiagnosed(false); }
  function updateAdvanced<K extends keyof AdvancedOptions>(key: K, value: AdvancedOptions[K]) { setAdvanced(current => ({ ...current, [key]: value })); setDirty(versions.length > 0); setDiagnosed(false); }
  function fillExample() {
    resetContext();
    if (type === "image") { setInput("Viết prompt hình ảnh về một góc làm việc yên tĩnh bên cửa sổ."); setContext({ subject: "Bàn gỗ bên cửa sổ", style: "Ảnh chụp tự nhiên", composition: "Góc rộng, 16:9", lighting: "Nắng buổi sáng", avoid: "Chữ, logo, watermark" }); return; }
    if (type === "video") { setInput("Viết prompt video về một tách cà phê vào buổi sáng."); setContext({ scene: "Quán cà phê yên tĩnh", duration: "8 giây", camera: "Máy quay tiến chậm", action: "Hơi nước bốc lên", avoid: "Chữ và logo" }); return; }
    if (type === "data") { setInput("Phân tích doanh thu theo sản phẩm từ bảng dữ liệu được cung cấp."); setContext({ dataset: "Mẫu: sản phẩm A, số lượng 2, đơn giá 100000", question: "Tính doanh thu theo sản phẩm", metrics: "Số lượng × đơn giá", limits: "Chưa đủ dữ liệu để so sánh xu hướng" }); return; }
    const example = promptTemplates.find(item => item.domainId === (type === "coding" ? "coding" : domainId) && item.taskId === taskId) ?? promptTemplates.find(item => item.domainId === (type === "coding" ? "coding" : domainId))!;
    setInput(example.prompt); setContext({ ...example.context }); setName(domain.tasks.find(task => task.id === taskId)?.label ?? example.title);
  }
  function optimize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.trim().length < 8) { setNotice("Nhập yêu cầu có ít nhất 8 ký tự để thử tối ưu."); return; }
    const options = { ...advanced };
    options.cta = domain.brand && advanced.cta;
    if (useBrand && domain.brand) options.customContext = [advanced.customContext, `Brand Context: ${Object.values(brand).filter(Boolean).join("; ")}`].filter(Boolean).join("\n");
    const start = versions.length ? Math.max(...versions.map(item => item.number)) + 1 : 1;
    const original: PromptVersion = { id: `v${start}`, number: start, kind: "original", text: input.trim(), score: 42 };
    const optimized: PromptVersion = { id: `v${start + 1}`, number: start + 1, kind: "optimized", parentId: original.id, text: mockOptimize(input, domainId, taskId, type, context, options), score: 91 };
    setVersions(current => [...current, original, optimized]); setSelectedId(optimized.id); setDirty(false); setShowRepair(false); setRepairOutput(""); setProblems([]); setFeedback(""); setDiagnosed(false); setNotice("Đã tạo phiên bản tối ưu minh họa. Chưa chạy prompt.");
    window.requestAnimationFrame(() => scrollToSection(resultRef.current));
  }
  async function copy() {
    if (!selected) return;
    try { await navigator.clipboard.writeText(selected.text); notify(`Đã sao chép prompt V${selected.number}.`); }
    catch { setNotice("Chưa sao chép tự động được. Bạn có thể chọn văn bản prompt để sao chép."); }
  }
  function run() {
    if (!selected || !canRun || dirty) return;
    const output = mockOutput(domainId, taskId, type);
    setVersions(current => current.map(item => item.id === selected.id ? { ...item, output } : item));
    setNotice(`Đã hiển thị output mẫu cho V${selected.number}; không gọi AI, không trừ credit.`);
  }
  function startRepair(fromRun = false) {
    if (fromRun && selected?.output) { setSource("runner"); setRepairOutput(selected.output); }
    else { setSource("external"); setRepairOutput(""); }
    setProblems([]); setFeedback(""); setDiagnosed(false); setShowRepair(true);
  }
  function repair() {
    if (!canRepair || !selected || !diagnosed) return;
    const number = Math.max(...versions.map(item => item.number)) + 1;
    const repaired = mockRepair(selected, repairOutput, problems, feedback, source, number);
    setVersions(current => [...current, repaired]); setSelectedId(repaired.id); setShowRepair(false); setDiagnosed(false); setRepairOutput(""); setProblems([]); setFeedback(""); setNotice(`Đã tạo V${number} từ V${selected.number}. Sao chép hoặc chủ động chạy thử phiên bản mới.`);
    window.requestAnimationFrame(() => scrollToSection(resultRef.current));
  }
  function save() {
    if (!versions.length || dirty || !name.trim()) return;
    const id = savedId ?? crypto.randomUUID();
    savePrompt({ id, name: name.trim(), domainId, taskId, type, input, context, advanced, brandUsed: useBrand && domain.brand, versions, favorite, updatedAt: new Date().toISOString() }); setSavedId(id);
  }
  const criteria = [
    ["Mục tiêu", !!input.trim(), "Nêu kết quả bạn muốn nhận."],
    ["Bối cảnh", fields.some(item => context[item.id]?.trim()), "Thêm thông tin liên quan công việc."],
    ["Đối tượng", !!(advanced.audience || context.audience || context.buyer || context.grade), "Nêu người đọc, người dùng hoặc trình độ."],
    ["Định dạng đầu ra", !!advanced.format, "Ví dụ: checklist, bảng hoặc code kèm giải thích."],
    ["Giọng điệu", !!advanced.tone, "Chọn cách thể hiện phù hợp."],
    ["Ràng buộc", !!(advanced.constraints || context.constraints || context.limits), "Nêu giới hạn cần tuân thủ."],
    ["Tiêu chí thành công", !!(context.expected || context.objective || context.goal || context.question), "Nêu cách nhận biết kết quả đúng yêu cầu."],
  ] as const;

  return <div className={`app-content ${styles.workspace}`}>
    <PageHeading title="Tối ưu Prompt" description="Làm rõ yêu cầu. Sao chép prompt. Cải thiện sau mỗi kết quả." action={<span className="pill"><Icon name="sparkle" /> UI / Mock</span>} />
    <div className={styles.intro}><span className={styles.introIcon}><Icon name="sparkle" /></span><div><strong>Một prompt tốt hơn. Một vòng sửa rõ ràng hơn.</strong><p>Dùng ở AI bạn quen thuộc. Khi kết quả chưa đúng ý, mang output trở lại để sửa prompt.</p></div><Link href="/app/templates">Khám phá mẫu <Icon name="right" /></Link></div>
    <div className={styles.inputLayout}>
      <section className={`card ${styles.inputCard}`} aria-labelledby="input-heading">
        <form ref={formRef} onSubmit={optimize}>
          <div className={styles.panelTitle}><h2 id="input-heading">Bắt đầu với prompt của bạn</h2><button type="button" className={styles.exampleButton} onClick={fillExample}><Icon name="light" />Dùng ví dụ</button></div>
          <div className="field"><label htmlFor="main-prompt">Prompt chính</label><textarea id="main-prompt" className={`textarea ${styles.mainPrompt}`} value={input} maxLength={12000} required minLength={8} placeholder="Nhập yêu cầu bạn muốn AI hiểu rõ hơn…" onChange={event => updateInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); formRef.current?.requestSubmit(); } }} /><div className={styles.inputHint}><span>⌘ / Ctrl + Enter để tối ưu</span><span>{input.length.toLocaleString("vi")} / 12.000</span></div></div>
          <div className={styles.selectorGrid}>
            <div className="field"><label htmlFor="prompt-type">Loại prompt</label><select id="prompt-type" className="select" value={type} onChange={event => { setType(event.target.value as PromptType); resetContext(); }}>{promptTypes.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className="field"><label htmlFor="prompt-domain">Lĩnh vực</label><select id="prompt-domain" className="select" value={domainId} onChange={event => { const next = getDomain(event.target.value); setDomainId(next.id); setTaskId(next.tasks[0].id); if (next.id === "coding") setType("coding"); else if (type === "coding") setType("text"); resetContext(); }}>{domains.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className={`field ${styles.taskField}`}><label htmlFor="prompt-task">Mục đích cụ thể</label><select id="prompt-task" className="select" value={taskId} onChange={event => { setTaskId(event.target.value); setDirty(versions.length > 0); setDiagnosed(false); }}>{domain.tasks.map(task => <option key={task.id} value={task.id}>{task.label}</option>)}</select></div>
          </div>
          {!canRun && <p className={styles.typeNote}><Icon name="light" />Loại {type === "image" ? "hình ảnh" : "video"} chỉ tối ưu văn bản prompt. Không tạo ảnh/video.</p>}
          {domainId === "seo" && <p className={styles.typeNote}>Chỉ tối ưu prompt SEO; không tìm kiếm web hoặc thu thập dữ liệu.</p>}
          <details className={styles.options} key={`${domainId}-${type}`}><summary><span><Icon name={domain.icon} />Thông tin cho {domain.tasks.find(item => item.id === taskId)?.label}</span><span>Tùy chọn <Icon name="chevron" /></span></summary><div className={styles.dynamicGrid}>{fields.map(item => <div className={`field ${item.multiline ? styles.fullField : ""}`} key={item.id}><label htmlFor={`context-${item.id}`}>{item.label}</label>{item.options ? <select id={`context-${item.id}`} className="select" value={context[item.id] ?? ""} onChange={event => updateContext(item.id, event.target.value)}><option value="">{item.placeholder}</option>{item.options.map(option => <option key={option}>{option}</option>)}</select> : item.multiline ? <textarea id={`context-${item.id}`} className="textarea" maxLength={12000} placeholder={item.placeholder} value={context[item.id] ?? ""} onChange={event => updateContext(item.id, event.target.value)} /> : <input id={`context-${item.id}`} className="input" maxLength={1000} placeholder={item.placeholder} value={context[item.id] ?? ""} onChange={event => updateContext(item.id, event.target.value)} />}</div>)}</div></details>
          <details className={styles.options}><summary><span><Icon name="settings" />Tùy chỉnh nâng cao</span><Icon name="chevron" /></summary><div className={styles.dynamicGrid}>
            {([["language", "Ngôn ngữ đầu ra", ["Tiếng Việt", "English", "Theo prompt gốc"]], ["tone", "Giọng điệu", ["Rõ ràng, tự nhiên", "Chuyên nghiệp", "Thân thiện", "Học thuật"]], ["length", "Độ dài", ["Vừa đủ", "Ngắn gọn", "Chi tiết"]], ["detail", "Mức chi tiết", ["Vừa đủ", "Cơ bản", "Chuyên sâu"]]] as const).map(([key, label, options]) => <div className="field" key={key}><label htmlFor={`advanced-${key}`}>{label}</label><select id={`advanced-${key}`} className="select" value={advanced[key]} onChange={event => updateAdvanced(key, event.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></div>)}
            {([["audience", "Đối tượng / Người nhận"], ["format", "Định dạng đầu ra"], ["style", "Phong cách thể hiện"], ["constraints", "Ràng buộc"], ["avoid", "Điều cần tránh"]] as const).map(([key, label]) => <div className="field" key={key}><label htmlFor={`advanced-${key}`}>{label}</label><input id={`advanced-${key}`} className="input" maxLength={1000} value={advanced[key]} onChange={event => updateAdvanced(key, event.target.value)} placeholder={key === "format" ? "Bảng, checklist, Markdown…" : label} /></div>)}
            <div className={`field ${styles.fullField}`}><label htmlFor="advanced-context">Bối cảnh bổ sung</label><textarea id="advanced-context" className="textarea" maxLength={4000} value={advanced.customContext} onChange={event => updateAdvanced("customContext", event.target.value)} /></div>
            <label className={styles.checkOption}><input type="checkbox" checked={advanced.examples} onChange={event => updateAdvanced("examples", event.target.checked)} />Kèm ví dụ</label>{domain.brand && <label className={styles.checkOption}><input type="checkbox" checked={advanced.cta} onChange={event => updateAdvanced("cta", event.target.checked)} />Có lời kêu gọi hành động</label>}
          </div></details>
          {domain.brand && <label className={styles.brandOption}><input type="checkbox" checked={useBrand} onChange={event => { setUseBrand(event.target.checked); setDirty(versions.length > 0); }} /><span>Dùng Brand Context: <strong>{brand.name || "Chưa đặt tên"}</strong></span><Link href="/app/brand" aria-label="Chỉnh Brand Context"><Icon name="arrow" /></Link></label>}
          <div className={styles.optimizeFooter}><Button type="submit" disabled={input.trim().length < 8}><Icon name="sparkle" />Phân tích & tối ưu<Icon name="right" /></Button><span>Tạo prompt mẫu · Không tự chạy</span></div>
        </form>
      </section>
      <aside className={styles.diagnosisAside}>
        <div className={`card ${styles.diagnosisCard}`}><span className={styles.eyebrow}>PROMPT DIAGNOSIS</span><h2>Yêu cầu đã rõ đến đâu?</h2><div className={styles.scoreSummary}><span>{selected ? selected.score : "—"}<small>/ 100</small></span><div><strong>{selected ? `V${selected.number} · ${versionLabels[selected.kind]}` : "Chưa phân tích"}</strong><p>{selected ? "Điểm minh họa, không phải thuật toán đã chốt." : "Nhập prompt để xem các tiêu chí cần làm rõ."}</p></div></div>
          {selected && <div className={styles.scoreBreakdown}><div><span>Tiêu chí chung</span><strong>{Math.round(selected.score * .6)} / 60</strong></div><div><span>Theo lĩnh vực</span><strong>{selected.score - Math.round(selected.score * .6)} / 40</strong></div></div>}
          <details className={styles.diagnosisDetails} open={!!selected}><summary>Tiêu chí chung <Icon name="chevron" /></summary><ul>{criteria.map(([label, present, hint]) => <li key={label}><Icon name={present ? "check" : "plus"} /><div><strong>{label}</strong><span>{present ? "Đã có thông tin đầu vào" : hint}</span></div></li>)}</ul></details>
          <details className={styles.diagnosisDetails}><summary>Theo ngữ cảnh {domain.label} <Icon name="chevron" /></summary><ul>{fields.map(item => <li key={item.id}><Icon name={context[item.id]?.trim() ? "check" : "plus"} /><div><strong>{item.label}</strong><span>{context[item.id]?.trim() ? "Đã bổ sung" : "Cần làm rõ nếu có liên quan"}</span></div></li>)}</ul></details>
          {selected && <p className={styles.diagnosisNote}>Mock tổng hợp tiêu chí chung và thông tin lĩnh vực. Các ô chưa điền vẫn được chỉ ra, kể cả khi điểm mẫu là 91.</p>}
        </div><div className={styles.repairTeaser}><Icon name="layers" /><strong>Kết quả chưa đúng ý?</strong><p>Output từ AI bên ngoài cũng dùng được. Sửa prompt dựa trên vấn đề cụ thể, giữ lại phiên bản trước để so sánh.</p></div>
      </aside>
    </div>
    {dirty && <p className={styles.dirtyNotice} role="status">Đầu vào đã thay đổi. Tối ưu lại để tạo phiên bản mới trước khi sao chép, chạy thử hoặc lưu.</p>}
    {selected && <section className={`card ${styles.results}`} ref={resultRef} aria-labelledby="results-heading">
      <div className={styles.resultHeading}><div><span className={styles.eyebrow}>PROMPT VERSION</span><h2 id="results-heading">Prompt của bạn, rõ hơn từng phiên bản.</h2></div><span className="pill saved-tag">{before?.score ?? 42} → {selected.score} · Điểm mẫu</span></div>
      <div className={styles.versionList} aria-label="Chọn phiên bản prompt">{versions.map(item => <button type="button" key={item.id} aria-pressed={selected.id === item.id} onClick={() => { setSelectedId(item.id); setShowRepair(false); setDiagnosed(false); setRepairOutput(""); setNotice(""); }}><span>V{item.number}</span>{versionLabels[item.kind]}{item.parentId && <small>từ {item.parentId.toUpperCase()}</small>}</button>)}</div>
      <div className={styles.comparison}><article><div><h3>{selected.kind === "original" ? "Prompt gốc" : `Trước · ${before?.id.toUpperCase()}`}</h3><span>{before?.score ?? 42}/100</span></div><pre>{before?.text ?? input}</pre></article><article className={styles.after}><div><h3>Hiện tại · V{selected.number}</h3><span>{selected.score}/100</span></div><pre>{selected.text}</pre></article></div>
      <div className={styles.highlights}>{(selected.kind === "repaired" ? ["Đã thêm chỉ dẫn sửa lỗi", "Giữ output tham chiếu", "Tạo phiên bản mới"] : ["Đối tượng", "Bối cảnh", "Định dạng đầu ra", "Ràng buộc", "Thông tin lĩnh vực"]).map(item => <span key={item}><Icon name="check" />{item}</span>)}</div>
      <div className={styles.resultActions}><Button onClick={copy} disabled={dirty}><Icon name="copy" />Sao chép prompt</Button><Button variant="secondary" onClick={run} disabled={!canRun || dirty}><Icon name="play" />Chạy thử</Button><button className={styles.repairButton} type="button" onClick={() => startRepair()} disabled={dirty}><Icon name="edit" />Sửa prompt từ output</button></div>
      <p className={styles.runnerNote}>{canRun ? "Chạy thử là tùy chọn. Khi tích hợp sẽ dùng Generate credit; bản mock không trừ lượt." : "Prompt ảnh/video chỉ được sao chép để dùng bên ngoài; không có tạo ảnh/video trong phiên bản này."}</p>
      {selected.output && <div className={styles.runOutput}><div><strong>Output mẫu · V{selected.number}</strong><span>Không phải kết quả AI thực tế</span></div><pre>{selected.output}</pre><Button variant="secondary" onClick={() => startRepair(true)} disabled={dirty}><Icon name="edit" />Dùng output này để sửa prompt</Button></div>}
      <div className={styles.saveBar}><div className="field"><label htmlFor="prompt-name">Tên prompt</label><input id="prompt-name" className="input" maxLength={120} required value={name} onChange={event => setName(event.target.value)} /></div><button type="button" className="icon-button" aria-label={favorite ? "Bỏ yêu thích" : "Đánh dấu yêu thích"} aria-pressed={favorite} onClick={() => setFavorite(!favorite)}><Icon name="heart" /></button><Button variant="secondary" onClick={save} disabled={dirty || !name.trim()}><Icon name="layers" />{savedId ? "Lưu phiên bản" : "Lưu prompt"}</Button>{savedId && <Link href="/app/prompts" className={styles.savedLink}>Prompt của tôi <Icon name="right" /></Link>}</div>
    </section>}
    {selected && showRepair && <section ref={repairRef} className={`card ${styles.repairPanel}`} aria-labelledby="repair-heading"><div className={styles.resultHeading}><div><span className={styles.eyebrow}>PROMPT REPAIR LOOP</span><h2 id="repair-heading">Sửa nguyên nhân, tạo phiên bản mới.</h2><p>Đang sửa từ V{selected.number}. Phiên bản trước được giữ nguyên.</p></div><button type="button" className="icon-button" aria-label="Đóng phần sửa prompt" onClick={() => setShowRepair(false)}><Icon name="close" /></button></div>
      <details className={styles.currentPrompt}><summary>Prompt hiện tại · V{selected.number}<Icon name="chevron" /></summary><pre>{selected.text}</pre></details>
      <div className={styles.outputSource} aria-label="Nguồn output"><button type="button" aria-pressed={source === "external"} onClick={() => { setSource("external"); setRepairOutput(""); setDiagnosed(false); }}>Dán từ AI bên ngoài</button><button type="button" aria-pressed={source === "runner"} disabled={!selected.output} onClick={() => { setSource("runner"); setRepairOutput(selected.output ?? ""); setDiagnosed(false); }}>Output chạy thử V{selected.number}</button></div>
      <div className="field"><label htmlFor="repair-output">Kết quả AI đã trả về</label><textarea id="repair-output" className="textarea" value={repairOutput} maxLength={20000} minLength={10} placeholder="Dán output từ ChatGPT, Gemini, Claude hoặc AI bạn đang dùng…" onChange={event => { setRepairOutput(event.target.value); setDiagnosed(false); }} /><span className="field-help">Output được giữ ở trình duyệt; không gửi đến dịch vụ bên ngoài.</span></div>
      <fieldset className={styles.problemPicker}><legend>Kết quả đang gặp vấn đề gì?</legend><div>{repairProblems.map(problem => <button key={problem.id} type="button" aria-pressed={problems.includes(problem.id)} onClick={() => { setProblems(current => current.includes(problem.id) ? current.filter(id => id !== problem.id) : [...current, problem.id]); setDiagnosed(false); }}><Icon name={problems.includes(problem.id) ? "check" : "plus"} />{problem.label}</button>)}</div></fieldset>
      <div className="field"><label htmlFor="repair-feedback">{problems.includes("other") ? "Mô tả vấn đề khác (bắt buộc)" : "Bạn muốn kết quả mới thay đổi thế nào? (tùy chọn)"}</label><textarea id="repair-feedback" className="textarea" value={feedback} maxLength={4000} required={problems.includes("other")} placeholder="Ví dụ: Dùng bảng 3 cột, nêu các bước và bỏ phần mở đầu…" onChange={event => { setFeedback(event.target.value); setDiagnosed(false); }} /></div>
      {!diagnosed ? <Button variant="secondary" disabled={!canRepair} onClick={() => setDiagnosed(true)}><Icon name="search" />Chẩn đoán vấn đề</Button> : <div className={styles.failureDiagnosis}><strong>Chẩn đoán minh họa</strong><p>Prompt cần làm rõ các chỉ dẫn sau để giải quyết phản hồi:</p><ul>{repairProblems.filter(problem => problems.includes(problem.id)).map(problem => <li key={problem.id}>{problem.instruction}</li>)}</ul>{feedback.trim() && <p>Phản hồi của bạn: {feedback.trim()}</p>}<Button onClick={repair} disabled={!canRepair}><Icon name="sparkle" />Sửa prompt & tạo V{Math.max(...versions.map(item => item.number)) + 1}<Icon name="right" /></Button></div>}
    </section>}
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    <p className={styles.prototypeNote}>Prototype UI: diagnosis, score, tối ưu, chạy thử và repair đều là minh họa. Không gọi AI hoặc backend.</p>
  </div>;
}
