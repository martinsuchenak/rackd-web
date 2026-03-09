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

- **IP Address Management** - Track networks, subnets, and IP allocations with conflict detection
- **Device Inventory** - Manage servers, switches, routers, and network devices
- **Network Discovery** - Automated scanning with ARP, SNMP, mDNS, NetBIOS, and LLDP
- **DNS Integration** - Support for Cloudflare, Route53, PowerDNS, Technitium, and BIND
- **Webhooks & Automation** - Event-driven notifications and CI/CD integration
- **MCP Server** - Model Context Protocol for AI tool integration
- **RBAC Security** - Role-based access control with fine-grained permissions

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
Learn how to manage devices, networks, and discover your infrastructure.

### [Features](/features/)
Explore DNS integration, webhooks, custom fields, and more.

### [Interfaces](/interfaces/)
Access Rackd via Web UI, CLI, REST API, or MCP server.

### [Integrations](/integrations/)
Connect with Terraform, Ansible, and monitoring systems.

### [Examples](/examples/)
Sample scripts, workflows, and real-world use cases.

### [Operations](/operations/)
Deploy, backup, secure, and monitor your Rackd instance.

### [Reference](/reference/)
API reference, CLI commands, and configuration options.

### [Development](/development/)
Architecture overview and contributing guidelines.

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
