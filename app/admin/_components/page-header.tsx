import Link from "next/link";
import { Fragment } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Crumb = { name: string; href?: string };

// Top bar (sidebar toggle + breadcrumbs) and the page title block.
export default function PageHeader({ crumbs, title, description, actions }: {
  crumbs: Crumb[];
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => (
              <Fragment key={`${crumb.name}-${i}`}>
                {i > 0 && <BreadcrumbSeparator className={i < crumbs.length - 1 ? "hidden md:block" : undefined} />}
                <BreadcrumbItem className={i < crumbs.length - 1 ? "hidden md:block" : undefined}>
                  {crumb.href && i < crumbs.length - 1 ? (
                    <BreadcrumbLink asChild><Link href={crumb.href}>{crumb.name}</Link></BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="max-w-[40ch] truncate">{crumb.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-col gap-4 px-4 pt-6 sm:flex-row sm:items-end sm:justify-between md:px-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </>
  );
}
