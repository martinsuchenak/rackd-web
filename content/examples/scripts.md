---
title: "Sample Scripts"
description: "Sample scripts for automating Rackd operations"
weight: 3
---

# Sample Scripts

Collection of sample scripts for automating Rackd operations.

## Python SDK

### Installation

```bash
pip install rackd-sdk
```

### Basic Usage

```python
from rackd import Client

# Initialize client
client = Client(
    host="https://rackd.example.com",
    api_key="your-api-key"
)

# List devices
devices = client.devices.list()
for device in devices:
    print(f"{device.hostname}: {device.primary_ip}")

# Create a device
device = client.devices.create(
    hostname="new-server-01",
    datacenter="Primary DC",
    ip_addresses=[{"address": "192.168.1.10", "primary": True}],
    status="planned"
)

# Update device
device.update(status="active")

# Delete device
device.delete()
```

### IP Allocation

```python
from rackd import Client

client = Client(host="https://rackd.example.com", api_key="your-api-key")

# Get next available IP
network = client.networks.get("Production Network")
next_ip = network.allocate_ip()

print(f"Allocated IP: {next_ip.address}")

# Create device with allocated IP
device = client.devices.create(
    hostname=f"server-{next_ip.address.split('.')[-1]}",
    ip_addresses=[{"address": next_ip.address, "primary": True}],
    datacenter="Primary DC"
)
```

## Bash Scripts

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

RACKD_HOST="https://rackd.example.com"
API_KEY="your-api-key"

check_health() {
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "X-API-Key: $API_KEY" \
        "$RACKD_HOST/healthz")

    if [ "$response" -eq 200 ]; then
        echo "OK: Rackd is healthy"
        return 0
    else
        echo "CRITICAL: Rackd returned $response"
        return 2
    fi
}

check_device_count() {
    count=$(curl -s -H "X-API-Key: $API_KEY" \
        "$RACKD_HOST/api/devices?limit=0" | \
        jq -r '.total')

    echo "INFO: $count devices in inventory"
}

check_utilization() {
    utilization=$(curl -s -H "X-API-Key: $API_KEY" \
        "$RACKD_HOST/api/networks/Production%20Network" | \
        jq -r '.utilization')

    echo "INFO: Production network utilization: ${utilization}%"

    if (( $(echo "$utilization > 90" | bc -l) )); then
        echo "WARNING: Network utilization above 90%"
        return 1
    fi
}

# Run checks
check_health
check_device_count
check_utilization
```

### Backup Script

```bash
#!/bin/bash
# backup-rackd.sh

RACKD_HOST="https://rackd.example.com"
API_KEY="your-api-key"
BACKUP_DIR="/backups/rackd"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Export all data
curl -s -H "X-API-Key: $API_KEY" \
    "$RACKD_HOST/api/export?format=json" \
    -o "$BACKUP_DIR/rackd-backup-$DATE.json"

# Compress
gzip "$BACKUP_DIR/rackd-backup-$DATE.json"

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete

echo "Backup completed: rackd-backup-$DATE.json.gz"
```

### Device Provisioning

```bash
#!/bin/bash
# provision-device.sh

RACKD_HOST="https://rackd.example.com"
API_KEY="your-api-key"

provision_device() {
    local hostname=$1
    local network=$2
    local datacenter=$3

    # Get next IP
    ip=$(curl -s -X POST \
        -H "X-API-Key: $API_KEY" \
        "$RACKD_HOST/api/networks/$network/next-ip" | \
        jq -r '.address')

    # Create device
    device_id=$(curl -s -X POST \
        -H "X-API-Key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"hostname\": \"$hostname\",
            \"datacenter\": \"$datacenter\",
            \"ip_addresses\": [{\"address\": \"$ip\", \"primary\": true}],
            \"status\": \"planned\"
        }" \
        "$RACKD_HOST/api/devices" | jq -r '.id')

    echo "Provisioned: $hostname ($ip) - ID: $device_id"
}

# Provision multiple devices
for i in {1..5}; do
    provision_device "web-server-$i" "Production Network" "Primary DC"
done
```

## PowerShell Scripts

### Basic Operations

```powershell
# rackd-client.ps1

$RackdHost = "https://rackd.example.com"
$ApiKey = "your-api-key"
$Headers = @{
    "X-API-Key" = $ApiKey
}

function Get-Devices {
    $response = Invoke-RestMethod -Uri "$RackdHost/api/devices" -Headers $Headers
    return $response
}

function Get-Device {
    param($Hostname)
    $response = Invoke-RestMethod -Uri "$RackdHost/api/devices?hostname=$Hostname" -Headers $Headers
    return $response[0]
}

function New-Device {
    param(
        $Hostname,
        $IPAddress,
        $Datacenter,
        $Status = "planned"
    )

    $body = @{
        hostname = $Hostname
        datacenter = $Datacenter
        ip_addresses = @(
            @{
                address = $IPAddress
                primary = $true
            }
        )
        status = $Status
    } | ConvertTo-Json -Depth 3

    $response = Invoke-RestMethod -Uri "$RackdHost/api/devices" `
        -Method POST `
        -Headers $Headers `
        -ContentType "application/json" `
        -Body $body

    return $response
}

# Usage examples
$devices = Get-Devices
$devices | ForEach-Object { Write-Host "$($_.hostname): $($_.primary_ip)" }
```

## Go Examples

### Basic Client

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/martinsuchenak/rackd-go"
)

func main() {
    client, err := rackd.NewClient("https://rackd.example.com", "your-api-key")
    if err != nil {
        log.Fatal(err)
    }

    // List devices
    devices, err := client.Devices.List(context.Background())
    if err != nil {
        log.Fatal(err)
    }

    for _, device := range devices {
        fmt.Printf("%s: %s\n", device.Hostname, device.PrimaryIP)
    }
}
```

## Best Practices

### Error Handling

```python
import requests
from requests.exceptions import RequestException

def safe_api_call(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except RequestException as e:
            print(f"API Error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
    return wrapper

@safe_api_call
def get_devices(client):
    return client.devices.list()
```

### Rate Limiting

```python
import time
from functools import wraps

def rate_limit(calls_per_second):
    min_interval = 1.0 / calls_per_second
    def decorator(func):
        last_called = [0.0]
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)
            result = func(*args, **kwargs)
            last_called[0] = time.time()
            return result
        return wrapper
    return decorator

@rate_limit(10)  # 10 calls per second
def api_call(client, endpoint):
    return requests.get(f"{client.host}{endpoint}", headers=client.headers)
```
