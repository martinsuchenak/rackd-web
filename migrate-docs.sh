#!/bin/bash

# Migration script for rackd documentation to Hugo structure
# Adds Hugo front matter to existing markdown files

SOURCE_DIR="/Users/martinsuchenak/Devel/projects/rackd/docs"
TARGET_DIR="/Users/martinsuchenak/Devel/projects/rackd-web/content"

# Function to add front matter to a file
add_front_matter() {
    local source_file="$1"
    local target_file="$2"
    local title="$3"
    local description="$4"
    local weight="$5"

    # Create target directory if it doesn't exist
    mkdir -p "$(dirname "$target_file")"

    # Write front matter and content
    cat > "$target_file" << EOF
---
title: "$title"
description: "$description"
weight: $weight
---

EOF

    # Append original content (skip first line if it's a heading)
    tail -n +2 "$source_file" >> "$target_file"

    echo "Migrated: $source_file -> $target_file"
}

# Getting Started
add_front_matter "$SOURCE_DIR/installation.md" "$TARGET_DIR/getting-started/installation.md" "Installation" "Install Rackd on your platform" 1
add_front_matter "$SOURCE_DIR/quickstart.md" "$TARGET_DIR/getting-started/quickstart.md" "Quick Start" "Get up and running with Rackd quickly" 2
add_front_matter "$SOURCE_DIR/configuration.md" "$TARGET_DIR/getting-started/configuration.md" "Configuration" "Configure Rackd for your environment" 3
add_front_matter "$SOURCE_DIR/configuration-reference.md" "$TARGET_DIR/getting-started/configuration-reference.md" "Configuration Reference" "Complete configuration options reference" 4
add_front_matter "$SOURCE_DIR/authentication.md" "$TARGET_DIR/getting-started/authentication.md" "Authentication" "Set up authentication in Rackd" 5
add_front_matter "$SOURCE_DIR/user-authentication.md" "$TARGET_DIR/getting-started/user-authentication.md" "User Authentication" "User authentication and session management" 6

# Guides
add_front_matter "$SOURCE_DIR/devices.md" "$TARGET_DIR/guides/devices.md" "Managing Devices" "Track and manage your infrastructure devices" 1
add_front_matter "$SOURCE_DIR/networks.md" "$TARGET_DIR/guides/networks.md" "Network Management" "Manage networks, subnets, and IP allocations" 2
add_front_matter "$SOURCE_DIR/datacenters.md" "$TARGET_DIR/guides/datacenters.md" "Datacenters" "Organize devices by datacenter location" 3
add_front_matter "$SOURCE_DIR/discovery.md" "$TARGET_DIR/guides/discovery.md" "Discovery & Scanning" "Automated network discovery and device scanning" 4
add_front_matter "$SOURCE_DIR/relationships.md" "$TARGET_DIR/guides/relationships.md" "Device Relationships" "Track dependencies between devices" 5
add_front_matter "$SOURCE_DIR/lifecycle.md" "$TARGET_DIR/guides/lifecycle.md" "Device Lifecycle" "Manage device lifecycle status" 6
add_front_matter "$SOURCE_DIR/reservations.md" "$TARGET_DIR/guides/reservations.md" "IP Reservations" "Reserve IP addresses for future use" 7
add_front_matter "$SOURCE_DIR/conflicts.md" "$TARGET_DIR/guides/conflicts.md" "Conflict Detection" "Detect and resolve IP conflicts" 8

