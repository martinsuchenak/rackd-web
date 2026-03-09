---
title: "Discovery Examples"
description: "Network discovery examples and patterns"
weight: 2
---

# Discovery Examples

Examples for using Rackd's network discovery capabilities.

## Basic Discovery

### ARP Scan

Discover devices using ARP scanning:

```bash
# Scan a network using ARP
rackd discovery scan \
  --network "192.168.1.0/24" \
  --method arp

# View discovered devices
rackd discovery list --status discovered
```

### SNMP Discovery

Discover devices with SNMP:

```bash
# Create SNMP credential
rackd credential add \
  --name "snmp-read" \
  --type snmp \
  --community "public" \
  --version 2c

# Run SNMP discovery
rackd discovery scan \
  --network "192.168.1.0/24" \
  --method snmp \
  --credential "snmp-read"
```

### mDNS/Bonjour Discovery

Discover devices advertising via mDNS:

```bash
# Run mDNS discovery
rackd discovery scan --method mdns

# View discovered services
rackd discovery list --method mdns
```

## Credential Management

### SSH Credentials

```bash
# Add SSH credential with password
rackd credential add \
  --name "ssh-admin" \
  --type ssh \
  --username "admin" \
  --password "secret"

# Add SSH credential with key
rackd credential add \
  --name "ssh-key" \
  --type ssh \
  --username "admin" \
  --private-key-file ~/.ssh/id_rsa
```

### SNMP v3 Credentials

```bash
# Add SNMP v3 credential
rackd credential add \
  --name "snmp-v3" \
  --type snmp \
  --version 3 \
  --username "snmpuser" \
  --auth-protocol SHA \
  --auth-password "authsecret" \
  --priv-protocol AES \
  --priv-password "privsecret"
```

## Scan Profiles

### Create Custom Profile

```bash
# Create a profile for server discovery
rackd scan-profile add \
  --name "server-discovery" \
  --methods "snmp,ssh" \
  --ports "22,161" \
  --timeout 30 \
  --retries 3

# Use the profile
rackd discovery scan \
  --network "10.0.1.0/24" \
  --profile "server-discovery"
```

### Profile for Network Devices

```bash
# Create profile for switches/routers
rackd scan-profile add \
  --name "network-devices" \
  --methods "snmp,lldp" \
  --ports "161" \
  --timeout 60 \
  --snmp-oids "1.3.6.1.2.1.1.1,1.3.6.1.2.1.1.5"
```

## Scheduled Scans

### Configure Schedule

```bash
# Schedule daily scan
rackd scheduled-scan add \
  --name "daily-discovery" \
  --network "192.168.1.0/24" \
  --profile "server-discovery" \
  --schedule "0 2 * * *" \
  --enabled

# Schedule hourly scan for critical networks
rackd scheduled-scan add \
  --name "critical-hourly" \
  --network "10.0.0.0/24" \
  --method arp \
  --schedule "0 * * * *" \
  --enabled
```

### Manage Schedules

```bash
# List scheduled scans
rackd scheduled-scan list

# Enable/disable schedule
rackd scheduled-scan update --name "daily-discovery" --disabled
rackd scheduled-scan update --name "daily-discovery" --enabled

# Delete schedule
rackd scheduled-scan delete --name "daily-discovery"
```

## Device Promotion

Promote discovered devices to managed inventory:

```bash
# List discovered devices
rackd discovery list --status discovered

# Promote a single device
rackd discovery promote \
  --id "discovered-123" \
  --hostname "server-01" \
  --datacenter "Primary DC" \
  --status "active"

# Promote with additional info
rackd discovery promote \
  --id "discovered-456" \
  --hostname "switch-01" \
  --datacenter "Primary DC" \
  --tags "network,core" \
  --custom-fields '{"owner":"Network Team"}'
```

### Bulk Promotion

```bash
#!/bin/bash
# promote-discovered.sh

# Get all discovered devices
rackd discovery list --status discovered --format json | \
  jq -r '.[] | .id' | while read id; do

  # Get device details
  device=$(rackd discovery get --id $id --format json)
  hostname=$(echo $device | jq -r '.hostname // .ip')

  # Promote to managed
  rackd discovery promote \
    --id $id \
    --hostname "$hostname" \
    --datacenter "Primary DC" \
    --status "active"

  echo "Promoted: $hostname"
done
```

