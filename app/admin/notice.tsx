const savedMessages: Record<string, string> = {
  created: "Lab created. Fill in its profile, then tick “Published” to show it on the site.",
  lab: "Lab profile saved.",
  member: "Member saved.",
  removed: "Member removed.",
  deleted: "Lab deleted.",
  "plant-created": "Plant added. Fill in its details, then tick “Published” to show it in the garden catalogue.",
  plant: "Plant saved.",
  "plant-deleted": "Plant deleted.",
  "publication-created": "Publication added. Fill in its citation, then tick “Published” to show it on the Research page.",
  publication: "Publication saved.",
  "publication-deleted": "Publication deleted.",
  "post-created": "Post created. Write the summary, then tick “Published” to show it on the site.",
  post: "Post saved.",
  "post-deleted": "Post deleted.",
};

export default function AdminNotice({ saved, error }: { saved?: string; error?: string }) {
  if (error) return <p className="admin-error admin-notice" role="alert">{error}</p>;
  if (saved && savedMessages[saved]) return <p className="admin-success admin-notice" role="status">{savedMessages[saved]}</p>;
  return null;
}

export function MissingTablesNotice({ migration }: { migration: string }) {
  return (
    <p className="admin-error admin-notice">
      This table doesn&apos;t exist yet. Open your Supabase dashboard → SQL Editor, paste in
      <code> supabase/migrations/{migration} </code> and run it, then reload this page.
    </p>
  );
}
