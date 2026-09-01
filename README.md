# SalesRova static website

A lightweight, dependency-free website for SalesRova, built with semantic HTML, responsive CSS and vanilla JavaScript. It is ready for manual deployment to Netlify and includes a Netlify-compatible consultation form.

## File structure

```text
salesrova-website/
├── index.html                  Main conversion-focused landing page
├── styles.css                 Responsive layout, design system and states
├── script.js                  Navigation, motion and form validation
├── thank-you.html             Custom post-submission confirmation page
├── privacy.html               Customizable privacy-policy draft
├── README.md                  Setup, customization and deployment guide
└── assets/
    ├── favicon.svg            Lightweight placeholder favicon
    └── salesrova-logo.png     Supplied SalesRova logo
```

All source files are complete and use relative paths, so the folder can be moved or deployed as a unit.

## Before publishing

Search the project for `CUSTOMIZE` and square-bracket placeholders. At minimum:

1. Confirm or replace `hello@salesrova.com` in `index.html`, `thank-you.html`, `privacy.html` and the structured data.
2. Add the legal phone and, when available, the specific Oregon city to the JSON-LD block in `index.html`. The state, country and service area are currently set to Oregon, USA.
3. Have the privacy-policy draft reviewed for the locations where the business and its customers operate. Add its effective date and retention policy.
4. Replace the favicon if a final brand icon becomes available.
5. Keep the testimonial section clearly marked as placeholders, or add `hidden` to `<section id="testimonials">` until verified testimonials, names, companies, services and approved photos/logos are available.
6. If the testimonial section is hidden, also remove its navigation links until the section is ready.
7. The site uses Manrope from Google Fonts with rounded system-font fallbacks. If you prefer to avoid an external font request, remove the three Google Fonts `<link>` elements from each HTML page; the layout will continue to work with the fallback stack.

Do not replace placeholders with invented endorsements, awards, statistics, customer identities or performance claims.

## Preview locally

The pages can be opened directly by double-clicking `index.html`, but a small local web server gives a more accurate preview.

### Python

From inside `salesrova-website`:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080/` and test at desktop and mobile widths. Stop the server with `Ctrl+C`.

The Netlify form cannot be processed by Python’s static server. Test its real submission and redirect behavior only after deploying to Netlify.

## Deploy by drag and drop to Netlify

1. Sign in to Netlify and open the team that should own the site.
2. Open **Projects** and use the drag-and-drop area, or visit Netlify Drop.
3. Drag the entire `salesrova-website` folder—not only `index.html`—onto the drop area. `index.html` is already at the folder root and no build step is required.
4. Wait for the first deploy and open the generated `*.netlify.app` address.
5. In **Project configuration**, rename the Netlify project to a suitable unique name if needed. This name becomes the default `project-name.netlify.app` address.
6. For later manual updates, drag the updated folder to the drop zone at the bottom of the project’s **Deploys** page.

Official guide: [Create deploys — drag and drop](https://docs.netlify.com/deploy/create-deploys/)

## Connect the GitHub repository to Netlify

The repository root already contains `index.html`, so Netlify does not need a framework, build command or separate output directory.

1. In Netlify, choose **Add new project → Import an existing project**.
2. Select **GitHub** and authorize Netlify if prompted.
3. Choose the `salesrova-website` repository.
4. Leave **Build command** empty.
5. Set **Publish directory** to `.` or leave it blank if Netlify identifies the repository root automatically.
6. Select **Deploy**.
7. After the first Git-backed deploy, enable form detection and redeploy as described below.

Future pushes to the repository’s `main` branch will trigger new production deploys automatically.

## Connect `salesrova.com` from Namecheap without disrupting email or subdomains

The safest approach for an existing Namecheap DNS zone is to keep Namecheap as the DNS provider and change only the web-hosting records. This avoids a nameserver migration and leaves email/subdomain records in place.

### 1. Record the current DNS zone first

In Namecheap, open **Domain List → Manage → Advanced DNS**. Take screenshots or export/copy every current record before editing anything.

Preserve all unrelated records, especially:

- MX records and the selected mail setting.
- TXT records for SPF, DKIM, DMARC, site verification or other services.
- `mail`, `webmail`, `autodiscover`, calendar and other email-related hosts.
- Existing subdomains such as `app`, `portal`, `blog` or any host not being moved to Netlify.
- SRV and CAA records unless a service provider specifically instructs otherwise.

Do not use **Reset DNS**, do not switch nameservers, and do not create a CNAME at the bare `@` host. A bare-domain CNAME can conflict with mail and TXT records.

### 2. Add the domain in Netlify first

In the SalesRova Netlify project, open **Domain management → Add a domain → Add a domain you already own**, enter `salesrova.com`, and choose **External DNS Provider**. Netlify adds both the apex and `www` versions and displays customized verification instructions.

### 3. Change only the web records at Namecheap

Use Netlify’s **Pending DNS verification** panel as the final source of truth. For Netlify’s standard network, the current recommended Namecheap setup is:

| Type | Host | Value | Purpose |
|---|---|---|---|
| ALIAS | `@` | `apex-loadbalancer.netlify.com` | Sends the bare domain to Netlify while allowing MX/TXT records to coexist |
| CNAME | `www` | `your-project-name.netlify.app` | Sends `www.salesrova.com` to the same Netlify project |

Replace `your-project-name` with the actual Netlify project subdomain. Do not include `https://` or a path.

