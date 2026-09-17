import Image from "next/image";
import Link from "next/link";

type NavLink = {
  name: string;
  link: string;
};

export default function Navbar() {

  const links: NavLink[] = [

    { name: "Home", link: "/"},
    { name: "Research", link: "/research"},
    { name: "About", link: "/about"},
    { name: "Contact", link: "/contact"},
    { name: "Services", link: "/services"},
    
  ]


  return (
    <nav className="flex h-30 w-full items-center justify-between border-b border-solid border-black/[.08] bg-white px-6 text-sm font-medium text-black ">
      {/* dark:border-white/[.145] dark:bg-black dark:text-zinc-50 */}

      <div className="flex items-center gap-4">
        <Image
          className="h-20 w-20 rounded-full"
          src="/logo.png"
          alt="Next.js logo"
          width={500}
          height={500}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-col">
          <p> Centre for Phytomedicine and Natural Drug Product Discovery </p>
          <p className="text-slate-500">School of Pharmacy | University of Health and Allied Sciences</p>
        </div>
        <div className="links">
          {
            links.map((link) => (
              <Link key={link.name} href={link.link} className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">{link.name}</Link>
            ))
          }
        </div> 
      </div>
    </nav>
  );
}