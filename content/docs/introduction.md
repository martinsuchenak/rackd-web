---
title: "What is Rackd?"
description: "Overview of Rackd's features and architecture"
weight: 1
---

Rackd is a lightweight, self-contained IPAM (IP Address Management) and device inventory system built with Go and SQLite. It provides a comprehensive solution for managing your infrastructure with no external dependencies.

## Key Features

- **IP Address Management** - Track networks, subnets, and IP allocations with conflict detection
- **Device Inventory** - Manage servers, switches, routers, and network devices
- **Network Discovery** - Automated scanning with multiple protocols
- **DNS Integration** - Sync with Cloudflare, Route53, PowerDNS, Technitium, and BIND
- **Webhooks & Automation** - Event-driven notifications and CI/CD integration
- **MCP Server** - Model Context Protocol for AI tool integration
- **RBAC Security** - Role-based access control with fine-grained permissions

## Why Rackd?

| Feature | Benefit |
|---------|---------|
| **Zero Dependencies** | Single binary with embedded SQLite - no external database required |
| **CGO-Free** | Pure Go compilation for easy cross-platform deployment |
| **Self-Contained** | Everything you need in one package |
| **Open Source** | MIT licensed and community-driven |
| **Modern UI** | Responsive web interface with dark mode support |
| **Full API** | REST API for automation and integration |

## Use Cases

- **Home Labs** - Track your homelab infrastructure and IP allocations
- **Small Business** - Manage office networks and devices
- **MSPs** - Multi-tenant device and network management
- **DevOps Teams** - Infrastructure as code with API integration
- **Network Engineers** - IPAM with automated discovery

## Quick Start

```bash
# Download the latest release
curl -LO https://github.com/martinsuchenak/rackd/releases/latest/download/rackd-$(uname -s)-$(uname -m)

# Make it executable
chmod +x rackd-*

# Start the server
./rackd-* server
```

The web interface will be available at `http://localhost:8080`.

## Next Steps

- [Installation](/getting-started/installation/) - Detailed installation guide
- [Configuration](/getting-started/configuration/) - Configure Rackd for your environment
- [Quickstart](/getting-started/quickstart/) - Get up and running in 5 minutes
