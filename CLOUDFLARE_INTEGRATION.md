# Cloudflare Tunnel Integration Guide

Complete integration guide for exposing AstroAI to the internet via Cloudflare Tunnel.

## Overview

Cloudflare Tunnel provides a secure, encrypted connection from your local machine to Cloudflare's network without requiring:
- Port forwarding
- Public IP address
- Firewall configuration
- VPN setup

Traffic flows: User → Cloudflare → Tunnel → Local Services

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet Users                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTPS (Encrypted)
                         │
        ┌────────────────▼────────────────┐
        │   Cloudflare Edge Network       │
        │  (DDoS Protection, WAF, etc)    │
        └────────────────┬────────────────┘
                         │
                    Encrypted Tunnel
                         │
        ┌────────────────▼────────────────┐
        │   cloudflared Daemon            │
        │   (Your Local Machine)          │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼─────┐                    ┌─────▼────┐
   │ Frontend  │                    │ Backend  │
   │ :3000    │                    │ :8000   │
   └──────────┘                    └──────────┘
```

## Key Features

1. **Zero Configuration Firewall**
   - No port forwarding needed
   - Works behind NAT/firewall
   - No public IP required

2. **Automatic HTTPS**
   - Cloudflare provides SSL/TLS
   - Automatic certificate renewal
   - No certificate management needed

3. **Built-in Security**
   - DDoS protection
   - Web Application Firewall (WAF)
   - Rate limiting
   - Bot management

4. **Easy Routing**
   - Multiple hostnames
   - Path-based routing
   - Load balancing
   - Custom headers

5. **Monitoring & Logs**
   - Real-time tunnel logs
   - Traffic analytics
   - Performance metrics
   - Error tracking

## Setup Workflow

### Phase 1: Prerequisites (5 minutes)
- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] cloudflared CLI installed
- [ ] Docker services running

### Phase 2: Authentication (2 minutes)
- [ ] Run `cloudflared tunnel login`
- [ ] Authorize in browser
- [ ] Credentials saved locally

### Phase 3: Tunnel Creation (2 minutes)
- [ ] Create tunnel: `cloudflared tunnel create astroai`
- [ ] Note tunnel ID
- [ ] Credentials file created

### Phase 4: Configuration (5 minutes)
- [ ] Copy config.yml to ~/.cloudflared/
- [ ] Update domain name
- [ ] Verify routing rules

### Phase 5: DNS Setup (2 minutes)
- [ ] Create DNS records
- [ ] Or use `cloudflared tunnel route dns`
- [ ] Wait for propagation (5-10 min)

### Phase 6: Verification (5 minutes)
- [ ] Start tunnel
- [ ] Test local access
- [ ] Test remote access
- [ ] Check logs

**Total Time: ~20 minutes**

## Quick Start Commands

```bash
# Install cloudflared
# (See cloudflare/SETUP.md for OS-specific instructions)

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create astroai

# Configure DNS
cloudflared tunnel route dns astroai astroai.yourdomain.com
cloudflared tunnel route dns astroai api.astroai.yourdomain.com

# Copy and edit config
cp cloudflare/config.yml ~/.cloudflared/config.yml
# Edit to replace yourdomain.com with your actual domain

# Start tunnel
cloudflared tunnel run astroai

# In another terminal, test
curl https://astroai.yourdomain.com
curl https://api.astroai.yourdomain.com/health
```

## Configuration Details

### Tunnel File Structure

```
~/.cloudflared/
├── cert.pem                    # Cloudflare certificate
├── astroai.json               # Tunnel credentials
└── config.yml                 # Routing configuration
```

### config.yml Structure

```yaml
tunnel: astroai                                    # Tunnel name
credentials-file: ~/.cloudflared/astroai.json    # Credentials path

ingress:
  # Frontend routing
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
    
  # Backend routing
  - hostname: api.astroai.yourdomain.com
    service: http://localhost:8000
    
  # Catch-all (must be last)
  - service: http_status:404

logLevel: info                                     # Log verbosity
```

## Advanced Configuration

### Custom Headers

```yaml
- hostname: astroai.yourdomain.com
  service: http://localhost:3000
  originRequest:
    headers:
      add:
        X-Custom-Header: value
        X-Forwarded-Proto: https
