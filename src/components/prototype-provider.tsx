"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { domains, promptTypes } from "@/lib/prompt-catalog";
import { defaultAdvanced, defaultBrand, seedPrompts, type BrandContext, type PromptRecord, type PromptVersion } from "@/lib/prompt-model";

type Payload = { schema: 1; prompts: PromptRecord[]; brand: BrandContext };
type PrototypeContextValue = { saved: PromptRecord[]; brand: BrandContext; ready: boolean; savePrompt: (prompt: PromptRecord) => void; toggleFavorite: (id: string) => void; saveBrand: (brand: BrandContext) => void; notify: (message: string) => void };
const PrototypeContext = createContext<PrototypeContextValue | null>(null);
const storageKey = "studioflow-prompts-v1";
const savedEvent = "studioflow-prompts-change";
const defaults: Payload = { schema: 1, prompts: seedPrompts, brand: defaultBrand };
const serverSnapshot = JSON.stringify(defaults);
let memorySnapshot = serverSnapshot;
let sessionOnly = false;
function object(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function strings(value: unknown): value is Record<string, string> { return object(value) && Object.values(value).every(item => typeof item === "string"); }
function validVersion(value: unknown): value is PromptVersion {
  if (!object(value)) return false;
  const repair = value.repair;
  const validRepair = repair === undefined || (object(repair) && typeof repair.output === "string" && typeof repair.feedback === "string" && Array.isArray(repair.problems) && repair.problems.every(item => typeof item === "string") && ["external", "runner"].includes(String(repair.source)));
  return typeof value.id === "string" && typeof value.text === "string" && Number.isInteger(value.number) && Number(value.number) > 0 && typeof value.score === "number" && value.score >= 0 && value.score <= 100 && ["original", "optimized", "repaired", "edited"].includes(String(value.kind)) && (value.output === undefined || typeof value.output === "string") && (value.parentId === undefined || typeof value.parentId === "string") && validRepair;
}
function validPrompt(value: unknown): value is PromptRecord {
  if (!object(value)) return false;
  const domain = domains.find(item => item.id === value.domainId);
  return typeof value.id === "string" && typeof value.name === "string" && typeof value.input === "string" && typeof value.updatedAt === "string" && Number.isFinite(Date.parse(value.updatedAt)) && typeof value.favorite === "boolean" && (value.brandUsed === undefined || typeof value.brandUsed === "boolean") && !!domain?.tasks.some(task => task.id === value.taskId) && promptTypes.some(type => type.id === value.type) && strings(value.context) && object(value.advanced) && Object.entries(defaultAdvanced).every(([key, entry]) => typeof value.advanced === "object" && value.advanced !== null && typeof (value.advanced as Record<string, unknown>)[key] === typeof entry) && Array.isArray(value.versions) && value.versions.length > 0 && value.versions.every(validVersion) && new Set(value.versions.map(item => item.id)).size === value.versions.length;
}
function decode(snapshot: string): Payload {
  try {
    const value: unknown = JSON.parse(snapshot);
    if (object(value) && value.schema === 1 && Array.isArray(value.prompts) && value.prompts.every(validPrompt) && strings(value.brand) && Object.keys(defaultBrand).every(key => typeof value.brand === "object" && value.brand !== null && typeof (value.brand as Record<string, unknown>)[key] === "string")) return value as Payload;
  } catch { /* Corrupt local data falls back to the sample library. */ }
  return defaults;
}
function subscribe(callback: () => void) {
  window.addEventListener(savedEvent, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(savedEvent, callback); window.removeEventListener("storage", callback); };
}
function snapshot() {
  if (sessionOnly) return memorySnapshot;
  try { return window.localStorage.getItem(storageKey) ?? memorySnapshot; }
  catch { sessionOnly = true; return memorySnapshot; }
}
function write(value: Payload) {
  memorySnapshot = JSON.stringify(value);
  try { window.localStorage.setItem(storageKey, memorySnapshot); sessionOnly = false; }
  catch { sessionOnly = true; }
  window.dispatchEvent(new Event(savedEvent));
  return !sessionOnly;
}
const subscribeReady = () => () => {};

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => serverSnapshot);
  const ready = useSyncExternalStore(subscribeReady, () => true, () => false);
  const value = useMemo(() => decode(raw), [raw]);
  const [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const savePrompt = useCallback((prompt: PromptRecord) => {
    const current = decode(snapshot());
    const exists = current.prompts.some(item => item.id === prompt.id);
    const prompts = exists ? current.prompts.map(item => item.id === prompt.id ? prompt : item) : [prompt, ...current.prompts];
    setToast(write({ ...current, prompts }) ? "Đã lưu prompt và các phiên bản trong trình duyệt." : "Trình duyệt chặn lưu trữ. Prompt chỉ được giữ trong phiên hiện tại.");
  }, []);
  const toggleFavorite = useCallback((id: string) => {
    const current = decode(snapshot());
    const prompts = current.prompts.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item);
    const persisted = write({ ...current, prompts });
    setToast(persisted ? "Đã cập nhật yêu thích." : "Yêu thích chỉ được giữ trong phiên hiện tại.");
  }, []);
  const saveBrand = useCallback((brand: BrandContext) => {
    setToast(write({ ...decode(snapshot()), brand }) ? "Đã lưu Brand Context trong trình duyệt." : "Brand Context chỉ được giữ trong phiên hiện tại.");
  }, []);
  const context = useMemo(() => ({ saved: value.prompts, brand: value.brand, ready, savePrompt, toggleFavorite, saveBrand, notify: setToast }), [value, ready, savePrompt, toggleFavorite, saveBrand]);
  return <PrototypeContext.Provider value={context}>{children}{toast ? <div className="toast" role="status">{toast}</div> : null}</PrototypeContext.Provider>;
}
export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context) throw new Error("usePrototype phải dùng bên trong PrototypeProvider.");
  return context;
}
