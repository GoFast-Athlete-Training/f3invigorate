import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/f3service-demo/ao", label: "AO Dashboard" },
  { href: "/f3service-demo/events/act-mid-river", label: "Event Page" },
  { href: "/f3service-demo/profile", label: "Personal Profile" },
  { href: "/f3service-demo/orgs", label: "Org Templates" },
];

export function ServiceEngineNav({ activeHref }: { activeHref: string }) {
  return (
    <nav className="rounded-xl border border-gray-200 bg-white p-2">
      <ul className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`inline-flex rounded-lg px-3 py-2 text-sm font-medium ${
                item.href === activeHref
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