```

### Path-Based Routing

```yaml
- hostname: astroai.yourdomain.com
  path: /api/*
  service: http://localhost:8000
  
- hostname: astroai.yourdomain.com
  service: http://localhost:3000
```

### Load Balancing

```yaml
- hostname: astroai.yourdomain.com
  service: http://localhost:3000
  
- hostname: astroai.yourdomain.com
  service: http://localhost:3001  # Fallback
```

### CORS Configuration

```yaml
- hostname: astroai.yourdomain.com
  service: http://localhost:3000
  originRequest:
    headers:
      add:
        Access-Control-Allow-Origin: "*"
```

## Running as Service

### Linux (systemd)

```bash
# Install service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared

# Enable on boot
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f
```

### Windows (Service)

```powershell
# Install service
cloudflared service install

# Start service
Start-Service cloudflared

# Check status
Get-Service cloudflared

# View logs (Event Viewer)
# Application > cloudflared
```

### macOS (LaunchAgent)

```bash
# Install service
sudo cloudflared service install

# Start service
sudo launchctl start com.cloudflare.cloudflared

# Check status
sudo launchctl list | grep cloudflare

# View logs
log stream --predicate 'process == "cloudflared"'
```

## Monitoring & Maintenance

### Check Tunnel Status

```bash
# List all tunnels
cloudflared tunnel list

# Expected output:
# ID                                   NAME     CREATED              CONNECTIONS
# <tunnel-id>                          astroai  2026-04-03T02:30:00Z 2/2
```

### View Logs

```bash
# Real-time logs
cloudflared tunnel logs astroai

# Debug level
cloudflared tunnel logs astroai --level debug

# Last N entries
cloudflared tunnel logs astroai --num 50

# Save to file
cloudflared tunnel logs astroai > tunnel.log
```

### Performance Metrics

Access via Cloudflare Dashboard:
1. Go to https://dash.cloudflare.com
2. Select your domain
3. Analytics → Traffic
4. View:
   - Requests per second
   - Bandwidth usage
   - Cache hit ratio
   - Error rates

### Health Checks

```bash
# Test frontend
curl -I https://astroai.yourdomain.com

# Test backend
curl -I https://api.astroai.yourdomain.com/health

# Test with verbose output
curl -v https://astroai.yourdomain.com
```

## Security Best Practices

### 1. Credential Management

```bash
# Restrict permissions
chmod 600 ~/.cloudflared/astroai.json

# Don't commit to git
echo ".cloudflared/" >> .gitignore

# Backup credentials
cp ~/.cloudflared/astroai.json ~/backup/astroai.json.bak
```

### 2. Enable Cloudflare Security

1. **Web Application Firewall (WAF)**
   - Dashboard → Security → WAF
   - Enable managed rulesets
   - Create custom rules

2. **Rate Limiting**
   - Dashboard → Security → Rate Limiting
   - Set threshold (e.g., 100 req/min)
   - Define action (block/challenge)

3. **DDoS Protection**
   - Enabled by default
   - Sensitivity: Medium
   - Dashboard → Security → DDoS

4. **Bot Management**
   - Dashboard → Security → Bots
   - Enable bot fight mode
   - Configure rules

### 3. Access Control

```yaml
# Restrict by IP (if needed)
- hostname: astroai.yourdomain.com
  service: http://localhost:3000
  originRequest:
    headers:
      add:
        CF-Access-Rule: "allow"
```

### 4. Monitoring & Alerts

1. Set up email alerts in Cloudflare Dashboard
2. Monitor tunnel logs regularly
3. Review analytics weekly
4. Check for unusual traffic patterns

## Troubleshooting

### Tunnel Won't Start

**Error:** `Failed to establish connection`

**Solutions:**
```bash
# Check credentials exist
ls ~/.cloudflared/astroai.json

# Verify tunnel exists
cloudflared tunnel list

# Check for port conflicts
netstat -an | grep 3000
netstat -an | grep 8000

# Run with debug logging
cloudflared tunnel run astroai --loglevel debug
```

### Can't Access Remote URL

**Error:** `Connection refused` or `Timeout`

**Solutions:**
1. Verify tunnel is running: `cloudflared tunnel list`
2. Check DNS records in Cloudflare Dashboard
3. Verify local services: `curl http://localhost:3000`
4. Wait 5-10 minutes for DNS propagation
5. Clear browser cache

### DNS Not Resolving

**Error:** `Name resolution failed`

**Solutions:**
```bash
# Check DNS records
nslookup astroai.yourdomain.com

# Flush DNS cache
# Windows: ipconfig /flushdns
# Linux: sudo systemctl restart systemd-resolved
# macOS: sudo dscacheutil -flushcache

# Verify CNAME points to tunnel
dig astroai.yourdomain.com
```

### HTTPS Certificate Issues

**Error:** `SSL certificate problem`

**Solutions:**
1. Wait 5-10 minutes after creating DNS records
2. Clear browser cache
3. Try incognito/private window
4. Check certificate in browser (should be Cloudflare)

### High Latency

**Symptoms:** Slow responses, timeouts

**Solutions:**
1. Check tunnel logs: `cloudflared tunnel logs astroai --level debug`
2. Monitor local services: `docker-compose logs`
3. Check network bandwidth
4. Verify no rate limiting is active
5. Review Cloudflare analytics for bottlenecks

## Maintenance Tasks

### Weekly
- [ ] Check tunnel status: `cloudflared tunnel list`
- [ ] Review logs for errors
- [ ] Monitor Cloudflare analytics

### Monthly
- [ ] Update cloudflared: `cloudflared update`
- [ ] Review security settings
- [ ] Check for unusual traffic patterns
- [ ] Test failover/backup tunnel

### Quarterly
- [ ] Rotate credentials (optional)
- [ ] Review and update config.yml
- [ ] Test disaster recovery
- [ ] Update documentation

## Backup & Disaster Recovery

### Backup Tunnel

Create a second tunnel for failover:

```bash
# Create backup tunnel
cloudflared tunnel create astroai-backup

# Configure with same settings
cp ~/.cloudflared/config.yml ~/.cloudflared/config-backup.yml

# Update config-backup.yml with backup tunnel ID
# Deploy backup tunnel on different machine
```

### Backup Credentials

```bash
# Backup credentials directory
tar -czf cloudflared-backup.tar.gz ~/.cloudflared/

# Store securely
# - Cloud storage (encrypted)
# - External drive
# - Password manager
```

### Recovery Procedure

```bash
# If tunnel fails:
1. Restore credentials: tar -xzf cloudflared-backup.tar.gz
2. Switch to backup tunnel: cloudflared tunnel run astroai-backup
3. Update DNS records to point to backup
4. Investigate primary tunnel issue
5. Restore primary when ready
```

## Cost Analysis

**Cloudflare Tunnel Pricing:**
- Free tier: Unlimited tunnels, 1 GB/month data
- Pro tier: $20/month, unlimited data
- Business tier: $200/month, advanced features

**For AstroAI:**
- Typical usage: 10-100 MB/month (free tier sufficient)
- Upgrade to Pro when: > 1 GB/month or need advanced features

## Performance Optimization

### 1. Enable Caching

```yaml
- hostname: astroai.yourdomain.com
  service: http://localhost:3000
  originRequest:
    headers:
      add:
        Cache-Control: "max-age=3600"
```

### 2. Compression

Cloudflare automatically compresses responses.

### 3. HTTP/2 Push

Cloudflare supports HTTP/2 by default.

### 4. Image Optimization

Enable in Cloudflare Dashboard:
- Polish (image compression)
- Mirage (lazy loading)

## Migration from Other Solutions

### From Port Forwarding
1. Create Cloudflare Tunnel
2. Test with both active
3. Update DNS to point to Cloudflare
4. Disable port forwarding
5. Verify all working

### From VPN
1. Set up Cloudflare Tunnel
2. Test connectivity
3. Migrate users to new URL
4. Decommission VPN

### From Self-Hosted Reverse Proxy
1. Create Cloudflare Tunnel
2. Run parallel with existing setup
3. Update DNS gradually
4. Monitor for issues
5. Shut down old setup

## Next Steps

1. ✅ Understand architecture
2. ✅ Review configuration options
3. 📋 Run setup script
4. 📋 Test connectivity
5. 📋 Enable security features
6. 📋 Set up monitoring
7. 📋 Plan backup strategy

---

**Last Updated**: April 2026  
**Status**: Complete Integration Guide
