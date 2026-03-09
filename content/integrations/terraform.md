---
title: "Terraform Provider"
description: "Manage Rackd resources with Terraform"
weight: 1
---

# Terraform Provider

Use the Rackd Terraform provider to manage your infrastructure as code.

## Installation

Add the Rackd provider to your Terraform configuration:

```hcl
terraform {
  required_providers {
    rackd = {
      source  = "martinsuchenak/rackd"
      version = "~> 1.0"
    }
  }
}

provider "rackd" {
  host    = "https://rackd.example.com"
  api_key = var.rackd_api_key
}
```

## Authentication

The provider supports multiple authentication methods:

### API Key

```hcl
provider "rackd" {
  host    = "https://rackd.example.com"
  api_key = var.rackd_api_key
}
```

### Environment Variables

```bash
export RACKD_HOST="https://rackd.example.com"
export RACKD_API_KEY="your-api-key"
```

## Resources

### Device Resource

Manage devices in Rackd:

```hcl
resource "rackd_device" "web_server" {
  hostname     = "web-server-01"
  datacenter   = "dc1"
  status       = "active"

  ip_addresses = [
    {
      address = "192.168.1.10"
      primary = true
    }
  ]

  tags = ["web", "production"]

  custom_fields = {
    owner       = "team-infra"
    cost_center = "12345"
  }
}
```

### Network Resource

Manage networks and subnets:

```hcl
resource "rackd_network" "production" {
  name        = "Production Network"
  cidr        = "192.168.1.0/24"
  datacenter  = "dc1"
  vlan_id     = 100

  pools = [
    {
      name      = "DHCP Pool"
      start_ip  = "192.168.1.100"
      end_ip    = "192.168.1.200"
    }
  ]
}
```

### Datacenter Resource

Manage datacenter locations:

```hcl
resource "rackd_datacenter" "primary" {
  name        = "Primary Datacenter"
  description = "Main production datacenter"
  location    = "US-East"
}
```

## Data Sources

### Device Data Source

Query existing devices:

```hcl
data "rackd_device" "web_server" {
  hostname = "web-server-01"
}

output "device_ip" {
  value = data.rackd_device.web_server.primary_ip
}
```

### Network Data Source

Query networks:

```hcl
data "rackd_network" "production" {
  name = "Production Network"
}

output "network_gateway" {
  value = data.rackd_network.production.gateway
}
```

### Next Available IP

Get the next available IP from a network:

```hcl
data "rackd_next_ip" "next_available" {
  network_name = "Production Network"
}

resource "rackd_device" "new_server" {
  hostname = "new-server-01"
  ip_addresses = [
    {
      address = data.rackd_next_ip.next_available.address
      primary = true
    }
  ]
}
```

## Example: Complete Infrastructure

```hcl
# Create datacenter
resource "rackd_datacenter" "dc1" {
  name     = "Datacenter 1"
  location = "US-East-1"
}

# Create network
resource "rackd_network" "app_network" {
  name       = "Application Network"
  cidr       = "10.0.1.0/24"
  datacenter = rackd_datacenter.dc1.id
  vlan_id    = 100
}

# Create devices
resource "rackd_device" "app_servers" {
  count = 3

  hostname   = "app-server-${count.index + 1}"
  datacenter = rackd_datacenter.dc1.id
  status     = "active"

  ip_addresses = [
    {
      address = cidrhost(rackd_network.app_network.cidr, 10 + count.index)
      primary = true
    }
  ]

  tags = ["application", "production"]
}
```

## Import Existing Resources

Import existing Rackd resources into Terraform state:

```bash
# Import a device
terraform import rackd_device.web_server device-id

# Import a network
terraform import rackd_network.production network-id
```
