import type { SVGProps } from "react";

/** Wrapper qui pose les défauts communs et expose un `size` pratique. */
function Svg({ size = 16, children, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

type IconProps = { size?: number; className?: string };

export const UserIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0116 0v1" /></Svg>
);

export const BriefcaseIcon = (p: IconProps) => (
  <Svg {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></Svg>
);

export const RocketIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 3.5C18 3.5 20.5 6 20.5 9.5c0 3-5 8-9 12-4-4-9-9-9-12C2.5 6 5 3.5 8.5 3.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3z" transform="rotate(45 12 12)"/>
    <circle cx="12" cy="9" r="2"/>
  </Svg>
);

export const GraduationIcon = (p: IconProps) => (
  <Svg {...p}><path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11v4c0 1 3 3 6 3s6-2 6-3v-4"/></Svg>
);

export const SparklesIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 18l.7 2L8 21l-2.3.7L5 24l-.7-2.3L2 21l2.3-.7z" /></Svg>
);

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 3 17 0 20-3-3-3-17 0-20"/></Svg>
);

export const AwardIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="9" r="6"/><path d="M8.5 14l-2 7 5.5-3 5.5 3-2-7"/></Svg>
);

export const TargetIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}><polyline points="9 18 15 12 9 6" /></Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}><polyline points="15 18 9 12 15 6" /></Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></Svg>
);

export const SaveIcon = (p: IconProps) => (
  <Svg {...p}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Svg>
);

export const FileTextIcon = (p: IconProps) => (
  <Svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></Svg>
);

export const CheckCheckIcon = (p: IconProps) => (
  <Svg {...p}><polyline points="2 12 6 16 12 10"/><polyline points="11 16 15 20 22 12"/></Svg>
);

export const SendIcon = (p: IconProps) => (
  <Svg {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Svg>
);

export const ExternalLinkIcon = (p: IconProps) => (
  <Svg {...p}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>
);

export const SidebarIcon = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></Svg>
);

export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></Svg>
);
