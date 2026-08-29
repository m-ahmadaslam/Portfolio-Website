import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { profile } from "@/content/site";
import "./globals.css";

// fraunces (editorial serif) for display, jetbrains mono for terminals/labels, inter for body
const display = Fraunces({
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body-src",
  subsets: ["latin"],
  display: "swap",
});

// TODO: update to your custom domain once DNS is live (currently the Vercel URL).
const siteUrl = "https://ahmadaslam-portfolio-website.vercel.app";
const description =
  "Muhammad Ahmad Aslam is an AI full-stack software developer working across the MERN stack, Next.js, and applied machine learning, from real-time AI systems to production web apps. Computer Science graduate based in Riyadh.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Ahmad Aslam · AI Full-Stack Developer",
    template: "%s · Ahmad Aslam",
  },
  description,
  keywords: [
    "Muhammad Ahmad Aslam",
    "Ahmad Aslam",
    "AI Full-Stack Developer",
    "Full-Stack Developer",
    "MERN",
    "Next.js",
    "Machine Learning",
    "RAG",
    "Agentic AI",
    "React",
    "TypeScript",
    "Riyadh",
  ],
  authors: [{ name: "Muhammad Ahmad Aslam", url: siteUrl }],
  creator: "Muhammad Ahmad Aslam",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    locale: "en_US",
    title: "Muhammad Ahmad Aslam · AI Full-Stack Developer",
    description:
      "AI full-stack developer across the MERN stack, Next.js, and applied machine learning, from real-time AI systems to production web apps.",
    siteName: "Muhammad Ahmad Aslam",
    images: [
      {
        url: "/og-image.png",
        width: 2560,
        height: 1280,
        alt: "Muhammad Ahmad Aslam, AI full-stack software developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Ahmad Aslam · AI Full-Stack Developer",
    description:
      "AI full-stack developer across the MERN stack, Next.js, and applied machine learning, from real-time AI systems to production web apps.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
};

// structured data so the personal brand can surface a rich result
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Muhammad Ahmad Aslam",
      alternateName: ["Ahmad Aslam", "Muhammad Ahmad"],
      url: siteUrl,
      jobTitle: "AI Full-Stack Software Developer",
      email: profile.email,
      description,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Bahria University",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Riyadh",
        addressCountry: "SA",
      },
      image: `${siteUrl}/assets/portrait.jpg`,
      sameAs: [
        profile.socials.github,
        profile.socials.linkedin,
        "https://try.ka.nz/ai/muhammadaslam",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Muhammad Ahmad Aslam",
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      style={{ backgroundColor: "#0a0a0f" }}
      className={`${display.variable} ${mono.variable} ${body.variable}`}
    >
      <body className="min-h-dvh font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Providers>
          <Nav />
          {children}
          <Footer />
        </Providers>
        <Analytics />
        {/* paused while over the hobby quota; uncomment to resume collection */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
