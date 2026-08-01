# Parsa Moloudi · Personal Portfolio

A responsive, dependency-free portfolio built with semantic HTML, modern CSS, and vanilla JavaScript.

## Design

- Dark navy visual system with cyan, blue, purple, and pink RGB lighting
- Responsive custom illustrations for Task Manager, B2B analytics, Homa.js, and Jantech
- Scroll reveals, reading progress, active navigation, cursor lighting, counters, and subtle depth
- Mobile navigation, keyboard support, reduced-motion support, and print-friendly résumé
- No framework, bundler, runtime dependency, or generated image asset required

## Content sources

The project and skills copy was researched from Parsa's public GitHub repositories and locally reviewed project structure:

- [GitHub profile](https://github.com/parsamoloody)
- [Task Manager](https://github.com/parsamoloody/taks_manager)
- [Homa.js](https://github.com/parsamoloody/homa)
- [Jantech V2](https://github.com/parsamoloody/jantech-v2)
- Local B2B ad monetization platform modules under `Documents/adymob`

No private credentials, endpoints, customer data, or business figures were copied into the site. Numbers shown inside the B2B dashboard illustration are decorative mock data.

## One detail to customize

Age is shown as **Private** because no reliable public source provided it. Replace the two `Age` values in `index.html` and `resume.html` if you want to publish it.

The public GitHub profile does not expose an email address, so the contact call-to-action uses LinkedIn and GitHub instead of inventing one.

## Run locally

```bash
cd /home/parsa/personal-portfolio
python3 -m http.server 4173
```

Open <http://127.0.0.1:4173>.

## Files

- `index.html` contains the portfolio structure and content
- `styles.css` contains the complete responsive design and illustrations
- `script.js` contains progressive interactions
- `resume.html` is a printable résumé with a Save as PDF action

## Recommended deployment

This site can be deployed directly to GitHub Pages, Cloudflare Pages, Netlify, or Vercel as a static directory. No build command is needed.