# Features
add_front_matter "$SOURCE_DIR/dns.md" "$TARGET_DIR/features/dns.md" "DNS Integration" "Integrate with DNS providers" 1
add_front_matter "$SOURCE_DIR/webhooks.md" "$TARGET_DIR/features/webhooks.md" "Webhooks & Events" "Event-driven automation with webhooks" 2
add_front_matter "$SOURCE_DIR/custom-fields.md" "$TARGET_DIR/features/custom-fields.md" "Custom Fields" "Define custom metadata for devices and networks" 3
add_front_matter "$SOURCE_DIR/circuits.md" "$TARGET_DIR/features/circuits.md" "Circuit Tracking" "Track network circuits and providers" 4
add_front_matter "$SOURCE_DIR/nat.md" "$TARGET_DIR/features/nat.md" "NAT Management" "Manage NAT pools and mappings" 5
add_front_matter "$SOURCE_DIR/dashboard.md" "$TARGET_DIR/features/dashboard.md" "Dashboard & Analytics" "Visualize your infrastructure" 6
add_front_matter "$SOURCE_DIR/rbac.md" "$TARGET_DIR/features/rbac.md" "Role-Based Access Control" "Fine-grained permissions with RBAC" 7
add_front_matter "$SOURCE_DIR/fts.md" "$TARGET_DIR/features/fts.md" "Full-Text Search" "Search across all entities" 8

# Interfaces
add_front_matter "$SOURCE_DIR/webui.md" "$TARGET_DIR/interfaces/webui.md" "Web UI" "Navigate the Rackd web interface" 1
add_front_matter "$SOURCE_DIR/cli.md" "$TARGET_DIR/interfaces/cli.md" "CLI Reference" "Command-line interface documentation" 2
add_front_matter "$SOURCE_DIR/api.md" "$TARGET_DIR/interfaces/api.md" "REST API" "REST API documentation and examples" 3
add_front_matter "$SOURCE_DIR/mcp.md" "$TARGET_DIR/interfaces/mcp.md" "MCP Server" "Model Context Protocol for AI tool integration" 4

# Operations
add_front_matter "$SOURCE_DIR/deployment.md" "$TARGET_DIR/operations/deployment.md" "Deployment Guide" "Deploy Rackd in production" 1
add_front_matter "$SOURCE_DIR/backup.md" "$TARGET_DIR/operations/backup.md" "Backup & Restore" "Backup and restore procedures" 2
add_front_matter "$SOURCE_DIR/security.md" "$TARGET_DIR/operations/security.md" "Security Hardening" "Secure your Rackd installation" 3
add_front_matter "$SOURCE_DIR/monitoring.md" "$TARGET_DIR/operations/monitoring.md" "Monitoring" "Monitor Rackd with Prometheus" 4
add_front_matter "$SOURCE_DIR/ratelimit.md" "$TARGET_DIR/operations/ratelimit.md" "Rate Limiting" "Configure API rate limiting" 5
add_front_matter "$SOURCE_DIR/audit.md" "$TARGET_DIR/operations/audit.md" "Audit Logging" "Track changes with audit logs" 6
add_front_matter "$SOURCE_DIR/troubleshooting.md" "$TARGET_DIR/operations/troubleshooting.md" "Troubleshooting" "Common issues and solutions" 7

# Reference
add_front_matter "$SOURCE_DIR/api.md" "$TARGET_DIR/reference/api.md" "API Reference" "Complete REST API reference" 1
add_front_matter "$SOURCE_DIR/cli.md" "$TARGET_DIR/reference/cli.md" "CLI Commands" "Complete CLI command reference" 2
add_front_matter "$SOURCE_DIR/configuration-reference.md" "$TARGET_DIR/reference/configuration.md" "Configuration Reference" "Complete configuration options" 3
add_front_matter "$SOURCE_DIR/database.md" "$TARGET_DIR/reference/database.md" "Database Schema" "Database schema reference" 4

# Development
add_front_matter "$SOURCE_DIR/architecture.md" "$TARGET_DIR/development/architecture.md" "Architecture" "System architecture overview" 1
add_front_matter "$SOURCE_DIR/development.md" "$TARGET_DIR/development/contributing.md" "Contributing" "Contribute to Rackd" 2
add_front_matter "$SOURCE_DIR/testing.md" "$TARGET_DIR/development/testing.md" "Testing" "Testing guidelines and practices" 3
add_front_matter "$SOURCE_DIR/database.md" "$TARGET_DIR/development/database.md" "Database Development" "Database design and migrations" 4
add_front_matter "$SOURCE_DIR/import-export.md" "$TARGET_DIR/development/import-export.md" "Import & Export" "Data import and export functionality" 5

echo "Migration complete!"
