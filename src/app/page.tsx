import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";

const tournamentFacts = [
  { icon: Clock3, label: "Match format", value: "10 overs a side" },
  { icon: UsersRound, label: "Team squad", value: "11 players + 2 reserves" },
  { icon: Trophy, label: "Tournament", value: "League & knockouts" },
  { icon: MapPin, label: "Ground", value: "Trichy · to be announced" },
];

const milestones = [
  { date: "15 Dec 2026", title: "Registration opens", note: "Team entries begin" },
  { date: "15 Jan 2027", title: "Registration closes", note: "Final date to submit your team" },
  { date: "30 Jan 2027", title: "Fixtures released", note: "Match schedule announced" },
  { date: "04 Feb 2027", title: "Tournament begins", note: "World Cancer Day" },
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
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#top" aria-label="HPL 2027 home">
            <span className="brand-mark">
              <Image
                src="/images/hpl-logo.jpeg"
                alt=""
                width={56}
                height={56}
                priority
              />
            </span>
            <span className="brand-copy">
              <strong>HPL <span>2027</span></strong>
              <small>Healthcare Premier League</small>
            </span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#about">The cause</a>
            <a href="#tournament">Tournament</a>
            <a href="#eligibility">Who can play</a>
            <a href="#dates">Key dates</a>
          </nav>

          <a className="nav-cta" href="#register">
            Join the league <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

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
              <a className="button button-lime" href="#register">
                Registration opens 15 Dec <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="text-link" href="#about">
                Discover HPL <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-note">
              <HeartPulse size={15} aria-hidden="true" />
              A World Cancer Day tribute · Tournament starts 4 February
            </p>
          </div>

          <div className="hero-art" aria-label="HPL 2027 tournament crest">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="crest-frame">
              <Image
                className="crest-image"
                src="/images/hpl-logo.jpeg"
                alt="Healthcare Premier League 2027 crest with a cricket bat, ball and cancer awareness ribbon"
                width={520}
                height={260}
                priority
              />
            </div>
            <div className="art-date">
              <CalendarDays size={18} aria-hidden="true" />
              <span><strong>04 FEB</strong><small>WORLD CANCER DAY</small></span>
            </div>
            <div className="art-tag">PLAY FOR A<br />GREATER CAUSE</div>
            <span className="art-star star-one">✳</span>
            <span className="art-star star-two">✳</span>
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
            <span><small>Team entry</small><strong>₹10,000</strong></span>
          </div>
        </div>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="about-heading">
          <span className="section-kicker">MORE THAN MATCH DAY</span>
          <h2>Play together.<br /><span>Stand together.</span></h2>
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
        <div className="about-stamp" aria-hidden="true">
          <HeartPulse size={31} strokeWidth={1.6} />
          <span>UNITED<br />FOR CARE</span>
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
            <article className="format-card">
              <span className="format-number">01</span>
              <div className="format-icon"><Clock3 size={22} aria-hidden="true" /></div>
              <h3>Short, sharp cricket</h3>
              <p>Ten overs a side. Tennis ball. Bring your game face.</p>
            </article>
            <article className="format-card">
              <span className="format-number">02</span>
              <div className="format-icon"><UsersRound size={22} aria-hidden="true" /></div>
              <h3>A full team effort</h3>
              <p>Eleven players and two reserves, with a captain and vice-captain.</p>
            </article>
            <article className="format-card">
              <span className="format-number">03</span>
              <div className="format-icon"><Trophy size={22} aria-hidden="true" /></div>
              <h3>Every match matters</h3>
              <p>League play leads into the knockouts. Fixtures coming 30 January.</p>
            </article>
            <article className="format-card">
              <span className="format-number">04</span>
              <div className="format-icon"><MapPin size={22} aria-hidden="true" /></div>
              <h3>Meet us in Trichy</h3>
              <p>The tournament ground will be announced by the organisers.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="eligibility-section section-wrap" id="eligibility">
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
          <div className="roles-footer">Mixed-gender teams · One hospital per player</div>
        </div>
      </section>

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
        </div>
      </section>

      <section className="register-section" id="register">
        <div className="register-pattern" aria-hidden="true" />
        <div className="register-inner">
          <div className="register-copy">
            <span className="section-kicker">GET YOUR TEAM TOGETHER</span>
            <h2>Ready to take<br />the <span>field?</span></h2>
            <p>
              Team registration opens 15 December 2026 and closes 15 January
              2027. Start building your squad now.
            </p>
            <div className="register-status">
              <span className="status-dot" />
              Registration opens in December
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
              <span className="contact-link-icon"><CalendarDays size={17} aria-hidden="true" /></span>
              <span><small>Tournament director</small><strong>Raju Arumugham (Ara)</strong></span>
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <div className="contact-deadline">
              <span>ENTRY FEE</span><strong>₹10,000 per team</strong>
              <small>Payment instructions will be shared by the organisers.</small>
            </div>
          </div>
        </div>
      </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="brand footer-brand" href="#top" aria-label="HPL 2027 home">
            <span className="brand-mark">
              <Image src="/images/hpl-logo.jpeg" alt="" width={48} height={48} />
            </span>
            <span className="brand-copy">
              <strong>HPL <span>2027</span></strong>
              <small>Beyond hospitals. United by cricket.</small>
            </span>
          </a>
          <p>Organised by Harshamitra Hospital<br />Nagamangalam, Trichy</p>
          <a className="footer-contact" href="tel:+919363112508">
            <Phone size={15} aria-hidden="true" /> Tournament Chairman · 93631 12508
          </a>
          <span className="footer-copyright">© HPL 2027</span>
        </div>
      </footer>
    </>
  );
}
