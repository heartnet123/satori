"use client";

import {
  BarChartIcon,
  BoltIcon,
  BriefcaseIcon,
  FileTextIcon,
  SettingsIcon,
  StarIcon,
} from "./icons";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    { label: "Resume Parser", icon: FileTextIcon, href: "/" },
    { label: "JD Analyzer", icon: BriefcaseIcon, href: "/jobs" },
    { label: "Matching Engine", icon: BoltIcon, href: "/matches" },
    { label: "Recommendation Engine", icon: StarIcon, href: "/recommendations" },
    { label: "Evaluation Dashboard", icon: BarChartIcon, href: "/dashboard" },
  ];

  return (
    <aside className="border-b border-line/80 bg-surface/95 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-4 border-line/80 px-5 py-5 sm:px-6 lg:px-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-[0_14px_30px_rgba(45,99,243,0.25)]">
          S
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold tracking-tight text-foreground">
            Satori
          </div>
          <div className="font-display text-sm font-semibold tracking-tight text-foreground">
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 pt-2 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-2 lg:py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href as any}
              className={`group flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(45,99,243,0.22)]"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90 transition group-hover:scale-105" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line/80 px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
        >
          <SettingsIcon className="h-5 w-5 shrink-0" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px]">
            ?
          </span>
          <span>Help</span>
        </button>
      </div>
    </aside>
  );
}
