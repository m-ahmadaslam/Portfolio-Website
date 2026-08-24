# Security Policy

This repository powers a personal portfolio site. There is no authentication and
no user account system. The contact form delivers mail client-side via EmailJS
and additionally POSTs to an optional server route (`/api/contact`) that stays
inert until a database is configured. Security reports are still welcome.

## Reporting a vulnerability

Please do not open a public issue for security problems.

Email **muhammad.ahmadaslam2003@gmail.com** with:

- a description of the issue and where it lives (URL, route, or file),
- steps to reproduce or a proof of concept,
- the impact you believe it has.

I aim to acknowledge reports within 72 hours and to fix confirmed issues as
quickly as the severity warrants. Good-faith research is appreciated. Please
avoid privacy violations, data destruction, or service degradation while
testing.

## Scope

In scope: this repository's code, the optional `/api/contact` route, and the
deployed site.

Out of scope: third-party services the site links to or embeds (GitHub, Vercel,
EmailJS, Google reCAPTCHA), which run their own disclosure programs.
