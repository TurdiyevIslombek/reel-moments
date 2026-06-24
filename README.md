# Ponix Corner — Parties & Events Filming Website

A modern, light, editorial-style responsive landing page / portfolio.

## File structure

```
Order/
├── index.html        # Page content + all SEO meta tags
├── css/
│   └── style.css     # All styling (light theme — edit colours at the top)
├── js/
│   └── script.js     # Animations, mobile menu, video popup, form
├── robots.txt        # Lets Google crawl the site
├── sitemap.xml       # Helps Google index it
└── README.md         # This file
```

## Customise (find & replace)

| Find                         | Replace with                                 |
| ---------------------------- | -------------------------------------------- |
| `https://www.ponixcorner.com`| Your real domain (after deploy)              |
| `info@ponixcorner.com`       | Your real email address                      |
| `971525301054`               | WhatsApp number, intl. format, no `+` or `0` |
| `picsum.photos/...`          | Your real event photos                       |
| `pravatar.cc/...`            | Your real team photos                        |
| `data-video="aqz-KE-bpKQ"`   | Your real YouTube video IDs                  |

Your **WhatsApp (`+971 52 530 1054`)** and **landline (`(04) 576 1731`)** are already wired in.
Brand colours live at the top of `css/style.css` in the `:root { }` block — change `--accent`
(the gold) to recolour the whole site.

## About the contact form / email

The email links and the form use a `mailto:` link, which opens the **visitor's own email app**.
It does NOT send to you automatically. To receive submissions straight to your inbox, create a
free form at https://formspree.io and replace the form with:

```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

## Preview locally

Double-click `index.html`, or run:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

See the GitHub + Vercel steps provided with this project.
