# Cloudflare Tunnel Configuration

This directory contains configuration files and scripts for setting up Cloudflare Tunnel to expose AstroAI to the internet securely.

## Quick Start

### For Linux/macOS:
```bash
chmod +x setup.sh test-tunnel.sh
./setup.sh
```

### For Windows (PowerShell):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

## Files

| File | Purpose |
|------|---------|
| `config.yml` | Cloudflare Tunnel configuration (routing rules) |
| `SETUP.md` | Comprehensive setup guide with troubleshooting |
| `setup.sh` | Automated setup script for Linux/macOS |
| `setup.ps1` | Automated setup script for Windows |
| `test-tunnel.sh` | Connectivity test script for Linux/macOS |
| `test-tunnel.ps1` | Connectivity test script for Windows |
| `README.md` | This file |

## Prerequisites

1. **Cloudflare Account** (free tier works)
2. **Domain** registered with Cloudflare (or add existing domain)
3. **Docker** running with AstroAI services
4. **cloudflared CLI** installed

## Installation Steps

### 1. Install cloudflared CLI

**Windows (Chocolatey):**
```powershell
choco install cloudflare-warp
```

**Windows (Manual):**
- Download from: https://github.com/cloudflare/cloudflared/releases
- Extract and add to PATH

**Linux:**
```bash
curl -L --output cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.tgz
tar -xzf cloudflared.tgz
sudo mv cloudflared /usr/local/bin/
```

**macOS:**
```bash
brew install cloudflare/cloudflare/cloudflared
```

### 2. Run Setup Script

**Linux/macOS:**
```bash
./setup.sh
```

**Windows:**
```powershell
.\setup.ps1 -Domain yourdomain.com
```

The script will:
1. Authenticate with Cloudflare
2. Create tunnel
3. Configure DNS records
4. Copy configuration file
5. Verify local services
6. Start tunnel

### 3. Verify Access

After tunnel is running:

```bash
# Test connectivity
./test-tunnel.sh yourdomain.com

# Or manually:
curl https://astroai.yourdomain.com
curl https://api.astroai.yourdomain.com/health
```

## Manual Setup

If you prefer manual setup, follow the detailed guide in `SETUP.md`.

## Configuration

### Edit Routing Rules

Edit `~/.cloudflared/config.yml`:

```yaml
tunnel: astroai
credentials-file: ~/.cloudflared/astroai.json

ingress:
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
  - hostname: api.astroai.yourdomain.com
    service: http://localhost:8000
  - service: http_status:404
```

### Custom Headers

Add to ingress rule:
```yaml
- hostname: astroai.yourdomain.com
  service: http://localhost:3000
  originRequest:
    headers:
      add:
        X-Custom-Header: value
```

## Running as Service

### Linux (systemd):
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

### macOS:
```bash
sudo cloudflared service install
sudo launchctl start com.cloudflare.cloudflared
```

### Windows:
```powershell
cloudflared service install
Start-Service cloudflared
Get-Service cloudflared
```

## Monitoring

### View Tunnel Status
```bash
cloudflared tunnel list
```

### View Logs
```bash
# Real-time logs
cloudflared tunnel logs astroai

# Debug level
cloudflared tunnel logs astroai --level debug

# Last N entries
cloudflared tunnel logs astroai --num 20
```

### Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Select your domain
3. Go to Analytics → Traffic
4. View tunnel performance and traffic

## Troubleshooting

### Tunnel Won't Start
```bash
# Check credentials
ls ~/.cloudflared/astroai.json

# Check tunnel exists
cloudflared tunnel list

# Run with debug logging
cloudflared tunnel run astroai --loglevel debug
```

### Can't Access Remote URL
1. Verify tunnel is running: `cloudflared tunnel list`
2. Check DNS records in Cloudflare Dashboard
3. Verify local services: `curl http://localhost:3000`
4. Check firewall isn't blocking ports
5. Wait 5-10 minutes for DNS propagation

### Connection Refused
```bash
# Check Docker services
docker-compose ps

# Check service logs
docker-compose logs backend frontend

# Check ports
netstat -an | grep 3000  # Windows
lsof -i :3000            # Linux/macOS
```

### HTTPS Certificate Issues
- Cloudflare provides automatic HTTPS
- Wait 5-10 minutes after creating DNS records
- Clear browser cache
- Try incognito/private window

## Security

### Best Practices
1. Keep credentials secure: `chmod 600 ~/.cloudflared/astroai.json`
2. Don't commit credentials to git
3. Enable Cloudflare WAF (Web Application Firewall)
4. Set up rate limiting
5. Monitor access logs regularly

### Rotate Credentials
```bash
# Delete old tunnel
cloudflared tunnel delete astroai

# Create new tunnel
cloudflared tunnel create astroai

# Update DNS records
cloudflared tunnel route dns astroai astroai.yourdomain.com
```

## Advanced Configuration

### Load Balancing
```yaml
ingress:
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
  - hostname: astroai.yourdomain.com
    service: http://localhost:3001  # Backup
```

### Path-Based Routing
```yaml
ingress:
  - hostname: astroai.yourdomain.com
    path: /api/*
    service: http://localhost:8000
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
```

### Custom Error Pages
```yaml
ingress:
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
    originRequest:
      httpHostHeader: astroai.yourdomain.com
```

## Cleanup

### Stop Tunnel
```bash
# If running in foreground
Ctrl+C

# If running as service
sudo systemctl stop cloudflared
```

### Delete Tunnel
```bash
cloudflared tunnel delete astroai
```

This removes the tunnel but keeps DNS records (delete manually in Cloudflare Dashboard).

## Support

For issues:
1. Check logs: `cloudflared tunnel logs astroai --level debug`
2. Review `SETUP.md` troubleshooting section
3. Check Cloudflare status: https://www.cloudflarestatus.com
4. Visit Cloudflare docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

## Next Steps

1. ✅ Tunnel is running
2. ✅ Remote access verified
3. 📋 Set up monitoring and alerts
4. 📋 Configure security rules
5. 📋 Plan backup tunnel

---

**Last Updated**: April 2026  
**Status**: Complete
