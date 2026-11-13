import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  HeartPulse,
  Hospital,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logos";
import { GalleryTeaser } from "@/components/gallery/gallery-teaser";
import { RegisterButton } from "@/components/registration/register-button";
import { Scene } from "@/components/scenes";
import { PixelCalendar, PixelRibbon } from "@/components/scenes/pixel-cause";
import { PixelRoster } from "@/components/scenes/pixel-roster";
import { PixelUmpire } from "@/components/scenes/pixel-umpire";
import { Reveal } from "@/components/site/reveal";
import { SponsorMarquee } from "@/components/sponsors/sponsor-marquee";
import { formatInr, site } from "@/lib/site";

const tournamentFacts = [
  { icon: Clock3, label: "Match format", value: "10 overs a side" },
  { icon: UsersRound, label: "Team squad", value: "11 players + 2 reserves" },
  { icon: Trophy, label: "Tournament", value: "League & knockouts" },
  { icon: MapPin, label: "Ground", value: "Trichy · to be announced" },
];

const milestones = [
  { date: "Open now", title: "Registration is open", note: "Team entries are being accepted" },
  { date: "15 Jan 2027", title: "Registration closes", note: "Final date to submit your team" },
  { date: "30 Jan 2027", title: "Fixtures released", note: "Match schedule announced" },
  { date: "04 Feb 2027", title: "Tournament begins", note: "World Cancer Day" },
];

// Figures: IARC Global Cancer Observatory (GLOBOCAN 2022), WHO and UICC.
const cancerFacts = [
  { stat: "1 in 5", text: "people will develop cancer at some point in their lifetime." },
  { stat: "20 million", text: "new cases were diagnosed worldwide in 2022, with 9.7 million lives lost." },
  { stat: "4 in 10", text: "cases are linked to causes we can change. Tobacco is the biggest of them." },
  { stat: "14 lakh+", text: "new cases in India in a single year. Breast and oral cancers lead the list." },
  { stat: "35 million", text: "new cases a year are expected by 2050. That is 77% more than in 2022." },
  { stat: "Early", text: "is everything. Found early, many common cancers are far easier to treat." },
];

const eligibleRoles = [
  "Doctors & nurses",
  "Technicians & pharmacists",
  "Paramedics & therapists",
  "Administration & reception",
  "Housekeeping, security & support",
];

