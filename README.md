# Rackd Website

This is the official website for [Rackd](https://github.com/martinsuchenak/rackd), built with [Hugo](https://gohugo.io/).

## Development

### Prerequisites

- [Hugo v0.156.0+](https://gohugo.io/installation/) (extended version)

### Local Development

```bash
# Start the development server
hugo server -D

# Open http://localhost:1313
```

### Build

```bash
# Build for production
hugo --minify
```

Output will be in the `public/` directory.

## Deployment

This site is configured for automatic deployment to Cloudflare Pages.

### Cloudflare Pages Configuration

- **Build command:** `hugo --minify`
- **Build output directory:** `public`
- **Root directory:** `/` (or leave empty)
- **Environment variables:**
  - `HUGO_VERSION`: `0.156.0`

## Project Structure

```
rackd-web/
├── content/              # Markdown content
│   ├── docs/            # Documentation pages
│   └── installation.md  # Installation guide
├── themes/rackd/      # Custom theme
│   ├── assets/          # CSS, JS, images
│   ├── layouts/         # HTML templates
│   └── static/          # Static files
├── hugo.yaml            # Hugo configuration
└── README.md            # This file
```

## Theme Features

- Responsive design
- Dark mode support
- Minimal dependencies
- Fast loading

## License

MIT License - see [LICENSE](LICENSE) for details.
