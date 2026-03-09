---
title: "IPAM Workflows"
description: "Common IP address management workflows and patterns"
weight: 1
---

# IPAM Workflows

Common workflows for IP address management in Rackd.

## Initial Network Setup

### Create a Network Hierarchy

Start by organizing your IP space:

```bash
# Create datacenter
rackd datacenter add --name "Primary DC" --location "US-East"

# Create management network
rackd network add \
  --name "Management Network" \
  --cidr "10.0.0.0/24" \
  --datacenter "Primary DC" \
  --vlan-id 10

# Create production network
rackd network add \
  --name "Production Network" \
  --cidr "10.0.1.0/24" \
  --datacenter "Primary DC" \
  --vlan-id 100

# Create DMZ network
rackd network add \
  --name "DMZ Network" \
  --cidr "10.0.2.0/24" \
  --datacenter "Primary DC" \
  --vlan-id 200
```

### Create IP Pools

Define pools for different purposes:

```bash
# DHCP pool for dynamic allocation
rackd network pool add \
  --network "Production Network" \
  --name "DHCP Pool" \
  --start-ip "10.0.1.100" \
  --end-ip "10.0.1.200"

# Static pool for servers
rackd network pool add \
  --network "Production Network" \
  --name "Static Pool" \
  --start-ip "10.0.1.10" \
  --end-ip "10.0.1.50"
```

## IP Allocation Workflows

### Allocate Next Available IP

```bash
# Get next IP from a network
NEXT_IP=$(rackd network next-ip --name "Production Network")
echo "Allocated: $NEXT_IP"

# Create device with allocated IP
rackd device add \
  --hostname "web-server-01" \
  --ip "$NEXT_IP" \
  --datacenter "Primary DC"
```

### Reserve IPs for Planning

```bash
# Reserve an IP for future use
rackd reservation add \
  --ip "10.0.1.15" \
  --description "Reserved for new database server" \
  --owner "DBA Team"

# List reservations
rackd reservation list

# Remove reservation when ready to use
rackd reservation delete --ip "10.0.1.15"
```

### Bulk IP Allocation

```bash
#!/bin/bash
# allocate-range.sh

NETWORK="Production Network"
START=10
COUNT=5

for i in $(seq $START $((START + COUNT - 1))); do
  IP="10.0.1.$i"
  rackd device add \
    --hostname "server-$i" \
    --ip "$IP" \
    --datacenter "Primary DC" \
    --status "planned"
  echo "Allocated $IP to server-$i"
done
```

## Conflict Management

### Detect Conflicts

```bash
# Run conflict detection
rackd conflict scan

# List all conflicts
rackd conflict list

# Get conflict details
rackd conflict get --id "conflict-123"
```

### Resolve Conflicts

```bash
# Option 1: Reassign the duplicate IP
rackd device update \
  --hostname "server-02" \
  --ip "10.0.1.51"

# Option 2: Delete the conflicting device
rackd device delete --hostname "duplicate-device"

# Mark conflict as resolved
rackd conflict resolve --id "conflict-123" --action "reassigned"
```

## Network Segmentation

### VLAN Organization

```bash
# Create VLAN-based networks
for vlan in 10 20 30 40 50; do
  rackd network add \
    --name "VLAN $vlan Network" \
    --cidr "10.1.$vlan.0/24" \
    --vlan-id $vlan \
    --datacenter "Primary DC"
done
```

### Subnet Allocation

```bash
# Allocate /24 from larger network
rackd network add \
  --name "Team A Subnet" \
  --cidr "10.10.1.0/24" \
  --parent "10.10.0.0/16"

rackd network add \
  --name "Team B Subnet" \
  --cidr "10.10.2.0/24" \
  --parent "10.10.0.0/16"
```

## Reporting and Auditing

### IP Utilization Report

```bash
# Get utilization for all networks
rackd network list --format json | jq -r '.[] | "\(.name): \(.utilization)%"'

# Export utilization to CSV
rackd network list --format csv > utilization-report.csv
```

### IP History Report

```bash
# Get IP allocation history
rackd audit list --resource-type ip --days 30

# Export audit log
rackd audit export --format csv --output audit-report.csv
```

### Device IP Report

```bash
# List all devices with their IPs
rackd device list --format json | \
  jq -r '.[] | "\(.hostname),\(.primary_ip),\(.status)"'

# Filter by network
rackd device list --network "Production Network" \
  --format table
```

## Automation Examples

### Python Script for IP Management

```python
#!/usr/bin/env python3
import requests

class RackdClient:
    def __init__(self, host, api_key):
        self.host = host
        self.api_key = api_key
        self.headers = {"X-API-Key": api_key}

    def get_next_ip(self, network_name):
        response = requests.post(
            f"{self.host}/api/networks/{network_name}/next-ip",
            headers=self.headers
        )
        return response.json()["address"]

    def allocate_device(self, hostname, network_name, **kwargs):
        ip = self.get_next_ip(network_name)
        device = {
            "hostname": hostname,
            "ip_addresses": [{"address": ip, "primary": True}],
            **kwargs
        }
        response = requests.post(
            f"{self.host}/api/devices",
            headers=self.headers,
            json=device
        )
        return response.json()

# Usage
client = RackdClient("https://rackd.example.com", "your-api-key")
device = client.allocate_device(
    hostname="new-server-01",
    network_name="Production Network",
    datacenter="Primary DC",
    status="planned"
)
print(f"Created device: {device['hostname']} with IP: {device['primary_ip']}")
```

### Bash Script for Bulk Operations

```bash
#!/bin/bash
# bulk-provision.sh

RACKD_HOST="https://rackd.example.com"
API_KEY="your-api-key"

provision_server() {
  local hostname=$1
  local network=$2

  # Get next IP
  ip=$(curl -s -X POST \
    -H "X-API-Key: $API_KEY" \
    "$RACKD_HOST/api/networks/$network/next-ip" | jq -r '.address')

  # Create device
  curl -s -X POST \
    -H "X-API-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"hostname\":\"$hostname\",\"ip_addresses\":[{\"address\":\"$ip\",\"primary\":true}],\"status\":\"planned\"}" \
    "$RACKD_HOST/api/devices" > /dev/null

  echo "$hostname,$ip"
}

# Provision 10 servers
for i in {1..10}; do
  provision_server "web-server-$i" "Production Network"
done
```

## Best Practices

### IP Address Planning

1. **Reserve ranges** for different purposes (infrastructure, applications, DHCP)
2. **Use consistent naming** for networks and devices
3. **Document allocations** with descriptions and ownership
4. **Monitor utilization** to avoid exhaustion
5. **Regular audits** to identify unused allocations

### Conflict Prevention

1. **Always use allocation APIs** rather than manually assigning IPs
2. **Enable reservations** for planned infrastructure
3. **Run regular conflict scans** via scheduled jobs
4. **Implement approval workflows** for critical IP changes
