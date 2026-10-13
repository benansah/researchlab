"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Action = (formData: FormData) => void | Promise<void>;

// Disables itself and shows a spinner while its form's action runs.
export function SubmitButton({ children, pendingLabel, ...props }: React.ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <Loader2Icon className="animate-spin" />}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}

function HiddenFields({ fields }: { fields: Record<string, string> }) {
  return Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />);
}

// A "delete" button that asks for confirmation, then posts its own small form.
export function ConfirmDelete({ action, fields, title, description, label = "Delete", trigger }: {
  action: Action;
  fields: Record<string, string>;
  title: string;
  description: string;
  label?: string;
  trigger?: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? <Button type="button" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2Icon />{label}</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={action}>
          <HiddenFields fields={fields} />
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <SubmitButton variant="destructive" pendingLabel="Deleting…">{label}</SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// A button that opens a dialog containing a form posted to a server action.
export function FormDialog({ action, trigger, title, description, submitLabel, fields = {}, children }: {
  action: Action;
  trigger: React.ReactNode;
  title: string;
  description?: string;
  submitLabel: string;
  fields?: Record<string, string>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form action={action} className="grid gap-5">
          <HiddenFields fields={fields} />
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <SubmitButton pendingLabel="Saving…">{submitLabel}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