export default function Home() {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="live-dot" />
              HARSHAMITRA HOSPITAL PRESENTS
            </div>
            <p className="hero-location">TRICHY, TAMIL NADU <span>·</span> FEBRUARY 2027</p>
            <h1 id="hero-title">
              Beyond hospitals.
              <br />
              <span>United by cricket.</span>
            </h1>
            <p className="hero-description">
              One pitch. Every corner of healthcare. An inter-hospital tennis-ball
              cricket league playing for something bigger than the scoreboard.
            </p>
            <div className="hero-actions">
              <RegisterButton className="button button-lime">
                Register your team <ArrowRight size={17} aria-hidden="true" />
              </RegisterButton>
              <a className="text-link" href="#about">
                Discover HPL <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-note">
              <HeartPulse size={15} aria-hidden="true" />
              A World Cancer Day tribute · Tournament starts 4 February
            </p>
          </div>

          <div className="hero-art">
            <Scene id={site.heroScene} />
            <LogoMark id={site.logo} className="art-crest" />
            <div className="art-date">
              <CalendarDays size={18} aria-hidden="true" />
              <span><strong>04 FEB</strong><small>WORLD CANCER DAY</small></span>
            </div>
            <div className="art-tag">PLAY FOR A<br />GREATER CAUSE</div>
          </div>
        </div>
        <a className="scroll-cue" href="#tournament" aria-label="Scroll to tournament details">
          <span />
        </a>
      </section>

      <section className="facts-band" id="tournament" aria-label="Tournament at a glance">
        <div className="facts-inner">
          <div className="facts-heading">
            <span className="section-kicker">THE LOWDOWN</span>
            <strong>HPL at a glance</strong>
          </div>
          {tournamentFacts.map(({ icon: Icon, label, value }) => (
            <div className="fact" key={label}>
              <span className="fact-icon"><Icon size={19} aria-hidden="true" /></span>
              <span><small>{label}</small><strong>{value}</strong></span>
            </div>
          ))}
          <div className="fact entry-fact">
            <span className="fact-icon"><span className="rupee-mark">₹</span></span>
            <span><small>Team entry</small><strong>{formatInr(site.entryFee)}</strong></span>
          </div>
        </div>
      </section>

      <section className="host-section" id="host" aria-labelledby="host-title">
        <div className="section-wrap host-layout">
          <div>
            <span className="section-kicker">ORGANISED &amp; HOSTED BY</span>
            <h2 className="host-name" id="host-title">Harshamitra <span>Hospital</span></h2>
            <div className="host-place"><MapPin size={16} aria-hidden="true" /> {site.hostAddress}, Tamil Nadu</div>
          </div>
          <div className="host-card">
            <div className="host-card-head">
              <span className="host-icon"><Hospital size={21} aria-hidden="true" /></span>
              <div><small>MAIN ORGANISER</small><strong>The home of HPL</strong></div>
            </div>
            <p>
              HPL is conceived, organised and hosted by {site.host}. Every
              February the hospital brings the region&apos;s healthcare community
              onto one ground for World Cancer Day: to play, to stand with
              patients, and to talk openly about early detection.
            </p>
            <div className="host-links">
              <Link href="/organizers">Meet the organising committee <ArrowRight size={15} aria-hidden="true" /></Link>
              {site.hostUrl && (
                <a href={site.hostUrl} target="_blank" rel="noreferrer">Visit the hospital <ArrowRight size={15} aria-hidden="true" /></a>
              )}
            </div>
          </div>
        </div>
      </section>

      <Reveal as="section" className="about-section section-wrap" id="about">
        <div className="about-heading">
          <span className="section-kicker">MORE THAN MATCH DAY</span>
          <h2>Play together.<br /><span>Stand together.</span></h2>
          <PixelRibbon />
        </div>
        <div className="about-copy">
          <p>
            HPL brings the people behind healthcare onto the same field: doctors,
            nurses, technicians, administrators and support teams, representing
            their own hospitals.
          </p>
          <p>
            Every February, the league plays in observance of World Cancer Day.
            It&apos;s a chance to bring our community together around cancer
            awareness, early detection and compassionate care.
          </p>
          <a className="underlined-link" href="#eligibility">
            Find your place on the team <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </Reveal>

      <section className="wcd-section" id="world-cancer-day" aria-labelledby="wcd-title">
        <div className="section-wrap wcd-layout">
          <div className="wcd-intro">
            <PixelCalendar />
            <span className="section-kicker">WHY WE PLAY ON 4 FEBRUARY</span>
            <h2 id="wcd-title">One day.<br /><span>The whole world.</span></h2>
            <p>
              World Cancer Day began on 4 February 2000 in Paris, at the World
              Summit Against Cancer, where the Charter of Paris Against Cancer
              was signed. Led by the Union for International Cancer Control, it
              is now marked around the world with one aim: fewer people facing
              cancer, and no one facing it alone.
            </p>
            <p className="wcd-theme">
              The 2025&ndash;2027 theme is <strong>United by Unique</strong>:
              care that sees the person before the patient.
            </p>
          </div>
          <div className="wcd-data">
          <ul className="wcd-facts">
            {cancerFacts.map(({ stat, text }) => (
              <li className="wcd-fact" key={stat}><strong>{stat}</strong><span>{text}</span></li>
            ))}
          </ul>
          <p className="wcd-source">
            Figures from the IARC Global Cancer Observatory (GLOBOCAN 2022), the
            World Health Organization and the Union for International Cancer Control.
          </p>
          </div>
        </div>
      </section>

      <section className="format-section">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <span className="section-kicker">THE GAME PLAN</span>
              <h2>All heart. <span>All cricket.</span></h2>
            </div>
            <p>A few things to know before you lace up.</p>
          </div>
          <div className="format-grid">
            <Reveal as="article" className="format-card">
              <span className="format-number">01</span>
              <div className="format-icon"><Clock3 size={22} aria-hidden="true" /></div>
              <h3>Short, sharp cricket</h3>
              <p>Ten overs a side. Tennis ball. Bring your game face.</p>
            </Reveal>
            <Reveal as="article" className="format-card" delay={80}>
              <span className="format-number">02</span>
              <div className="format-icon"><UsersRound size={22} aria-hidden="true" /></div>
              <h3>A full team effort</h3>
              <p>Eleven players and two reserves, with a captain and vice-captain.</p>
            </Reveal>
            <Reveal as="article" className="format-card" delay={160}>
              <span className="format-number">03</span>
              <div className="format-icon"><Trophy size={22} aria-hidden="true" /></div>
              <h3>Every match matters</h3>
              <p>League play leads into the knockouts. Fixtures coming 30 January.</p>
            </Reveal>
            <Reveal as="article" className="format-card" delay={240}>
              <span className="format-number">04</span>
              <div className="format-icon"><MapPin size={22} aria-hidden="true" /></div>
              <h3>Meet us in Trichy</h3>
              <p>The tournament ground will be announced by the organisers.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal as="section" className="eligibility-section section-wrap" id="eligibility">
        <div className="eligibility-copy">
          <span className="section-kicker">YOUR HOSPITAL. YOUR TEAM.</span>
          <h2>There&apos;s a place<br />for <span>you here.</span></h2>
          <p>
            HPL is open to permanent and contractual employees of private
            hospitals and healthcare institutions. If you help care happen,
            you&apos;re part of the team.
          </p>
          <div className="eligibility-note">
            <ShieldCheck size={20} aria-hidden="true" />
            <span>Players must carry hospital ID or employment proof and represent only their own institution.</span>
          </div>
        </div>
        <div className="roles-card">
          <div className="roles-card-head">
            <span className="roles-icon"><UsersRound size={20} aria-hidden="true" /></span>
            <div><small>THE HPL ROSTER</small><strong>Every role belongs.</strong></div>
          </div>
          <ul>
            {eligibleRoles.map((role) => (
              <li key={role}><Check size={17} aria-hidden="true" />{role}</li>
            ))}
          </ul>
          <PixelRoster />
          <div className="roles-footer">Mixed-gender teams · One hospital per player</div>
        </div>
      </Reveal>

      <SponsorMarquee />

      <section className="dates-section" id="dates">
        <div className="section-wrap dates-layout">
          <div className="dates-intro">
            <span className="section-kicker">MARK YOUR CALENDAR</span>
            <h2>The road<br />to <span>HPL 2027.</span></h2>
            <p>Get your team ready. The countdown starts here.</p>
            <div className="dates-footnote">
              Tournament play is planned to begin on 4 February, with matches on
              Saturdays. Knockout dates are tentative and will be confirmed by
              the organisers.
            </div>
          </div>
          <ol className="timeline">
            {milestones.map(({ date, title, note }, index) => (
              <li className={index === milestones.length - 1 ? "timeline-item timeline-highlight" : "timeline-item"} key={date}>
                <span className="timeline-node">{index === milestones.length - 1 ? <Trophy size={15} aria-hidden="true" /> : <span>{`0${index + 1}`}</span>}</span>
                <div className="timeline-date">{date}</div>
                <div className="timeline-title">{title}</div>
                <div className="timeline-note">{note}</div>
              </li>
            ))}
          </ol>
          <PixelUmpire />
        </div>
      </section>

      <GalleryTeaser />

      <section className="register-section" id="register">
        <div className="register-pattern" aria-hidden="true" />
        <div className="register-inner">
          <div className="register-copy">
            <span className="section-kicker">GET YOUR TEAM TOGETHER</span>
            <h2>Ready to take<br />the <span>field?</span></h2>
            <p>
              Team registration is open now and closes on {site.registration.closesLabel}.
              Pick your squad and get your entry in.
            </p>
            <div className="register-actions">
              <RegisterButton className="button button-forest">
                Register your team <ArrowRight size={17} aria-hidden="true" />
              </RegisterButton>
              <span className="register-status">
                <span className="status-dot" />
                Open now · closes {site.registration.closesLabel}
              </span>
            </div>
          </div>
          <div className="contact-card">
            <span className="contact-overline">QUESTIONS ABOUT ENTERING?</span>
            <h3>Talk to the organisers.</h3>
            <p>Reach out for team registration and tournament enquiries.</p>
            <a className="contact-link" href="tel:+917373731008">
              <span className="contact-link-icon"><Phone size={17} aria-hidden="true" /></span>
              <span><small>Registration enquiries</small><strong>Dr Banuchandar · 73737 31008</strong></span>
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="contact-link" href="mailto:rajuarumugham@gmail.com">
              <span className="contact-link-icon"><Mail size={17} aria-hidden="true" /></span>
              <span><small>Tournament director</small><strong>Raju Arumugham (Ara)</strong></span>
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <Link className="contact-link" href="/organizers">
              <span className="contact-link-icon"><UsersRound size={17} aria-hidden="true" /></span>
              <span><small>Organising committee</small><strong>Meet the people behind HPL</strong></span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <div className="contact-deadline">
              <span>ENTRY FEE</span><strong>{formatInr(site.entryFee)} per team</strong>
              <small>Pay by UPI while you register. Have your 12-digit reference ready.</small>
            </div>
          </div>
        </div>
      </section>
      </main>

    </>
  );
}
