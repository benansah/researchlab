"use client";

export default function ConfirmButton({ message, formAction, className, children }: {
  message: string;
  formAction: (formData: FormData) => void | Promise<void>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      formNoValidate
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
