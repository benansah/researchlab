import { getLabs } from "../lib/labs";
import Navbar from "./navbar";

export default async function SiteHeader() {
  // The header must never take the page down, so a failed lab lookup just hides the dropdown.
  const labs = await getLabs().catch(() => []);
  return <Navbar labLinks={labs.map((lab) => ({ name: lab.name, href: `/labs/${lab.slug}` }))} />;
}
