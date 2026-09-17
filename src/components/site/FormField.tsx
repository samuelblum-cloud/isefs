import type { ReactNode } from "react";

const fieldClasses =
  "mt-2 w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  optional?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optional ? <span className="ml-1 text-muted-foreground">(optional)</span> : null}
      </label>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  id,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string | undefined }) {
  return (
    <input
      id={id}
      className={fieldClasses}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  );
}

export function TextArea({
  id,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; error?: string | undefined }) {
  return (
    <textarea
      id={id}
      className={fieldClasses}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  );
}

export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
