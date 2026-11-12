import Link from "next/link";
import { LogoMark } from "@/components/brand/logos";
import { site } from "@/lib/site";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={footer ? "brand footer-brand" : "brand"} href="/" aria-label={`${site.name} home`}>
      <LogoMark id={site.logo} className="brand-mark" />
      <span className="brand-copy">
        <strong>
          HPL <span>2027</span>
        </strong>
        <small>{footer ? site.tagline : site.fullName}</small>
      </span>
    </Link>
  );
}