## LLDP Discovery

Discover network topology via LLDP:

```bash
# Enable LLDP on scan profile
rackd scan-profile add \
  --name "lldp-topology" \
  --methods "snmp,lldp" \
  --snmp-credential "snmp-read"

# Run LLDP discovery
rackd discovery scan \
  --network "10.0.0.0/24" \
  --profile "lldp-topology"

# View discovered relationships
rackd relationships list --source discovery
```

## API Examples

### Python Discovery Script

```python
#!/usr/bin/env python3
import requests
import time

RACKD_HOST = "https://rackd.example.com"
API_KEY = "your-api-key"

headers = {"X-API-Key": API_KEY}

def start_scan(network, method="arp"):
    """Start a discovery scan"""
    response = requests.post(
        f"{RACKD_HOST}/api/discovery/scan",
        headers=headers,
        json={"network": network, "method": method}
    )
    return response.json()["scan_id"]

def get_scan_status(scan_id):
    """Get scan status"""
    response = requests.get(
        f"{RACKD_HOST}/api/discovery/scan/{scan_id}",
        headers=headers
    )
    return response.json()

def get_discovered_devices():
    """Get all discovered devices"""
    response = requests.get(
        f"{RACKD_HOST}/api/discovery/devices",
        headers=headers,
        params={"status": "discovered"}
    )
    return response.json()

def promote_device(discovery_id, hostname, datacenter):
    """Promote a discovered device"""
    response = requests.post(
        f"{RACKD_HOST}/api/discovery/devices/{discovery_id}/promote",
        headers=headers,
        json={
            "hostname": hostname,
            "datacenter": datacenter,
            "status": "active"
        }
    )
    return response.json()

# Main workflow
if __name__ == "__main__":
    # Start scan
    scan_id = start_scan("192.168.1.0/24", "arp")
    print(f"Started scan: {scan_id}")

    # Wait for completion
    while True:
        status = get_scan_status(scan_id)
        if status["status"] == "completed":
            break
        time.sleep(5)

    print(f"Scan completed. Found {status['devices_found']} devices.")

    # Get and promote devices
    devices = get_discovered_devices()
    for device in devices:
        hostname = device.get("hostname") or f"device-{device['ip'].replace('.', '-')}"
        promote_device(device["id"], hostname, "Primary DC")
        print(f"Promoted: {hostname}")
```

### Continuous Discovery

```bash
#!/bin/bash
# continuous-discovery.sh

NETWORKS=("192.168.1.0/24" "10.0.0.0/24" "10.0.1.0/24")

while true; do
  for network in "${NETWORKS[@]}"; do
    echo "Scanning $network..."

    # Run scan
    rackd discovery scan --network "$network" --method arp --wait

    # Auto-promote known patterns
    rackd discovery list --status discovered --format json | \
      jq -r '.[] | select(.hostname | test("^[a-z]+-[0-9]+$")) | .id' | \
      while read id; do
        hostname=$(rackd discovery get --id $id --format json | jq -r '.hostname')
        rackd discovery promote \
          --id $id \
          --hostname "$hostname" \
          --datacenter "Primary DC"
        echo "Auto-promoted: $hostname"
      done
  done

  echo "Sleeping for 1 hour..."
  sleep 3600
done
```

## Best Practices

### Credential Security

1. **Use SNMP v3** when possible for better security
2. **Rotate credentials** regularly
3. **Use least-privilege** accounts for discovery
4. **Store credentials securely** using Rackd's encrypted storage

### Scan Optimization

1. **Use appropriate timeouts** - longer for WAN, shorter for LAN
2. **Schedule scans** during off-peak hours
3. **Use scan profiles** to minimize network impact
4. **Enable incremental discovery** for large networks

### Device Promotion

1. **Review discovered devices** before promotion
2. **Use consistent naming conventions**
3. **Apply appropriate tags** during promotion
4. **Set correct lifecycle status**
