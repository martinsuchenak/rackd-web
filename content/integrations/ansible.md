---
title: "Ansible Collection"
description: "Automate Rackd with Ansible"
weight: 2
---

# Ansible Collection

Automate Rackd operations with the official Ansible collection.

## Installation

Install the collection from Ansible Galaxy:

```bash
ansible-galaxy collection install martinsuchenak.rackd
```

## Configuration

### Inventory Plugin

Use the Rackd inventory plugin to dynamically populate your Ansible inventory:

```yaml
# inventory.rackd.yml
plugin: martinsuchenak.rackd.rackd
host: https://rackd.example.com
api_key: "{{ lookup('env', 'RACKD_API_KEY') }}"
```

### Module Configuration

Configure the connection in your playbook or inventory:

```yaml
# group_vars/all.yml
rackd_host: https://rackd.example.com
rackd_api_key: "{{ lookup('env', 'RACKD_API_KEY') }}"
```

## Modules

### Device Module

Manage devices:

```yaml
- name: Create a new device
  martinsuchenak.rackd.device:
    host: "{{ rackd_host }}"
    api_key: "{{ rackd_api_key }}"
    hostname: web-server-01
    datacenter: dc1
    status: active
    ip_addresses:
      - address: 192.168.1.10
        primary: true
    tags:
      - web
      - production
    state: present
```

```yaml
- name: Update device status
  martinsuchenak.rackd.device:
    host: "{{ rackd_host }}"
    api_key: "{{ rackd_api_key }}"
    hostname: web-server-01
    status: maintenance
    state: present
```

```yaml
- name: Delete a device
  martinsuchenak.rackd.device:
    host: "{{ rackd_host }}"
    api_key: "{{ rackd_api_key }}"
    hostname: old-server-01
    state: absent
```

### Network Module

Manage networks:

```yaml
- name: Create a network
  martinsuchenak.rackd.network:
    host: "{{ rackd_host }}"
    api_key: "{{ rackd_api_key }}"
    name: Production Network
    cidr: 192.168.1.0/24
    datacenter: dc1
    vlan_id: 100
    state: present
```

### IP Allocation Module

Allocate IP addresses:

```yaml
- name: Get next available IP
  martinsuchenak.rackd.ip_allocate:
    host: "{{ rackd_host }}"
    api_key: "{{ rackd_api_key }}"
    network: Production Network
    hostname: new-server-01
  register: allocated_ip

- name: Display allocated IP
  debug:
    msg: "Allocated IP: {{ allocated_ip.address }}"
```

### Datacenter Module

Manage datacenters:

```yaml
- name: Create datacenter
  martinsuchenak.rackd.datacenter:
    host: "{{ rackd_host }}"
    api_key: "{{ rackd_api_key }}"
    name: Primary DC
    location: US-East
    state: present
```

## Inventory Plugin

The inventory plugin automatically discovers devices from Rackd:

```yaml
# rackd_inventory.yml
plugin: martinsuchenak.rackd.rackd
host: https://rackd.example.com
api_key: "{{ lookup('env', 'RACKD_API_KEY') }}"

# Group by tags
groups:
  web: tags contains 'web'
  db: tags contains 'database'
  production: status == 'active'

# Add host variables
compose:
  ansible_host: primary_ip
  rackd_id: id
  rackd_status: status
```

Use the inventory:

```bash
ansible-inventory -i rackd_inventory.yml --list
```

## Example Playbooks

### Provision New Server

```yaml
---
- name: Provision new server in Rackd
  hosts: localhost
  gather_facts: no

  vars:
    server_hostname: "app-server-{{ 100 | random }}"
    datacenter: dc1
    network: Application Network

  tasks:
    - name: Get next available IP
      martinsuchenak.rackd.ip_allocate:
        host: "{{ rackd_host }}"
        api_key: "{{ rackd_api_key }}"
        network: "{{ network }}"
        hostname: "{{ server_hostname }}"
      register: allocated_ip

    - name: Create device record
      martinsuchenak.rackd.device:
        host: "{{ rackd_host }}"
        api_key: "{{ rackd_api_key }}"
        hostname: "{{ server_hostname }}"
        datacenter: "{{ datacenter }}"
        status: planned
        ip_addresses:
          - address: "{{ allocated_ip.address }}"
            primary: true
        tags:
          - application
          - "{{ env }}"

    - name: Display provisioning info
      debug:
        msg: |
          Server {{ server_hostname }} provisioned
          IP: {{ allocated_ip.address }}
          Datacenter: {{ datacenter }}
```

### Decommission Server

```yaml
---
- name: Decommission server
  hosts: localhost
  gather_facts: no

  vars:
    server_hostname: old-server-01

  tasks:
    - name: Set device to decommissioned status
      martinsuchenak.rackd.device:
        host: "{{ rackd_host }}"
        api_key: "{{ rackd_api_key }}"
        hostname: "{{ server_hostname }}"
        status: decommissioned
        state: present

    - name: Release IP address
      martinsuchenak.rackd.ip_release:
        host: "{{ rackd_host }}"
        api_key: "{{ rackd_api_key }}"
        hostname: "{{ server_hostname }}"
```

### Bulk Device Update

```yaml
---
- name: Update all devices in a datacenter
  hosts: localhost
  gather_facts: no

  tasks:
    - name: Get all devices
      martinsuchenak.rackd.device_info:
        host: "{{ rackd_host }}"
        api_key: "{{ rackd_api_key }}"
        datacenter: dc1
      register: devices

    - name: Update device tags
      martinsuchenak.rackd.device:
        host: "{{ rackd_host }}"
        api_key: "{{ rackd_api_key }}"
        hostname: "{{ item.hostname }}"
        tags: "{{ item.tags + ['audited'] }}"
      loop: "{{ devices.devices }}"
```
