# Cloudflare Tunnel Setup Guide

Complete step-by-step guide to set up Cloudflare Tunnel for remote access to AstroAI.

## Prerequisites

- Cloudflare account (free tier works)
- Domain registered with Cloudflare (or add existing domain)
- Docker running with AstroAI services
- Cloudflare CLI (`cloudflared`) installed

## Step 1: Install Cloudflare CLI

### Windows (PowerShell)

```powershell
# Download latest release
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# Move to PATH
Move-Item cloudflared.exe "C:\Program Files\cloudflared\cloudflared.exe"

# Verify installation
cloudflared --version
```

Or use Chocolatey:
```powershell
choco install cloudflare-warp
```

### Linux

```bash
curl -L --output cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.tgz
tar -xzf cloudflared.tgz
sudo mv cloudflared /usr/local/bin/
sudo chmod +x /usr/local/bin/cloudflared
cloudflared --version
```

### macOS

```bash
brew install cloudflare/cloudflare/cloudflared
cloudflared --version
```

## Step 2: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This opens a browser window where you:
1. Log in to your Cloudflare account
2. Select your domain
3. Authorize the tunnel
4. Credentials are saved locally

## Step 3: Create Tunnel

```bash
cloudflared tunnel create astroai
```

Output will show:
```
Tunnel credentials written to ~/.cloudflared/astroai.json
Tunnel ID: <your-tunnel-id>
```

**Save the Tunnel ID** - you'll need it for DNS records.

## Step 4: Configure Tunnel Routing

### Option A: Using Configuration File (Recommended)

1. Copy `config.yml` to your Cloudflare credentials directory:

**Windows:**
```powershell
Copy-Item config.yml "$env:USERPROFILE\.cloudflared\config.yml"
```

**Linux/macOS:**
```bash
cp config.yml ~/.cloudflared/config.yml
```

2. Edit the file and replace:
   - `yourdomain.com` with your actual domain
   - `/path/to/.cloudflared/astroai.json` with actual path

### Option B: Using Command Line

```bash
# Create DNS records
cloudflared tunnel route dns astroai astroai.yourdomain.com
cloudflared tunnel route dns astroai api.astroai.yourdomain.com
```

## Step 5: Verify Services Running

Before starting tunnel, ensure services are running:

```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

Both should respond successfully.

## Step 6: Start Tunnel

### Option A: Run in Foreground (Testing)

```bash
cloudflared tunnel run astroai
```

You'll see output like:
```
2026-04-03T02:30:00Z INF Starting tunnel astroai
2026-04-03T02:30:00Z INF Registered tunnel connection
```

### Option B: Run as Service (Production)

**Windows:**
```powershell
# Install as service
cloudflared service install

# Start service
Start-Service cloudflared

# Check status
Get-Service cloudflared
```

**Linux (systemd):**
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

**macOS:**
```bash
sudo cloudflared service install
sudo launchctl start com.cloudflare.cloudflared
```

## Step 7: Verify Remote Access

### Check Tunnel Status

```bash
cloudflared tunnel list
```

Output shows:
```
ID                                   NAME     CREATED              CONNECTIONS
<tunnel-id>                          astroai  2026-04-03T02:30:00Z 2/2
```

### Test Remote Access

1. **Frontend**: Open `https://astroai.yourdomain.com` in browser
2. **Backend**: `curl https://api.astroai.yourdomain.com/health`

Both should work over HTTPS (Cloudflare provides certificate).

## Step 8: Configure DNS Records (If Not Using Route Command)

If you didn't use `cloudflared tunnel route dns`:

1. Go to Cloudflare Dashboard
2. Select your domain
3. Go to DNS Records
4. Add CNAME records:

| Type | Name | Target |
|------|------|--------|
| CNAME | astroai | `<tunnel-id>.cfargotunnel.com` |
| CNAME | api.astroai | `<tunnel-id>.cfargotunnel.com` |

## Troubleshooting

### Tunnel Won't Start

```bash
# Check credentials file exists
ls ~/.cloudflared/astroai.json

# Verify tunnel exists
cloudflared tunnel list

# Check for permission errors
cloudflared tunnel run astroai --loglevel debug
```

### Can't Access Remote URL

1. **Check tunnel is running:**
   ```bash
   cloudflared tunnel list
   ```

2. **Check DNS records:**
   - Go to Cloudflare Dashboard
   - Verify CNAME records point to tunnel

3. **Check local services:**
   ```bash
   curl http://localhost:3000
   curl http://localhost:8000/health
   ```

4. **Check firewall:**
   - Ensure ports 3000 and 8000 are not blocked
   - Cloudflare tunnel doesn't require port forwarding

### Connection Refused

- Ensure Docker services are running: `docker-compose ps`
- Check service logs: `docker-compose logs backend frontend`
- Verify ports: `netstat -an | grep 3000` (Windows) or `lsof -i :3000` (Linux/macOS)

### HTTPS Certificate Issues

- Cloudflare provides automatic HTTPS
- Wait 5-10 minutes after creating DNS records
- Clear browser cache
- Try incognito/private window

## Advanced Configuration

### Custom Headers

Add to `config.yml`:
```yaml
ingress:
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
    originRequest:
      headers:
        add:
          X-Custom-Header: value
```

### Load Balancing

```yaml
ingress:
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
  - hostname: astroai.yourdomain.com
    service: http://localhost:3001  # Backup
```

### Rate Limiting

Configure in Cloudflare Dashboard:
1. Go to Security → Rate Limiting
2. Create rule for `api.astroai.yourdomain.com`
3. Set threshold and action

## Monitoring

### View Tunnel Analytics

```bash
# Real-time logs
cloudflared tunnel logs astroai

# With filtering
cloudflared tunnel logs astroai --level debug
```

### Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Select domain
3. Go to Analytics → Traffic
4. View tunnel traffic and performance

## Cleanup

### Stop Tunnel

```bash
# If running in foreground
Ctrl+C

# If running as service
cloudflared service uninstall
```

### Delete Tunnel

```bash
cloudflared tunnel delete astroai
```

This removes the tunnel but keeps DNS records (delete manually).

## Security Best Practices

1. **Keep credentials secure:**
   - Don't commit `~/.cloudflared/` to git
   - Restrict file permissions: `chmod 600 ~/.cloudflared/astroai.json`

2. **Use Cloudflare security features:**
   - Enable WAF (Web Application Firewall)
   - Set up rate limiting
   - Enable DDoS protection

3. **Monitor access:**
   - Check tunnel logs regularly
   - Review Cloudflare analytics
   - Set up alerts

4. **Rotate credentials:**
   - Periodically delete and recreate tunnel
   - Update DNS records

## Next Steps

1. ✅ Tunnel is running
2. ✅ Remote access verified
3. 📋 Set up monitoring and alerts
4. 📋 Configure security rules
5. 📋 Plan backup tunnel

---

## Quick Reference

```bash
# Install
cloudflared --version

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create astroai

# Configure DNS
cloudflared tunnel route dns astroai astroai.yourdomain.com

# Run tunnel
cloudflared tunnel run astroai

# Check status
cloudflared tunnel list

# View logs
cloudflared tunnel logs astroai

# Delete tunnel
cloudflared tunnel delete astroai
```

---

**Last Updated**: April 2026  
**Cloudflared Version**: Latest  
**Status**: Complete Setup Guide
