import type { Metadata } from "next";
import { Award, Mail, MapPin, Phone } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { RevealText } from "@/components/motion/reveal-text";
import { Magnetic } from "@/components/motion/magnetic";
import { ContactForm } from "@/components/ui/contact-form";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { profile } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Muhammad Ahmad Aslam, an AI full-stack developer based in Riyadh, Saudi Arabia. Email, LinkedIn, phone, or the contact form all reach me directly.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-dvh items-center pt-32 pb-24">
      <Container className="w-full min-w-0">
        <Eyebrow>contact</Eyebrow>
        <RevealText
          as="h1"
          className="mt-6 font-display text-[3rem] font-semibold leading-[0.95] tracking-[-0.03em] text-bone sm:text-[4.2rem]"
        >
          Let&apos;s build <span className="text-gradient-violet">something.</span>
        </RevealText>

        <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <p className="max-w-md text-lg leading-relaxed text-bone-dim">
              Open to full-stack and AI engineering roles, and problems worth
              the effort. The fastest way to reach me is right here.
            </p>

            <div className="mt-9">
              <Magnetic className="max-w-full">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex max-w-full items-center gap-3 font-display text-[0.95rem] text-bone transition-colors hover:text-ember sm:text-xl lg:text-2xl"
                >
                  <Mail className="h-5 w-5 shrink-0 text-ember" />
                  <span className="break-all">{profile.email}</span>
                </a>
              </Magnetic>
            </div>

            <ul className="mt-10 space-y-3 font-mono text-sm">
              <li>
                <a
                  href={`tel:${profile.phoneHref}`}
                  aria-label="Call or message me"
                  className="group inline-flex items-center gap-3 text-bone transition-colors hover:text-ember"
                >
                  <Phone className="h-4 w-4 text-muted transition-colors group-hover:text-ember" />
                  {profile.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile, opens in a new tab"
                  className="group inline-flex items-center gap-3 text-bone transition-colors hover:text-ember"
                >
                  <GithubIcon className="h-4 w-4 text-muted transition-colors group-hover:text-ember" />
                  github.com/m-ahmadaslam
                </a>
              </li>
              <li>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile, opens in a new tab"
                  className="group inline-flex items-center gap-3 text-bone transition-colors hover:text-ember"
                >
                  <LinkedinIcon className="h-4 w-4 text-muted transition-colors group-hover:text-ember" />
                  Muhammad Ahmad Aslam
                </a>
              </li>
              <li>
                <a
                  href={profile.socials.kanz}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kanz AI portfolio entry, opens in a new tab"
                  className="group inline-flex items-center gap-3 text-bone transition-colors hover:text-ember"
                >
                  <Award className="h-4 w-4 text-muted transition-colors group-hover:text-ember" />
                  Kanz AI portfolio (Listen, graded Gold)
                </a>
              </li>
              <li className="inline-flex items-center gap-3 text-muted">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </li>
            </ul>
          </div>

          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
