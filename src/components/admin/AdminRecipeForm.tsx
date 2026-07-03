"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AdminError } from "@/components/admin/AdminPageState";
import {
  createAdminRecipe,
  getAdminRecipe,
  updateAdminRecipe,
} from "@/lib/api/admin";
import type {
  AdminRecipeIngredientInput,
  AdminRecipeStepInput,
  AdminRecipeWriteInput,
} from "@/lib/types/admin";

const categories = [
  ["mon-xao", "Món xào"],
  ["mon-canh", "Món canh"],
  ["mon-chien", "Món chiên"],
  ["mon-hap", "Món hấp"],
  ["mon-chay", "Món chay"],
  ["trang-mieng", "Tráng miệng"],
] as const;

const emptyIngredient = (): AdminRecipeIngredientInput => ({
  amount: 1,
  name: "",
  prepNote: "",
  unit: "",
});

const emptyStep = (): AdminRecipeStepInput => ({
  content: "",
  estimatedMinutes: 0,
  isTricky: false,
  techniqueIcon: "noi",
  timerSeconds: null,
});

const initialForm = (): AdminRecipeWriteInput => ({
  baseServings: 2,
  categorySlug: "mon-xao",
  cookTimeMinutes: 20,
  description: "",
  difficulty: "de",
  image: "/images/recipes/",
  imageAlt: "",
  ingredients: [emptyIngredient()],
  slug: "",
  status: "DRAFT",
  steps: [emptyStep()],
  title: "",
});

