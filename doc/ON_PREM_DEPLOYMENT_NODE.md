# Running the Application On Premise with Node.js

## Prerequisites

1. **Node.js**: Version 22.x must be installed on your system
2. **MongoDB**: A MongoDB instance (version 5.x or higher) must be running and accessible
3. **SSL/HTTPS Proxy**: An SSL-terminating reverse proxy (e.g., Nginx, Apache, HAProxy) must be configured to handle HTTPS traffic and forward requests to the Node.js application
4. **System Dependencies**:
   - `wget` (for downloading AWS RDS certificate bundle)
   - Build tools for native npm modules (e.g., `build-essential` on Ubuntu/Debian, Xcode Command Line Tools on macOS)

## Setup Instructions

### 1. Install Node.js

Install Node.js version 22.x on your system. You can download it from [nodejs.org](https://nodejs.org/) or use a version manager like [nvm](https://github.com/nvm-sh/nvm):

```bash
# Using nvm (recommended)
nvm install 22
nvm use 22

# Verify installation
node --version  # Should show v22.x.x
npm --version
```

### 2. Clone and Prepare the Application

```bash
# Clone the repository (or extract from archive)
cd /path/to/dpdash

# Download AWS RDS certificate bundle (required for production)
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

# Install dependencies
npm install
```

### 3. Environment Configuration

i. Create a `.env` file in the application root directory

ii. Copy the contents from `.env.sample`:

```bash
cp .env.sample .env
```

iii. Edit the `.env` file and set the following required variables:

```bash
# MongoDB Configuration
# Provide the full connection string
MONGODB_URI=mongodb://<your-mongodb-username>:<your-mongodb-password>@<mongodb-host>:<mongodb-port>/dpdmongo?authSource=admin

# Session Configuration
SESSION_SECRET=<your-secure-session-secret>

# SMTP Configuration
SMTP_HOST=<your-smtp-server>
SMTP_PORT=25
SMTP_USER=
SMTP_PASS=
SMTP_REJECT_UNAUTHORIZED=false

# Application Configuration
ADMIN_EMAIL=<admin-email>
EMAIL_SENDER=<sender-email>
HOME_URL=<your-application-url>

# API Configuration
IMPORT_API_USERS=<comma-separated-api-users>
IMPORT_API_KEYS=<comma-separated-api-keys>

# Server Configuration (optional)
SERVER_PORT=8000
```

**Important Notes:**

- `MONGODB_URI`: Update the connection string with your MongoDB server's hostname, port, username, and password
- `SESSION_SECRET`: Generate a strong random string for session encryption using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `HOME_URL`: Should include the full protocol and domain (e.g., `https://dpdash.example.com`)
  - **Critical**: Session cookies automatically use secure mode when `HOME_URL` starts with `https://`
  - When using HTTPS, users must access the app via HTTPS or authentication will fail
  - For local testing over HTTP, use `http://localhost:8000` in `HOME_URL`
- `SERVER_PORT`: The application will listen on port 8000 by default. Your SSL proxy should forward traffic to this port.

### 4. Build the Application

The application requires building both the frontend assets and transpiling the backend code:

```bash
# Set Node.js options for legacy OpenSSL support
export NODE_OPTIONS=--openssl-legacy-provider

# Build frontend assets with webpack
npm run build

# Transpile backend code with Babel
npm run transpile
```

This will:

- Compile React frontend code into `public/` directory
- Transpile ES6+ server code into `dist/` directory
- Copy email templates to `dist/mailer/templates/`

### 5. Configure SSL/HTTPS Proxy

**Important**: The Node.js application runs on HTTP only (default port 8000). You **must** configure an SSL-terminating reverse proxy to handle HTTPS traffic.

The SSL proxy configuration is outside the scope of this document, but your proxy should:

- Listen on port 443 (HTTPS)
- Terminate SSL/TLS connections
- Forward requests to `http://localhost:8000` (or the port specified in `SERVER_PORT`)
- Set appropriate headers (e.g., `X-Forwarded-For`, `X-Forwarded-Proto`)

Popular options include:

- Nginx
- Apache HTTP Server
- HAProxy
- Caddy

Consult your proxy's documentation for configuration details.

### 6. Start the Application

Start the application in production mode:

```bash
npm start
```

This runs `NODE_ENV=production node dist/bin/www.js` and starts the HTTP server on port 8000 (or the port specified in `SERVER_PORT`).

**For production deployments**, consider using a process manager to keep the application running:

#### Option A: Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start dist/bin/www.js --name dpdash --env production

# Save the PM2 process list
pm2 save

# Configure PM2 to start on system boot
pm2 startup
```

#### Option B: Using systemd

Create a systemd service file at `/etc/systemd/system/dpdash.service`:

```ini
[Unit]
Description=DPdash Application
After=network.target

[Service]
Type=simple
User=<your-user>
WorkingDirectory=/path/to/dpdash
Environment=NODE_ENV=production
Environment=NODE_OPTIONS=--openssl-legacy-provider
ExecStart=/usr/bin/node dist/bin/www.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable dpdash
sudo systemctl start dpdash
sudo systemctl status dpdash
```

### 7. Verify the Application

Check that the application is running:

```bash
# Check if the application is listening on port 8000
curl http://localhost:8000

# Check application logs (if using PM2)
pm2 logs dpdash

# Check application logs (if using systemd)
sudo journalctl -u dpdash -f
```

Access the application through your SSL proxy at the configured `HOME_URL` (e.g., `https://dpdash.example.com`).

## MongoDB Operations

### Connecting to MongoDB

If MongoDB is running on a remote server, you can connect using [mongosh](https://www.mongodb.com/try/download/shell):

```bash
mongosh "mongodb://<username>:<password>@<mongodb-host>:<mongodb-port>/dpdmongo?authSource=admin"
```

Replace `<username>`, `<password>`, `<mongodb-host>`, and `<mongodb-port>` with your actual MongoDB connection details.

### Importing Charts, Configs, and Users

You can import MongoDB collections using `mongoimport`:

```bash
mongoimport --uri="mongodb://<username>:<password>@<mongodb-host>:<mongodb-port>/dpdmongo?authSource=admin" --collection=charts charts.json
mongoimport --uri="mongodb://<username>:<password>@<mongodb-host>:<mongodb-port>/dpdmongo?authSource=admin" --collection=configs configs.json
mongoimport --uri="mongodb://<username>:<password>@<mongodb-host>:<mongodb-port>/dpdmongo?authSource=admin" --collection=users users.json
```

The JSON files can be obtained from your existing DPdash deployment (contact your DPdash admin for access).

### Importing Data

Data import is handled through the application's web interface or API. Refer to the main DPdash documentation for data import procedures.

## Troubleshooting

### Application won't start

- Verify Node.js version: `node --version` (should be v22.x.x)
- Check that all dependencies are installed: `npm install`
- Verify the build completed successfully: check that `dist/` and `public/` directories exist
- Check `.env` file has all required variables set
- Review application logs for specific error messages

### Cannot connect to MongoDB

- Verify MongoDB is running and accessible from the application server
- Check `MONGODB_URI` in `.env` file has correct hostname, port, username, and password
- Test MongoDB connection manually with `mongosh`
- Verify network connectivity and firewall rules allow connection to MongoDB port

### SSL/HTTPS issues

- Verify your SSL proxy is running and configured correctly
- Check that the proxy is forwarding to the correct port (default 8000)
- Ensure SSL certificates are valid and properly installed in your proxy
- Check proxy logs for connection errors

### Port already in use

If port 8000 is already in use, you can change it by setting `SERVER_PORT` in your `.env` file:

```bash
SERVER_PORT=8080
```

Remember to update your SSL proxy configuration to forward to the new port.

## Updating the Application

To update the application to a new version:

```bash
# Stop the application
pm2 stop dpdash  # or: sudo systemctl stop dpdash

# Pull latest code or extract new version
git pull  # or extract from archive

# Install any new dependencies
npm install

# Rebuild the application
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
npm run transpile

# Restart the application
pm2 restart dpdash  # or: sudo systemctl start dpdash
```

## Security Considerations

1. **Never run the application as root** - use a dedicated user account
2. **Keep MongoDB credentials secure** - restrict file permissions on `.env` file: `chmod 600 .env`
3. **Use strong passwords** - for MongoDB users and `SESSION_SECRET`
4. **Keep Node.js and dependencies updated** - regularly update to patch security vulnerabilities
5. **Configure your SSL proxy properly** - use strong TLS versions and cipher suites
6. **Restrict MongoDB access** - use firewall rules to limit MongoDB connections to trusted hosts only
7. **Regular backups** - backup MongoDB data and application configuration regularly
