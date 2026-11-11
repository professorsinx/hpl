import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Brand({ footer = false }: { footer?: boolean }) {
  const size = footer ? 48 : 56;
  return (
    <Link className={footer ? "brand footer-brand" : "brand"} href="/" aria-label={`${site.name} home`}>
      <span className="brand-mark">
        <Image src="/images/hpl-logo.jpeg" alt="" width={size} height={size} priority={!footer} />
      </span>
      <span className="brand-copy">
        <strong>
          HPL <span>2027</span>
        </strong>
        <small>{footer ? site.tagline : site.fullName}</small>
      </span>
    </Link>
  );
}
