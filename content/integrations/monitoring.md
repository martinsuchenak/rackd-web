---
title: "Monitoring Systems"
description: "Integrate Rackd with Prometheus, Grafana, and other monitoring tools"
weight: 3
---

# Monitoring Systems

Integrate Rackd with your monitoring infrastructure for comprehensive observability.

## Prometheus Integration

Rackd exposes Prometheus-compatible metrics at the `/metrics` endpoint.

### Configuration

Enable metrics in your Rackd configuration:

```yaml
# config.yaml
metrics:
  enabled: true
  path: /metrics
```

### Prometheus Scraping

Add Rackd to your Prometheus configuration:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'rackd'
    static_configs:
      - targets: ['rackd.example.com:8080']
    metrics_path: /metrics
    scheme: https
    basic_auth:
      username: metrics
      password: secret
```

### Available Metrics

Rackd exports the following metrics:

| Metric | Type | Description |
|--------|------|-------------|
| `rackd_devices_total` | Gauge | Total number of devices |
| `rackd_devices_by_status` | Gauge | Devices grouped by status |
| `rackd_networks_total` | Gauge | Total number of networks |
| `rackd_ip_allocations_total` | Gauge | Total IP allocations |
| `rackd_ip_pool_utilization` | Gauge | IP pool utilization percentage |
| `rackd_conflicts_total` | Gauge | Total IP conflicts detected |
| `rackd_api_requests_total` | Counter | Total API requests |
| `rackd_api_request_duration_seconds` | Histogram | API request duration |

### Recording Rules

Create recording rules for common queries:

```yaml
# recording_rules.yml
groups:
  - name: rackd_rules
    rules:
      - record: rackd:ip_utilization:percent
        expr: |
          (rackd_ip_allocations_total / rackd_networks_total) * 100

      - record: rackd:devices:active_ratio
        expr: |
          rackd_devices_by_status{status="active"} / rackd_devices_total
```

## Grafana Dashboards

### Import Dashboard

Import the official Rackd Grafana dashboard:

1. Open Grafana → Dashboards → Import
2. Enter dashboard ID: `XXXXX` (coming soon)
3. Select your Prometheus data source
4. Click Import

### Custom Dashboard

Create a custom dashboard with these panels:

#### IP Pool Utilization

```json
{
  "title": "IP Pool Utilization",
  "type": "gauge",
  "targets": [
    {
      "expr": "rackd_ip_pool_utilization",
      "legendFormat": "{{ pool_name }}"
    }
  ],
  "fieldConfig": {
    "defaults": {
      "max": 100,
      "min": 0,
      "unit": "percent"
    }
  }
}
```

#### Device Status Distribution

```json
{
  "title": "Device Status",
  "type": "piechart",
  "targets": [
    {
      "expr": "rackd_devices_by_status",
      "legendFormat": "{{ status }}"
    }
  ]
}
```

#### API Performance

```json
{
  "title": "API Latency",
  "type": "graph",
  "targets": [
    {
      "expr": "histogram_quantile(0.95, rackd_api_request_duration_seconds_bucket)",
      "legendFormat": "95th percentile"
    },
    {
      "expr": "histogram_quantile(0.99, rackd_api_request_duration_seconds_bucket)",
      "legendFormat": "99th percentile"
    }
  ]
}
```

## Alerting

### Prometheus Alerting Rules

Configure alerts for critical conditions:

```yaml
# alert_rules.yml
groups:
  - name: rackd_alerts
    rules:
      - alert: RackdIPPoolExhaustion
        expr: rackd_ip_pool_utilization > 90
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "IP pool {{ $labels.pool_name }} is nearly exhausted"
          description: "Pool utilization is at {{ $value }}%"

      - alert: RackdIPConflict
        expr: increase(rackd_conflicts_total[5m]) > 0
        labels:
          severity: critical
        annotations:
          summary: "IP conflict detected"
          description: "{{ $value }} IP conflicts detected in the last 5 minutes"

      - alert: RackdHighAPILatency
        expr: histogram_quantile(0.95, rackd_api_request_duration_seconds_bucket) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency detected"
          description: "95th percentile latency is {{ $value }}s"
```

### Alertmanager Configuration

Route Rackd alerts appropriately:

```yaml
# alertmanager.yml
route:
  receiver: 'rackd-team'
  matchers:
    - alertname =~ "Rackd.*"

receivers:
  - name: 'rackd-team'
    slack_configs:
      - channel: '#rackd-alerts'
        send_resolved: true
```

## Nagios/Icinga Integration

Use the REST API to create custom checks:

### Device Health Check

```bash
#!/bin/bash
# check_rackd_device.sh

HOST=$1
API_KEY=$2
DEVICE=$3

STATUS=$(curl -s -H "X-API-Key: $API_KEY" \
  "https://$HOST/api/devices?hostname=$DEVICE" | \
  jq -r '.[0].status')

case $STATUS in
  active)
    echo "OK: Device $DEVICE is active"
    exit 0
    ;;
  maintenance)
    echo "WARNING: Device $DEVICE is in maintenance"
    exit 1
    ;;
  *)
    echo "CRITICAL: Device $DEVICE status is $STATUS"
    exit 2
    ;;
esac
```

### IP Pool Check

```bash
#!/bin/bash
# check_rackd_pool.sh

HOST=$1
API_KEY=$2
POOL=$3
THRESHOLD=${4:-90}

UTILIZATION=$(curl -s -H "X-API-Key: $API_KEY" \
  "https://$HOST/api/pools/$POOL" | \
  jq -r '.utilization')

if (( $(echo "$UTILIZATION > $THRESHOLD" | bc -l) )); then
  echo "CRITICAL: Pool $POOL utilization is ${UTILIZATION}%"
  exit 2
elif (( $(echo "$UTILIZATION > 80" | bc -l) )); then
  echo "WARNING: Pool $POOL utilization is ${UTILIZATION}%"
  exit 1
else
  echo "OK: Pool $POOL utilization is ${UTILIZATION}%"
  exit 0
fi
```

## Datadog Integration

### Custom Metrics

Send Rackd metrics to Datadog using the API:

```python
#!/usr/bin/env python3
import requests
from datadog import statsd

RACKD_HOST = "https://rackd.example.com"
API_KEY = "your-api-key"

# Fetch metrics
response = requests.get(
    f"{RACKD_HOST}/api/stats",
    headers={"X-API-Key": API_KEY}
)
stats = response.json()

# Send to Datadog
statsd.gauge("rackd.devices.total", stats["devices_total"])
statsd.gauge("rackd.networks.total", stats["networks_total"])
statsd.gauge("rackd.ip.utilization", stats["ip_utilization"])
```

### Datadog Agent Check

Create a custom Datadog agent check:

```python
# checks/rackd.py
from checks import AgentCheck

class RackdCheck(AgentCheck):
    def check(self, instance):
        host = instance.get('host')
        api_key = instance.get('api_key')

        response = self.http.get(
            f"{host}/api/stats",
            headers={"X-API-Key": api_key}
        )
        response.raise_for_status()
        stats = response.json()

        self.gauge("rackd.devices", stats["devices_total"])
        self.gauge("rackd.networks", stats["networks_total"])
        self.gauge("rackd.ip.utilization", stats["ip_utilization"])
```
