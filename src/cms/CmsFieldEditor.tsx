import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Json } from "@/integrations/supabase/types";

import type { CmsFieldDefinition } from "./types";

type CmsFormData = Record<string, Json | undefined>;

function recordValue(value: Json | undefined): CmsFormData {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function CmsFieldEditor({
  fields,
  value,
  onChange,
}: {
  fields: CmsFieldDefinition[];
  value: CmsFormData;
  onChange: (value: CmsFormData) => void;
}) {
  const setField = (key: string, next: Json | undefined) => onChange({ ...value, [key]: next });

  return (
    <div className="space-y-5">
      {fields.map((field) => {
        const current = value[field.key];
        const id = `cms-field-${field.key}`;

        if (field.kind === "boolean") {
          return (
            <label
              key={field.key}
              className="flex items-start gap-3 rounded-sm border border-rule p-4 text-sm"
            >
              <input
                type="checkbox"
                checked={current === true}
                onChange={(event) => setField(field.key, event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span className="font-semibold text-foreground">{field.label}</span>
                {field.help ? (
                  <span className="mt-1 block text-xs text-muted-foreground">{field.help}</span>
                ) : null}
              </span>
            </label>
          );
        }

        if (field.kind === "select") {
          return (
            <div key={field.key}>
              <Label htmlFor={id}>{field.label}</Label>
              <select
                id={id}
                value={typeof current === "string" ? current : ""}
                onChange={(event) => setField(field.key, event.target.value)}
                className="mt-2 flex h-11 w-full rounded-sm border border-input bg-background px-3 text-sm"
              >
                {(field.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.kind === "string_list") {
          const items = Array.isArray(current)
            ? current.filter((item): item is string => typeof item === "string")
            : [];
          return (
            <fieldset key={field.key} className="rounded-sm border border-rule p-4">
              <legend className="px-1 text-sm font-semibold text-foreground">{field.label}</legend>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={item}
                      onChange={(event) => {
                        const next = [...items];
                        next[index] = event.target.value;
                        setField(field.key, next);
                      }}
                      rows={3}
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        className="rounded-sm border border-rule p-2"
                        onClick={() => {
                          if (index === 0) return;
                          const next = [...items];
                          [next[index - 1], next[index]] = [
                            next[index] ?? "",
                            next[index - 1] ?? "",
                          ];
                          setField(field.key, next);
                        }}
                        aria-label="Move item up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-sm border border-rule p-2"
                        onClick={() => {
                          if (index >= items.length - 1) return;
                          const next = [...items];
                          [next[index], next[index + 1]] = [
                            next[index + 1] ?? "",
                            next[index] ?? "",
                          ];
                          setField(field.key, next);
                        }}
                        aria-label="Move item down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-sm border border-rule p-2 text-destructive"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Remove this item from the draft? Published history remains available.",
                            )
                          ) {
                            setField(
                              field.key,
                              items.filter((_, itemIndex) => itemIndex !== index),
                            );
                          }
                        }}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-secondary min-h-10 px-4 text-sm"
                  onClick={() => setField(field.key, [...items, ""])}
                >
                  <Plus className="h-4 w-4" /> Add item
                </button>
              </div>
            </fieldset>
          );
        }

        if (field.kind === "item_list") {
          const items = Array.isArray(current) ? current.map(recordValue) : [];
          return (
            <fieldset key={field.key} className="rounded-sm border border-rule p-4">
              <legend className="px-1 text-sm font-semibold text-foreground">{field.label}</legend>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="rounded-sm border border-rule bg-surface p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {field.label} {index + 1}
                      </p>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="rounded-sm border border-rule bg-background p-2"
                          onClick={() => {
                            if (index === 0) return;
                            const next = clone(items);
                            [next[index - 1], next[index]] = [
                              next[index] ?? {},
                              next[index - 1] ?? {},
                            ];
                            setField(field.key, next);
                          }}
                          aria-label="Move item up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-sm border border-rule bg-background p-2"
                          onClick={() => {
                            if (index >= items.length - 1) return;
                            const next = clone(items);
                            [next[index], next[index + 1]] = [
                              next[index + 1] ?? {},
                              next[index] ?? {},
                            ];
                            setField(field.key, next);
                          }}
                          aria-label="Move item down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-sm border border-rule bg-background p-2 text-destructive"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Remove this item from the draft? Published history remains available.",
                              )
                            ) {
                              setField(
                                field.key,
                                items.filter((_, itemIndex) => itemIndex !== index),
                              );
                            }
                          }}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <CmsFieldEditor
                      fields={field.itemFields ?? []}
                      value={item}
                      onChange={(nextItem) => {
                        const next = clone(items);
                        next[index] = nextItem;
                        setField(field.key, next);
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-secondary min-h-10 px-4 text-sm"
                  onClick={() => {
                    const blank = Object.fromEntries(
                      (field.itemFields ?? []).map((itemField) => [
                        itemField.key,
                        itemField.defaultValue ?? "",
                      ]),
                    );
                    setField(field.key, [...items, blank]);
                  }}
                >
                  <Plus className="h-4 w-4" /> Add {field.label.toLowerCase()}
                </button>
              </div>
            </fieldset>
          );
        }

        if (field.kind === "textarea") {
          return (
            <div key={field.key}>
              <Label htmlFor={id}>{field.label}</Label>
              <Textarea
                id={id}
                value={typeof current === "string" ? current : ""}
                onChange={(event) => setField(field.key, event.target.value)}
                className="mt-2 min-h-28"
              />
              {field.help ? (
                <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
              ) : null}
            </div>
          );
        }

        return (
          <div key={field.key}>
            <Label htmlFor={id}>{field.label}</Label>
            <Input
              id={id}
              type={field.kind === "number" ? "number" : field.kind === "url" ? "url" : "text"}
              value={
                typeof current === "string" || typeof current === "number" ? String(current) : ""
              }
              onChange={(event) =>
                setField(
                  field.key,
                  field.kind === "number" ? Number(event.target.value) : event.target.value,
                )
              }
              className="mt-2 h-11"
            />
            {field.help ? <p className="mt-1 text-xs text-muted-foreground">{field.help}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
