# Running the Application On Premise with Docker Compose

## Prerequisites

1. Docker and Docker Compose should be installed on your system.
2. Port `27017/tcp` should be opened through `firewall-cmd` for external mongodb connection.

## Setup Instructions

### 1. Environment Configuration

1. Create a `.env` file in application root directory
2. Copy the contents from `.env.sample`
3. Set the following required variables:
   ```
   MONGODB_URI=mongodb://mongodb:27017/dpdmongo?authSource=admin
   SESSION_SECRET=<your-secure-session-secret>
   SMTP_HOST=<your-smtp-server>
   SMTP_PORT=25
   SMTP_USER=
   SMTP_PASS=
   ADMIN_EMAIL=<admin-email>
   EMAIL_SENDER=<sender-email>
   HOME_URL=https://dpdash.local
   IMPORT_API_USERS=<comma-separated-api-users>
   IMPORT_API_KEYS=<comma-separated-api-keys>
   ```

To find `SMTP_HOST`, send yourself an email from the server. Open the email within Outlook and `View`-->`View message details`.
Look for something like:

```
Received: from unknown (HELO pnl-xtreme.partners.org) ([170.123.12.123])
  by ob1.hc6077-55.iphmx.com
```

The last one is the `SMTP_HOST`.

### 2. Local Domain Setup

The application is configured to use the hostname `dpdash.local`. Add this to your hosts file:

```
# On Linux/Mac: Edit /etc/hosts
# On Windows: Edit C:\Windows\System32\drivers\etc\hosts
127.0.0.1 dpdash.local
```

### 3. Generate Self-Signed Certificate

Run the provided script to generate a self-signed certificate:

```bash
chmod +x make-cert.sh
./make-cert.sh
```

It will create two files in `certs/` directory:

```
$ ls certs/
selfsigned.crt  selfsigned.key
```

### 4. Launch the Application

From the application root directory, run:

```bash
docker compose up
```

This will start all required services:

- nginx-proxy-manager (web server with admin UI)
- node-app (application server)
- mongodb (database)

To run in detached mode:

```bash
docker compose up -d
```

To include the SMTP testing server:

```bash
docker compose --profile smtp up
```

To stop the application:

```bash
docker compose down
```

### 5. Access the Application

- Access the application at: https://dpdash.local
- Access the Nginx Proxy Manager admin interface at: http://dpdash.local:81
  - Default login: admin@example.com / changeme

Note: Your browser will show a security warning because of the self-signed certificate. This is expected for local development.

#### Security Warning

Nginx Proxy Manager should not be exposed to the internet. It is recommended to run it behind another web server that handles authentication and SSL termination. It also isn't required for production, as you can configure SSL termination and authentication at the load balancer level. It is necessary for local development because the application uses secure cookies AND it is considered a best practice to route all traffic over https.

## Maintenance

### 1. Connecting directly to Mongo

Find the container ID of the mongo container with `docker ps` and then run `docker exec -it <container-id> /bin/bash` to get a terminal within the container. From there you can run `mongosh` to connect to the database.

### 2. Importing data

The `IMPORT_API_USERS` and `IMPORT_API_KEYS` environment variables are used to authenticate API requests to import data. You can use these credentials with the import script at https://github.com/AMP-SCZ/dpimport to import data to the database. The updated script is on the branch `381-update-import-script-to-json-payload` and can be run by creating a config file like so:

```yaml
api_url: http://your.app.example.com/api/v1/import/data/
api_user: importer
api_key: super_secret
```

And running the script with the following command:

```bash
python import.py -c config.yaml /PATH/TO/CSV/DATA
```
