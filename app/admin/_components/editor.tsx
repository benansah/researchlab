import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "./list";
import { ConfirmDelete, SubmitButton } from "./form-controls";

type Action = (formData: FormData) => void | Promise<void>;

// Edit pages: the form wraps the content cards and the sticky publish panel, so one Save covers both.
export function EditorForm({ action, id, aside, children }: { action: Action; id: string; aside: React.ReactNode; children: React.ReactNode }) {
  return (
    <form action={action} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <input type="hidden" name="id" value={id} />
      <div className="grid min-w-0 gap-6">{children}</div>
      <aside className="grid gap-6 lg:sticky lg:top-20">{aside}</aside>
    </form>
  );
}

export function Section({ title, description, children, id }: { title: string; description?: string; children: React.ReactNode; id?: string }) {
  return (
    <Card id={id} className="scroll-mt-20">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-5">{children}</CardContent>
    </Card>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

type Labelled = { name: string; label: string; hint?: React.ReactNode };

export function TextField({ name, label, hint, ...props }: Labelled & React.ComponentProps<typeof Input>) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input id={name} name={name} {...props} />
      {hint && <FieldDescription>{hint}</FieldDescription>}
    </Field>
  );
}

export function TextAreaField({ name, label, hint, ...props }: Labelled & React.ComponentProps<typeof Textarea>) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Textarea id={name} name={name} {...props} />
      {hint && <FieldDescription>{hint}</FieldDescription>}
    </Field>
  );
}

// Lists (aims, uses, …) are edited one item per line.
export function ListField({ name, label, values, hint, rows = 4 }: Labelled & { values: string[]; rows?: number }) {
  return <TextAreaField name={name} label={label} rows={rows} defaultValue={values.join("\n")} hint={hint ?? "One item per line."} />;
}

export function SelectField({ name, label, hint, options, defaultValue, emptyLabel }: Labelled & {
  options: { value: string; label: string }[];
  defaultValue?: string;
  emptyLabel?: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <NativeSelect id={name} name={name} defaultValue={defaultValue ?? ""} className="w-full">
        {emptyLabel && <NativeSelectOption value="">{emptyLabel}</NativeSelectOption>}
        {options.map((option) => <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>)}
      </NativeSelect>
      {hint && <FieldDescription>{hint}</FieldDescription>}
    </Field>
  );
}

export function SwitchField({ name, label, hint, defaultChecked }: Labelled & { defaultChecked: boolean }) {
  return (
    <Field orientation="horizontal" className="items-start justify-between gap-4">
      <div className="grid gap-1">
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        {hint && <FieldDescription>{hint}</FieldDescription>}
      </div>
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
    </Field>
  );
}

// The sticky side card on every edit page: status, publish switch, save, view and delete.
export function PublishPanel({ published, publishLabel, publishHint, viewHref, saveLabel, extra, remove, notes }: {
  published: boolean;
  publishLabel: string;
  publishHint: string;
  viewHref?: string;
  saveLabel: string;
  extra?: React.ReactNode;
  remove: { action: Action; fields: Record<string, string>; title: string; description: string; label: string };
  notes?: React.ReactNode;
}) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Status</CardTitle>
          <StatusBadge published={published} />
        </CardHeader>
        <CardContent className="grid gap-5">
          <SwitchField name="published" label={publishLabel} hint={publishHint} defaultChecked={published} />
          {extra}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t">
          <SubmitButton className="w-full" pendingLabel="Saving…">{saveLabel}</SubmitButton>
          {viewHref && published && (
            <Button variant="outline" className="w-full" asChild>
              <Link href={viewHref} target="_blank">View on site <ArrowUpRightIcon /></Link>
            </Button>
          )}
          <Separator className="my-1" />
          <ConfirmDelete {...remove} />
        </CardFooter>
      </Card>
      {notes && (
        <Card className="bg-muted/40 shadow-none">
          <CardContent className="grid gap-2 text-sm text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground">{notes}</CardContent>
        </Card>
      )}
    </>
  );
}
