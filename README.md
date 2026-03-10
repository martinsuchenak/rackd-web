# Rackd Documentation

Official documentation site for [Rackd](https://github.com/martinsuchenak/rackd) - an open-source IP Address Management and Device Inventory System.

Built with [Hugo](https://gohugo.io/) and the [Docstone](https://github.com/martinsuchenak/docstone) theme.

## Development

### Prerequisites

- [Hugo v0.120.0+](https://gohugo.io/installation/) (extended version)
- [Node.js 18+](https://nodejs.org/)

### Setup

```bash
# Clone with submodules
git clone --recursive https://github.com/martinsuchenak/rackd-web.git

# Or if already cloned, initialize submodules
git submodule update --init --recursive

# Install dependencies
npm install
```

### Local Development

```bash
# Start the development server
npm run dev

# Or use Hugo directly
hugo server -D --navigateToChanged

# Open http://localhost:1313
```

### Build

```bash
# Build for production (includes search indexing)
npm run build

# Output will be in public/ directory
```

The build process:
1. Hugo generates the static site
2. Pagefind indexes the content for search

## Deployment

Configured for Cloudflare Pages with automatic deployments.

### Build Configuration

- **Build command:** `npm run build`
- **Build output directory:** `public`
- **Environment variables:**
  - `HUGO_VERSION`: `0.157.0`
  - `NODE_VERSION`: `18`

## Project Structure

```
rackd-web/
├── content/              # Markdown documentation
│   ├── docs/            # Main documentation
│   │   ├── introduction/
│   │   ├── deployment/
│   │   ├── network-inventory/
│   │   ├── integrations/
│   │   ├── administration/
│   │   └── advanced/
│   ├── getting-started/
│   ├── guides/
│   ├── interfaces/
│   └── operations/
├── layouts/             # Site-specific template overrides
│   ├── _default/
│   └── partials/
├── themes/docstone/     # Theme submodule
├── static/              # Static assets
├── hugo.toml            # Hugo configuration
└── package.json         # Node dependencies
```

## Theme

Uses the [Docstone](https://github.com/martinsuchenak/docstone) theme via git submodule.

Features:
- Dark/light/system theme modes
- Responsive sidebar navigation
- Full-text search with Pagefind
- Accessible components (keyboard navigation, ARIA labels)
- Mobile-friendly

### Updating the Theme

```bash
cd themes/docstone
git pull origin main
cd ../..
git add themes/docstone
git commit -m "Update Docstone theme"
```

## Content Guidelines

- Use front matter for page metadata (title, description, weight)
- Add `category` to group related pages in list views
- Use shortcodes for notices, tabs, API endpoints, and diagrams

## License

MIT License - see [LICENSE](LICENSE) for details.

