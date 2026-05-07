import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
  viewBox: "0 0 24 24",
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 17.5h-5" />
      <path d="M18 16.5H6a4 4 0 0 0 1.5-3.1V10a4.5 4.5 0 0 1 9 0v3.4a4 4 0 0 0 1.5 3.1Z" />
      <path d="M10.5 19.5a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15-.1.2a2 2 0 0 1-2.4.9l-.2-.1a2 2 0 0 0-2.4.8l-.1.2a2 2 0 0 1-2.8.7l-.2-.1a2 2 0 0 0-2.4 0l-.2.1a2 2 0 0 1-2.8-.7l-.1-.2a2 2 0 0 0-2.4-.8l-.2.1a2 2 0 0 1-2.4-.9l-.1-.2a2 2 0 0 1 0-2.6l.1-.2a2 2 0 0 0 .9-2.4l-.1-.2a2 2 0 0 1 .7-2.8l.2-.1a2 2 0 0 0 .8-2.4l-.1-.2a2 2 0 0 1 .9-2.4l.2-.1a2 2 0 0 1 2.6 0l.2.1a2 2 0 0 0 2.4-.9l.2-.1a2 2 0 0 1 2.8.7l.1.2a2 2 0 0 0 2.4.8l.2-.1a2 2 0 0 1 2.4.9l.1.2a2 2 0 0 1 0 2.6l-.1.2a2 2 0 0 0-.9 2.4l.1.2a2 2 0 0 1-.7 2.8l-.2.1a2 2 0 0 0-.8 2.4l.1.2a2 2 0 0 1-.9 2.4Z" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h6l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13 3.5V8h4" />
      <path d="M9 12h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 16V5" />
      <path d="m8 9 4-4 4 4" />
      <path d="M4.5 14.5v2A2.5 2.5 0 0 0 7 19h10a2.5 2.5 0 0 0 2.5-2.5v-2" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M4 12h16" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 5 13h6l-1 9 9-12h-6l0-8Z" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </svg>
  );
}

export function BarChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </svg>
  );
}

export function SearchDocumentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h6l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13 3.5V8h4" />
      <circle cx="10" cy="13" r="1.75" />
      <path d="m11.2 14.2 2 2" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s5-4.6 5-9a5 5 0 1 0-10 0c0 4.4 5 9 5 9Z" />
      <circle cx="12" cy="12" r="1.6" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.8 1.6" />
    </svg>
  );
}

export function GraduationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 4 8 4-8 4-8-4 8-4Z" />
      <path d="M6 10v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
    </svg>
  );
}

