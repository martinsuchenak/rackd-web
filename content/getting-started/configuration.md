---
title: "Configuration"
description: "Configure Rackd for your environment"
weight: 3
---


Rackd can be configured through environment variables. All configuration options have sensible defaults and can be overridden as needed.

## Environment Variables

### Server Options

| Variable | Default | Description |
|----------|---------|-------------|
| `DATA_DIR` | `./data` | Directory for SQLite database and application data |
| `LISTEN_ADDR` | `:8080` | Address and port for the HTTP server (e.g., `:8080`, `127.0.0.1:3000`) |

### Security Options

| Variable | Default | Description |
|----------|---------|-------------|
| `ENCRYPTION_KEY` | _(empty)_ | 64 hex chars (32 bytes). Encrypts stored SNMP/SSH credentials, DNS provider tokens and webhook secrets at rest. Generate with `openssl rand -hex 32`. Without it (outside `--dev-mode`) credential/DNS features are disabled |
| `INITIAL_ADMIN_USERNAME` | _(empty)_ | Bootstrap admin username, applied only when the database has no users |
| `INITIAL_ADMIN_PASSWORD` | _(empty)_ | Bootstrap admin password (min 8 characters) |
| `INITIAL_ADMIN_EMAIL` | `admin@localhost` | Bootstrap admin email |
| `COOKIE_SECURE` | `true` | Send session cookies only over HTTPS. Set to `false` for local dev without TLS |
| `SESSION_TTL` | `24h` | Duration for which a user session is valid |
| `SESSION_STORE_TYPE` | `sqlite` | The backend storage for sessions (`sqlite`, `valkey`, `redis`) |
| `VALKEY_URL` | `redis://localhost:6379/0` | The URL for Valkey/Redis if `SESSION_STORE_TYPE` is `valkey` or `redis` |
| `TRUST_PROXY` | `false` | Honor `X-Forwarded-For` / `X-Real-IP` headers from reverse proxies (rate limiting, audit logging) |
| `TRUSTED_PROXIES` | _(empty)_ | Comma-separated IPs/CIDRs of trusted reverse proxies. Required when `TRUST_PROXY=true`: forwarded headers are honored only from these peers, otherwise ignored (fail-closed) |
| `SSRF_ALLOW_PRIVATE_TARGETS` | `false` | Allow webhook and DNS provider endpoints on private ranges (RFC1918/CGNAT/ULA) for intentional internal integrations. Loopback, link-local (cloud metadata) and multicast are always blocked |

### Rate Limiting Options

| Variable | Default | Description |
|----------|---------|-------------|
| `RATE_LIMIT_ENABLED` | `true` | Enable API rate limiting. Set to `false` to disable for local dev |
| `RATE_LIMIT_REQUESTS` | `100` | Maximum requests per window |
| `RATE_LIMIT_WINDOW` | `1m` | Time window for rate limiting (Go duration format) |

See [Rate Limiting](ratelimit.md) for detailed documentation.

### Audit Logging Options

| Variable | Default | Description |
|----------|---------|-------------|
| `AUDIT_ENABLED` | `false` | Enable audit logging for all API changes |
| `AUDIT_RETENTION_DAYS` | `90` | Days to keep audit logs before automatic cleanup |

See [Audit Trail](audit.md) for detailed documentation.

