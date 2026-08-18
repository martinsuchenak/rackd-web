---
title: "Rackd Documentation"
description: "Open-source IP Address Management (IPAM) and Device Inventory System"
weight: 1
---

<section class="hero">
  <h1>Rackd Documentation</h1>
  <p class="subtitle">Open-source IP Address Management and Device Inventory System</p>
</section>

## What is Rackd?

Rackd is a lightweight, self-contained IPAM and device inventory system built with Go and SQLite. It provides a comprehensive solution for managing your infrastructure with no external dependencies.

### Key Features

- **IP Address Management** - Track networks, subnets, pools, and reservations with conflict detection
- **Device Inventory** - Manage servers, switches, routers, and network devices with custom fields, relationships, and full-text search
- **Network Discovery** - Scheduled and profile-driven scanning with ARP, SNMP, mDNS, NetBIOS, LLDP, banner grabbing and OS fingerprinting
- **DNS Integration** - Technitium DNS Server integration with record sync, promotion and PTR generation (PowerDNS/BIND planned)
- **Circuits & NAT** - Document physical circuits and NAT mappings alongside your inventory
- **Webhooks & Automation** - Signed event notifications and CI/CD integration
- **MCP Server + OAuth 2.1** - Model Context Protocol for AI tool integration, with PKCE authorization and permission-clamped scopes
- **RBAC Security** - Role-based access control with fine-grained permissions and a full audit log

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

## Documentation Sections

<div class="section-grid">

### [Getting Started](/getting-started/)
Install, configure, and get up and running with Rackd quickly.

### [User Guides](/guides/)
Manage devices, networks, DNS, discovery, RBAC and more.

### [Interfaces](/interfaces/)
Access Rackd via Web UI, CLI, REST API, or MCP server.

### [Examples](/examples/)
Sample scripts, workflows, and real-world use cases.

### [Operations](/operations/)
Deploy, backup, secure, and monitor your Rackd instance.

</div>

## Why Rackd?

| Feature | Benefit |
|---------|---------|
| **Zero Dependencies** | Single binary with embedded SQLite - no external database required |
| **CGO-Free** | Pure Go compilation for easy cross-platform deployment |
| **Self-Contained** | Everything you need in one package |
| **Open Source** | MIT licensed and community-driven |
| **Modern UI** | Responsive web interface with dark mode support |
| **Full API** | REST API for automation and integration |

## Community

- **GitHub**: [github.com/martinsuchenak/rackd](https://github.com/martinsuchenak/rackd)
- **Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
