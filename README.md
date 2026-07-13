# Sunrise Multispecialty Hospital — Website

A complete, responsive front-end for a fictional hospital ("Sunrise Multispecialty Hospital", Warangal, Telangana), built with HTML5, CSS3, and vanilla JavaScript, plus a PHP/MySQL scaffold for the appointment form.

## What's fully working (open `index.html` in any browser — no build step needed)

- **12 pages**: Home, About, Departments, Doctors, Services, Online Appointment, Health Packages, Gallery, Health Blog, Contact, Patient Login, Doctor Login.
- Sticky nav, mobile menu, live search box (routes to blog search), department/doctor filtering.
- Dark mode toggle (saved across visits), English/Telugu language toggle (saved across visits) — covers nav, footer, hero and key CTAs; extend `data-en` / `data-te` attributes in the HTML to translate more copy.
- Emergency call button and WhatsApp floating button (update the phone number in `js` calls and `tel:`/`wa.me` links across the HTML files).
- Appointment form with department → doctor dependent dropdown, Google Map embed, newsletter box, social links.
- Scroll-reveal animations, hover states, `prefers-reduced-motion` support, visible focus states, skip-to-content link.
- Basic on-page SEO: per-page titles/descriptions, Open Graph tags, a Hospital schema.org JSON-LD block, `sitemap.xml`, `robots.txt`.

All form submissions (appointment, contact, newsletter, login) currently show a **demo success message in the browser** — see "Backend" below to make them real.

## Folder structure

```
hospital-website/
├── index.html, about.html, departments.html, doctors.html, services.html,
│   appointment.html, health-packages.html, gallery.html, blog.html,
│   contact.html, login-patient.html, login-doctor.html
├── css/style.css        — full design system (colors, type, components, dark mode, responsive rules)
├── js/script.js          — nav, search, dark mode, language toggle, filters, reveal animations, demo form handling
├── backend-scaffold/     — starter PHP + MySQL for the appointment form (see below)
├── build.py              — the generator script used to produce the HTML pages (edit this, not the HTML, to make sitewide changes)
├── sitemap.xml, robots.txt
```

Because every page shares the same header/footer, **edit `build.py` and re-run `python3 build.py`** for sitewide changes (e.g. phone number, address, nav items) rather than hand-editing all 12 HTML files individually.

## What's scaffolded, not production-ready

The brief asked for several features that need a real server, database, and hosting — these can't be "complete" in a static download. Here's what's included as a starting point, and what a developer still needs to do:

| Feature | What's included | What's still needed |
|---|---|---|
| Appointment form → database | `backend-scaffold/appointment-submit.php` + `schema.sql` | Deploy to a PHP+MySQL server, fill in real DB credentials, add SMS/email confirmation |
| Patient / Doctor login | Full UI (`login-patient.html`, `login-doctor.html`) | Real authentication (password hashing, sessions), a `patients`/`doctors` accounts table |
| Report download | UI button | File storage + auth-gated download endpoint |
| Online bill payment | UI button | Integration with a payment gateway (Razorpay/PayU/Stripe are common in India) |
| SSL | N/A (static files) | Your hosting provider issues this (e.g. free via Let's Encrypt) once the site is on a live domain |
| WordPress | N/A | This is a static HTML/CSS/JS build; converting to a WordPress theme means splitting the header/footer into `header.php`/`footer.php` and wiring content into the WP loop — a separate project from this one |

## Running the PHP scaffold locally

```bash
# 1. Import the schema
mysql -u root -p < backend-scaffold/schema.sql

# 2. Set DB credentials as environment variables (or edit config.php directly for local testing)
export DB_HOST=localhost DB_NAME=sunrise_hospital DB_USER=root DB_PASS=yourpassword

# 3. Serve the whole folder with PHP's built-in server
php -S localhost:8000
```

Then open `http://localhost:8000` — the appointment form on `appointment.html` will POST to `backend-scaffold/appointment-submit.php` and insert a row into the `appointments` table.

## Before going live — a checklist

- [ ] Replace all placeholder content: hospital name, address, phone numbers, doctor names/photos, testimonials.
- [ ] Replace Unsplash stock photos with your hospital's real photography (update `src` attributes — search `images.unsplash.com` in the HTML to find them all).
- [ ] Swap the Google Maps embed URL for your exact address (currently centered on "Warangal, Telangana" generally).
- [ ] Point `wa.me/919876543210` and `tel:+919876543210` links at your real numbers.
- [ ] Add real SSL hosting and a real domain (update `sitemap.xml`, `robots.txt`, and the canonical/OG URLs in `build.py`).
- [ ] Have a licensed developer review the PHP scaffold for security (input sanitization, CSRF, rate limiting) before accepting real patient data.
