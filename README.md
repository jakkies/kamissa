# Kamissa Coaching – static site

A static, mobile-first site built with plain HTML, CSS and vanilla JS. There's no build step: open `index.html` or serve the folder with any static server.

```
python3 -m http.server 5173   # then visit http://localhost:5173
```

## Files

```
index.html          Home page, one section per <section> (ids match the nav links)
about-kim.html      About Kim page (same header, footer, CSS and JS as the home page)
qec.html            Quantum Energy Coaching page (includes a YouTube embed)
css/styles.css      Design tokens (top of file), then styles grouped by section
js/main.js          Booking link, mobile menu, sticky header, smooth scroll, reveal-on-scroll,
                    image placeholders, testimonial controls
images/             Photos + favicon.svg
```

## Swapping images

Drop the real photos into `images/` using these exact names. Each slot has a fixed aspect ratio, so other sizes are cropped to fit (`object-fit: cover`) and the layout won't shift.

| File | Section | Slot ratio | Suggested size |
| --- | --- | --- | --- |
| `hero-coast.jpg` | Hero background | full-bleed | 2400 × 1260+ |
| `kim-portrait.jpg` | The Oasis | 4 : 5 | 1000 × 1250 |
| `kim-seated.jpg` | About Kim | 5 : 4 | 1250 × 1000 |
| `kintsugi-bowl.jpg` | Kintsugi | 4 : 3 | 1200 × 900 |
| `teddy.jpg` | Meet Teddy | 1 : 1 | 1000 × 1000 |
| `workshop.jpg` | Workshops & Courses | 4 : 3 (shown in greyscale) | 1200 × 900 |
| `cta-bg.jpg` | Final CTA background | full-bleed | 1920 × 1080 |

Until a file exists, its slot shows a tinted block with the expected filename. If a photo's subject is off-centre, add an `object-position` (e.g. `style="object-position: 50% 20%"`) to that `<img>`. After swapping a photo, update its `alt` text in `index.html` to describe the real image.

## Adding inner pages

`about-kim.html` is the template for further pages. Copy it, keep the header with `site-header--solid` (inner pages have no dark hero behind the header), set `aria-current="page"` on the matching nav and footer link, and link to home sections as `index.html#section-id`. The header and footer are repeated in each file, so a nav change has to be made in every page.

## Other things to replace

- **Booking link**: change `BOOKING_URL` at the top of `js/main.js`. Every "Book…" button (`data-book`) picks it up, and external URLs open in a new tab. Without JS, the buttons fall back to the `#book` anchor on the final CTA.
- **Placeholder buttons**: "View workshops & courses" and "Explore resources" currently link to their own sections. ("Meet Kim", "Discover our story" and the About Kim nav link go to `about-kim.html`; "The Approach", "Discover QEC" and "Understand the approach" go to `qec.html`.) Point them at real pages when those exist.
- **Testimonials**: duplicate the `<figure class="testimonial">` in the testimonials section. Prev/next buttons appear automatically when there's more than one.
- **Open Graph**: set `og:url` and `og:image` in `<head>` to absolute URLs on the live domain.
- **CTA disclaimer** text.
- **Logo / favicon**: the header logo is `images/kamissa-logo.png` (600 px wide, transparent; CSS turns it white over the home hero). The footer uses `images/kamissa-logo-white.png`, a 600 px copy of `Kamissa-Coaching-logo-white.png`. `images/favicon.svg` is still a placeholder.

## Notes

- Colours are CSS custom properties in `:root`. `--teal-ink` and `--muted` are slightly darker than the mockup tones so small text passes WCAG AA on cream and sand.
- Breakpoints: 640px, 900px and 1200px for layout. The full desktop nav needs about 1180px, so it switches from the hamburger at 1280px.
- Reveal animations only run when JS is available and the visitor hasn't asked for reduced motion.
