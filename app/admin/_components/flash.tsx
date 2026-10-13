"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const savedMessages: Record<string, string> = {
  created: "Lab created. Fill in its profile, then switch on “Published” to show it on the site.",
  lab: "Lab profile saved.",
  member: "Member saved.",
  removed: "Member removed.",
  deleted: "Lab deleted.",
  "plant-created": "Plant added. Fill in its details, then switch on “Published” to show it in the catalogue.",
  plant: "Plant saved.",
  "plant-deleted": "Plant deleted.",
  "publication-created": "Publication added. Fill in its citation, then switch on “Published”.",
  publication: "Publication saved.",
  "publication-deleted": "Publication deleted.",
  "post-created": "Post created. Write the summary, then switch on “Published”.",
  post: "Post saved.",
  "post-deleted": "Post deleted.",
};

// Server actions redirect with ?saved=<key> or ?error=<message>; show it once as a toast,
// then drop the parameter so a reload doesn't repeat it.
export default function Flash() {
  const params = useSearchParams();
  const saved = params.get("saved");
  const error = params.get("error");

  useEffect(() => {
    if (!saved && !error) return;
    if (error) toast.error(error, { duration: 8000 });
    else if (saved && savedMessages[saved]) toast.success(savedMessages[saved]);

    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    url.searchParams.delete("error");
    window.history.replaceState(window.history.state, "", url);
  }, [saved, error]);

  return null;
}
