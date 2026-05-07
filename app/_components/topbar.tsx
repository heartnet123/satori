import {
  BellIcon,
  ChevronDownIcon,
  SearchIcon,
  SettingsIcon,
} from "./icons";

export function Topbar() {
  return (
    <header className="border-b border-line/80 bg-surface/80 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <label className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            aria-label="Search everything"
            placeholder="Search everything..."
            className="h-14 w-full rounded-2xl border border-line bg-background/80 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent text-muted-foreground transition hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#ef4444]" />
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent text-muted-foreground transition hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10"
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-line bg-background px-3 py-2 text-left transition hover:border-primary/30 hover:shadow-[0_12px_32px_rgba(18,38,79,0.08)]"
            aria-label="Admin user menu"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              AU
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block text-sm font-semibold text-foreground">
                Admin User
              </span>
            </span>
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
