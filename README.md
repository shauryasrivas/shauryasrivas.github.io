# Shaurya Srivastav — Portfolio Website

Static site — plain HTML, CSS and JavaScript. No build step, no dependencies.
Double-click `index.html` to open it.

All your real details from LinkedIn are already filled in. Only the items under
"Still to do" below are outstanding.

```
index.html        Page content
styles.css        Styling (colours/spacing are tokens at the top)
script.js         Theme toggle, mobile menu, scroll effects, certificate lightbox
photo.jpg         <- ADD THIS
resume.pdf        <- ADD THIS
certificates/     <- ADD your 6 certificate images here
```

## Still to do

### 1. Add your photo
Save your photo as `photo.jpg` in this folder. Then in `index.html`, find the hero
section and replace the whole `<div class="photo-ph">...</div>` block with:

```html
<img src="photo.jpg" alt="Portrait of Shaurya Srivastav">
```

Your LinkedIn profile photo works fine — right-click it and save.

### 2. Add your resume
Save it as `resume.pdf`. The "Resume" button in the nav and the "Download resume"
button in the hero both already point at it. **Put your phone number in the resume,
not on the website.**

### 3. Add your certificate images
Create a `certificates/` folder and save these six files with these exact names:

| File name | Certificate |
| --- | --- |
| `semrush-on-page-seo.jpg` | On-Page SEO and AI Search Essentials (Semrush) |
| `linkedin-keyword-strategy.jpg` | SEO: Keyword Strategy (LinkedIn Learning) |
| `google-cloud-data.jpg` | Store, Process, and Manage Data on Google Cloud |
| `powerbi-skill-india.jpg` | Mastering Power BI (Skill India / PHN) |
| `openai-ai-foundations.jpg` | AI Foundations (OpenAI) |
| `tcs-ion-ai-foundation.jpg` | TCS iON Career Edge — AI Foundation |

Clicking a certificate card opens the image. If a file is missing you'll see a
helpful message rather than a broken image, so the site is safe to publish before
you've added them all.

### 4. Add your verification links
Each certificate card has a "Verify credential" link currently set to `href="#"`.
Replace each `#` with the real URL — on LinkedIn, click "Show credential" on each
certification and copy that link. Recruiters check these, so it's worth the 10 minutes.

### 5. Replace the two practice projects
The Work section has two clearly-marked example cards. Replace them with real work,
or delete the whole `<section id="work">` if you'd rather not show it yet.

Good first projects for your skill set:
- **An SEO audit** of any local business site. Check titles, meta descriptions, headings,
  Core Web Vitals, crawl errors in Search Console, and the backlink profile. Write it up
  as a PDF or a Google Doc and link to it.
- **A keyword research + Power BI dashboard.** Pick a niche, cluster 100+ keywords by
  intent, then visualise volume and difficulty in Power BI. This shows your SEO and your
  data skills in one artifact — exactly the combination your headline promises.

### 6. Make the contact form work
Sign up free at Formspree, Web3Forms or Getform, then paste your endpoint into the
form's `action` in `index.html`:

```html
<form class="card contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

## Publishing (free)

**GitHub Pages** — create a repo, upload these files, then Settings → Pages → Source:
`main`, folder `/root`. Live at `https://yourusername.github.io/reponame`.

**Netlify** — drag this folder onto app.netlify.com/drop. Done in 30 seconds.

**Vercel** — import the GitHub repo.

All three give free HTTPS and a subdomain. A custom domain like `shauryaseo.com` costs
about ₹800/year and is worth it for an SEO portfolio — it's your own proof that you can
set up a site properly.

### SEO tips for your own site
Since you'll be judged on this: the page already has a title tag, meta description,
Open Graph tags, semantic headings, and alt text. After publishing, add the site to
Google Search Console and submit it — then you can screenshot your own indexing as a
talking point in interviews.

## Changing colours

Edit the tokens at the top of `styles.css`. Changing `--accent` restyles the whole site.
If you pick a new accent colour, check white text on it stays above 4.5:1 contrast
(webaim.org/resources/contrastchecker).

Dark mode follows the visitor's system setting and can be toggled in the nav.

## Before you publish

- [ ] `photo.jpg` added and the hero `<img>` swapped in
- [ ] `resume.pdf` added
- [ ] All 6 certificate images added
- [ ] All 6 verify links point at real URLs
- [ ] Work section replaced or deleted
- [ ] Contact form endpoint set
- [ ] Images compressed at tinypng.com (keep each under ~300 KB)
- [ ] Tested on your phone