export function AdminRecipeForm({ recipeId }: { recipeId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<AdminRecipeWriteInput>(initialForm);
  const [loading, setLoading] = useState(Boolean(recipeId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) {
      return;
    }

    let cancelled = false;
    void getAdminRecipe(recipeId)
      .then((recipe) => {
        if (cancelled) return;
        setForm({
          baseServings: recipe.baseServings,
          categorySlug: recipe.category.slug,
          cookTimeMinutes: recipe.cookTimeMinutes,
          description: recipe.description,
          difficulty: recipe.difficulty,
          image: recipe.image,
          imageAlt: recipe.imageAlt,
          ingredients: recipe.ingredients.map(({ amount, name, prepNote, unit }) => ({
            amount,
            name,
            prepNote,
            unit,
          })),
          slug: recipe.slug,
          status: recipe.status,
          steps: recipe.steps.map((step) => ({
            content: step.content,
            estimatedMinutes: step.estimatedMinutes,
            isTricky: step.isTricky,
            techniqueIcon: step.techniqueIcon,
            timerSeconds: step.timerSeconds,
          })),
          title: recipe.title,
        });
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (recipeId) {
        await updateAdminRecipe(recipeId, form);
      } else {
        await createAdminRecipe(form);
      }
      router.push("/admin/cong-thuc");
      router.refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-charcoal/55">Đang tải công thức...</div>;
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            {recipeId ? "Chỉnh sửa công thức" : "Thêm công thức"}
          </h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Các trường nguyên liệu và bước nấu được lưu theo đúng thứ tự hiển thị.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/cong-thuc"
            className="rounded-xl border border-terracotta/25 bg-white px-5 py-3 font-semibold"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-terracotta px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu công thức"}
          </button>
        </div>
      </div>

      {error ? <AdminError message={error} /> : null}

      <FormSection title="Thông tin cơ bản">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Tên công thức" value={form.title} minLength={5}
            onChange={(title) => setForm({ ...form, title })} />
          <TextField label="Slug" value={form.slug} pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            onChange={(slug) => setForm({ ...form, slug })} />
          <label className="md:col-span-2">
            <FieldLabel>Mô tả</FieldLabel>
            <textarea required minLength={10} maxLength={1000} rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className={fieldClass} />
          </label>
          <TextField label="Đường dẫn ảnh" value={form.image}
            onChange={(image) => setForm({ ...form, image })} />
          <TextField label="Mô tả ảnh" value={form.imageAlt} minLength={5}
            onChange={(imageAlt) => setForm({ ...form, imageAlt })} />
          <SelectField label="Danh mục" value={form.categorySlug}
            onChange={(categorySlug) => setForm({ ...form, categorySlug })}
            options={categories} />
          <SelectField label="Độ khó" value={form.difficulty}
            onChange={(difficulty) => setForm({ ...form, difficulty: difficulty as AdminRecipeWriteInput["difficulty"] })}
            options={[["de", "Dễ"], ["trung-binh", "Trung bình"], ["kho", "Khó"]]} />
          <NumberField label="Thời gian (phút)" value={form.cookTimeMinutes} min={1}
            onChange={(cookTimeMinutes) => setForm({ ...form, cookTimeMinutes })} />
          <NumberField label="Khẩu phần" value={form.baseServings} min={1}
            onChange={(baseServings) => setForm({ ...form, baseServings })} />
          <SelectField label="Trạng thái" value={form.status}
            onChange={(status) => setForm({ ...form, status: status as AdminRecipeWriteInput["status"] })}
            options={[["DRAFT", "Bản nháp"], ["PUBLISHED", "Xuất bản"], ["HIDDEN", "Ẩn"]]} />
        </div>
      </FormSection>

      <FormSection
        title="Nguyên liệu"
        actionLabel="Thêm nguyên liệu"
        onAction={() => setForm({ ...form, ingredients: [...form.ingredients, emptyIngredient()] })}
      >
        <div className="space-y-3">
          {form.ingredients.map((ingredient, index) => (
            <div key={index} className="grid gap-3 rounded-2xl bg-charcoal/[0.03] p-4 md:grid-cols-[2fr_1fr_1fr_2fr_auto]">
              <TextField label="Tên" value={ingredient.name}
                onChange={(value) => updateIngredient(index, { name: value })} />
              <NumberField label="Lượng" value={ingredient.amount} min={0.01} step="any"
                onChange={(value) => updateIngredient(index, { amount: value })} />
              <TextField label="Đơn vị" value={ingredient.unit}
                onChange={(value) => updateIngredient(index, { unit: value })} />
              <TextField label="Sơ chế" value={ingredient.prepNote} required={false}
                onChange={(value) => updateIngredient(index, { prepNote: value })} />
              <RemoveButton disabled={form.ingredients.length === 1}
                onClick={() => setForm({ ...form, ingredients: form.ingredients.filter((_, itemIndex) => itemIndex !== index) })} />
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Các bước nấu"
        actionLabel="Thêm bước"
        onAction={() => setForm({ ...form, steps: [...form.steps, emptyStep()] })}
      >
        <div className="space-y-3">
          {form.steps.map((step, index) => (
            <div key={index} className="rounded-2xl bg-charcoal/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">Bước {index + 1}</p>
                <RemoveButton disabled={form.steps.length === 1}
                  onClick={() => setForm({ ...form, steps: form.steps.filter((_, itemIndex) => itemIndex !== index) })} />
              </div>
              <textarea required minLength={10} maxLength={600} rows={3}
                aria-label={`Nội dung bước ${index + 1}`}
                value={step.content}
                onChange={(event) => updateStep(index, { content: event.target.value })}
                className={fieldClass} />
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <NumberField label="Số phút" value={step.estimatedMinutes} min={0}
                  onChange={(value) => updateStep(index, { estimatedMinutes: value })} />
                <SelectField label="Kỹ thuật" value={step.techniqueIcon}
                  onChange={(value) => updateStep(index, { techniqueIcon: value as AdminRecipeStepInput["techniqueIcon"] })}
                  options={[["dao", "Dao"], ["chao", "Chảo"], ["noi", "Nồi"], ["tron", "Trộn"], ["hap", "Hấp"]]} />
                <NumberField label="Hẹn giờ (giây)" value={step.timerSeconds ?? 0} min={0}
                  onChange={(value) => updateStep(index, { timerSeconds: value > 0 ? value : null })} />
                <label className="flex items-end gap-2 pb-3 text-sm font-medium">
                  <input type="checkbox" checked={step.isTricky}
                    onChange={(event) => updateStep(index, { isTricky: event.target.checked })}
                    className="size-4 accent-terracotta" />
                  Bước cần lưu ý
                </label>
              </div>
            </div>
          ))}
        </div>
      </FormSection>
    </form>
  );

  function updateIngredient(index: number, patch: Partial<AdminRecipeIngredientInput>) {
    setForm({
      ...form,
      ingredients: form.ingredients.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item),
    });
  }

  function updateStep(index: number, patch: Partial<AdminRecipeStepInput>) {
    setForm({
      ...form,
      steps: form.steps.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item),
    });
  }
}

const fieldClass =
  "mt-1 w-full rounded-xl border border-terracotta/20 bg-white px-3 py-2.5 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/10";

function FormSection({ actionLabel, children, onAction, title }: {
  actionLabel?: string;
  children: React.ReactNode;
  onAction?: () => void;
  title: string;
}) {
  return (
    <section className="rounded-3xl border border-terracotta/15 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">{title}</h3>
        {onAction ? (
          <button type="button" onClick={onAction}
            className="rounded-lg bg-sage/15 px-3 py-2 text-sm font-semibold text-charcoal">
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-charcoal/70">{children}</span>;
}

function TextField({ label, onChange, required = true, value, ...props }: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
  minLength?: number;
  pattern?: string;
}) {
  return (
    <label>
      <FieldLabel>{label}</FieldLabel>
      <input {...props} required={required} value={value}
        onChange={(event) => onChange(event.target.value)} className={fieldClass} />
    </label>
  );
}

function NumberField({ label, min, onChange, step, value }: {
  label: string;
  min: number;
  onChange: (value: number) => void;
  step?: string;
  value: number;
}) {
  return (
    <label>
      <FieldLabel>{label}</FieldLabel>
      <input type="number" required min={min} step={step ?? 1} value={value}
        onChange={(event) => onChange(Number(event.target.value))} className={fieldClass} />
    </label>
  );
}

function SelectField({ label, onChange, options, value }: {
  label: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<readonly [string, string]>;
  value: string;
}) {
  return (
    <label>
      <FieldLabel>{label}</FieldLabel>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {options.map(([optionValue, text]) => (
          <option key={optionValue} value={optionValue}>{text}</option>
        ))}
      </select>
    </label>
  );
}

function RemoveButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className="self-end rounded-lg px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-30">
      Xóa
    </button>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Không thể lưu công thức.";
}