Remove or replace only conflicting **website** records for the same hosts—typically an old A/AAAA/ALIAS/URL Redirect for `@` and an old A/CNAME/URL Redirect for `www`. Leave MX, TXT and every unrelated subdomain record untouched. If Namecheap does not offer ALIAS for the apex, use Netlify’s documented fallback A record for `@`, currently `75.2.60.5`, after confirming the value in **Pending DNS verification**.

Save changes and allow up to 24–48 hours for global propagation. Netlify will provision HTTPS after DNS resolves correctly. Do not delete additional records merely to speed up certificate creation.

References:

- [Netlify: configure external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/)
- [Netlify: assign a domain](https://docs.netlify.com/manage/domains/manage-domains/assign-a-domain-to-your-site-app/)
- [Namecheap: create a CNAME record](https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/)
- [Namecheap: DNS record types and ALIAS behavior](https://www.namecheap.com/support/knowledgebase/article.aspx/10594/10/all-types-of-dns-records-explained/)

## Enable Netlify form detection and notifications

The consultation form already includes:

- `name="consultation"`
- `method="POST"`
- `data-netlify="true"`
- `data-netlify-honeypot="bot-field"`
- A hidden `form-name` input
- A labeled off-screen honeypot field
- A custom root-relative thank-you action
- Required-field and service-group validation

### Detect the form

1. In the Netlify project, open **Forms**.
2. Select **Enable form detection**.
3. Redeploy the site after enabling detection. Netlify scans static HTML during deployment.
4. Return to **Forms** and confirm that `consultation` appears under active forms.
5. Submit one real test enquiry from the live Netlify URL. Confirm it appears as a verified submission and redirects to `/thank-you.html`.

### Receive email notifications

1. Open **Project configuration → Notifications → Emails and webhooks → Form submission notifications**.
2. Select **Add notification**, choose email, and enter the monitored inbox.
3. Limit the notification to the `consultation` form if the interface offers that choice.
4. Submit another live test and confirm both the dashboard entry and email arrive. The business-email field is named `email`, allowing Netlify to use it as the notification reply-to address.

Netlify filters submissions for spam and the form also uses a honeypot. Review both the verified and spam lists periodically, and set a sensible submission-retention practice because the form collects personal information.

References:

- [Netlify: forms setup and form detection](https://docs.netlify.com/manage/forms/setup/)
- [Netlify: form notifications](https://docs.netlify.com/manage/forms/notifications/)
- [Netlify: spam filters](https://docs.netlify.com/manage/forms/spam-filters/)

## Technical notes

- No package installation, server, framework or build command is required.
- Manrope is the only externally loaded design resource; there are no external JavaScript libraries.
- The website is designed from 320 px upward and includes visible focus states, semantic landmarks, accessible labels, a skip link and reduced-motion support.
- The logo is the supplied PNG and is visually cropped in CSS to account for its transparent canvas. Do not remove the crop wrapper unless the asset is recropped.
- JavaScript enhances navigation, reveal motion and validation; the HTML content and native form submission remain static and Netlify-compatible.
- The privacy page is a customizable draft, not legal advice.
