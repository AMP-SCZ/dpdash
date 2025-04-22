# Running the Application On Premise with Docker Compose

## Prerequisites

1. Docker and Docker Compose installed on your system
2. SSL Certificate files
3. Environment configuration

## Setup Instructions

### 1. SSL Certificate Setup

Obtain SSL certificate files from your certificate provider (e.g., Let's Encrypt) and place them in the application root:

- Save the certificate file as `default.crt`
- Save the private key file as `default.key`

These files will be mounted to the nginx container to enable HTTPS.

### 2. Environment Configuration

1. Create a `.env` file in the application root
2. Copy the contents from `.env.sample`
3. Set the following required variables:
   ```
   MONGODB_URI=mongodb://mongodb:27017/dpdmongo?authSource=admin
   SESSION_SECRET=<your-secure-session-secret>
   SMTP_HOST=<your-smtp-server>
   SMTP_PORT=587
   SMTP_USER=<your-smtp-username>
   SMTP_PASS=<your-smtp-password>
   ADMIN_EMAIL=<admin-email>
   EMAIL_SENDER=<sender-email>
   HOME_URL=<your-domain>
   IMPORT_API_USERS=<comma-separated-api-users>
   IMPORT_API_KEYS=<comma-separated-api-keys>
   ```

### 3. Launch the Application

From the application root directory, run:

```bash
docker compose up
```

This will start all required services:

- nginx (web server)
- node-app (application server)
- mongodb (database)

To run in detached mode:

```bash
docker compose up -d
```

To stop the application:

```bash
docker compose down
```

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
