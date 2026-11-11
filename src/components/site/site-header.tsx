import { ArrowRight } from "lucide-react";
import { RegisterButton } from "@/components/registration/register-button";
import { Brand } from "./brand";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Brand />
        <MainNav />
        <div className="nav-actions">
          <RegisterButton className="nav-cta">
            Register team <ArrowRight size={16} aria-hidden="true" />
          </RegisterButton>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