### Logging Options

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_FORMAT` | `text` | Log output format: `text` or `json` |
| `LOG_LEVEL` | `info` | Log level: `trace`, `debug`, `info`, `warn`, or `error` |

### Discovery Options

| Variable | Default | Description |
|----------|---------|-------------|
| `DISCOVERY_INTERVAL` | `24h` | How often to run automatic network discovery (Go duration format) |
| `DISCOVERY_MAX_CONCURRENT` | `10` | Maximum number of concurrent discovery operations |
| `DISCOVERY_TIMEOUT` | `5s` | Timeout for individual device discovery attempts |
| `DISCOVERY_CLEANUP_DAYS` | `30` | Days to keep discovery history before cleanup |
| `DISCOVERY_SCAN_ON_STARTUP` | `false` | Whether to run discovery scan immediately on startup |
| `DISCOVERY_SNMPV2C_ENABLED` | `false` | If false, prevents SNMPv2c discovery scans across the infrastructure. Enable if SNMPv2c required. |

## Configuration Examples

### Basic Setup

```bash
# Local development — --dev-mode disables cookie secure + rate limiting
# and allows running without ENCRYPTION_KEY
./rackd server --dev-mode --log-level debug
```

### Production Setup

```bash
# Production configuration with authentication and audit logging
# COOKIE_SECURE and RATE_LIMIT_ENABLED are already true by default
export DATA_DIR="/var/lib/rackd"
export LISTEN_ADDR=":8080"
export ENCRYPTION_KEY="your-64-hex-char-key"
export INITIAL_ADMIN_PASSWORD="your-secure-password"
export LOG_FORMAT="json"
export LOG_LEVEL="info"
export DISCOVERY_INTERVAL="12h"
export DISCOVERY_MAX_CONCURRENT="20"
export RATE_LIMIT_REQUESTS="100"
export RATE_LIMIT_WINDOW="1m"
export AUDIT_ENABLED="true"
export AUDIT_RETENTION_DAYS="90"

./rackd server
```

### Docker Environment

```bash
# Docker configuration
docker run -d \
  -p 8080:8080 \
  -v /var/lib/rackd:/data \
  -e DATA_DIR="/data" \
  -e ENCRYPTION_KEY="your-64-hex-char-key" \
  -e INITIAL_ADMIN_USERNAME="admin" \
  -e INITIAL_ADMIN_PASSWORD="your-secure-password" \
  -e LOG_FORMAT="json" \
  rackd:latest
```

## Duration Format

Duration values (like `DISCOVERY_INTERVAL` and `DISCOVERY_TIMEOUT`) use Go's duration format:

- `s` - seconds
- `m` - minutes
- `h` - hours

Examples:
- `30s` - 30 seconds
- `5m` - 5 minutes
- `2h` - 2 hours
- `24h` - 24 hours

For multi-day values use hours (e.g. `72h`); Go durations have no day unit.
- `1h30m` - 1 hour 30 minutes

## Security Considerations

### Authentication Tokens

- Use strong, randomly generated tokens for production
- Store tokens securely (environment variables, secrets management)
- Rotate tokens regularly
- Never commit tokens to version control

### Network Security

- Bind to specific interfaces in production (`127.0.0.1:8080` vs `:8080`)
- Use reverse proxy with TLS termination
- Implement firewall rules to restrict access

### File Permissions

Ensure proper permissions on the data directory:

```bash
# Create data directory with restricted permissions
mkdir -p /var/lib/rackd
chown rackd:rackd /var/lib/rackd
chmod 750 /var/lib/rackd
```

## Validation

Rackd validates configuration on startup and will exit with an error if invalid values are provided:

- `LOG_LEVEL` must be one of: `trace`, `debug`, `info`, `warn`, `error`
- `LOG_FORMAT` must be either `text` or `json`
- Duration values must be positive
- Numeric values must be positive integers

## Environment File

You can use a `.env` file for configuration:

```bash
# .env file
DATA_DIR=./data
LISTEN_ADDR=:8080
LOG_LEVEL=debug
ENCRYPTION_KEY=your-64-hex-char-key
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_PASSWORD=dev-password-only-for-local
DISCOVERY_INTERVAL=1h
```

Load with:
```bash
source .env
./rackd server
```

## Systemd Service

Example systemd service file with environment configuration:

```ini
[Unit]
Description=Rackd IPAM Server
After=network.target

[Service]
Type=simple
User=rackd
Group=rackd
WorkingDirectory=/opt/rackd
ExecStart=/opt/rackd/rackd server
Environment=DATA_DIR=/var/lib/rackd
Environment=LISTEN_ADDR=:8080
Environment=LOG_FORMAT=json
Environment=LOG_LEVEL=info
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```