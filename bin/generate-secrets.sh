#!/bin/bash

# Before executing:
# Login to the AWS CLI with an account that has access to the SSM service
# Set an environment variable for the MongoDB admin username named DPDASH_MONGODB_ADMIN_USER
# Set an environment variable as a comma separated list of usernames for the API users named DPDASH_IMPORT_API_USERS

aws ssm put-parameter \
<<<<<<< HEAD
    --name "DPDASH_MONGODB_ADMIN_USER_DEV" \
    --value $DPDASH_MONGODB_ADMIN_USER_DEV \
=======
    --name "DPDASH_MONGODB_ADMIN_USER" \
    --value $DPDASH_MONGODB_ADMIN_USER \
>>>>>>> 474a383 (add cdk infra with ci/cd)
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

aws ssm put-parameter \
<<<<<<< HEAD
    --name "DPDASH_MONGODB_ADMIN_PASSWORD_DEV" \
=======
    --name "DPDASH_MONGODB_ADMIN_PASSWORD" \
>>>>>>> 474a383 (add cdk infra with ci/cd)
    --value $(openssl rand -base64 32 | tr -d "+=/") \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

aws ssm put-parameter \
<<<<<<< HEAD
    --name "DPDASH_IMPORT_API_USERS_DEV" \
    --value $DPDASH_IMPORT_API_USERS_DEV \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

export DPDASH_NUMBER_OF_USERS=$(($(echo $DPDASH_IMPORT_API_USERS_DEV | tr -cd , | wc -c) + 1))
aws ssm put-parameter \
    --name "DPDASH_IMPORT_API_KEYS_DEV" \
=======
    --name "DPDASH_IMPORT_API_USERS" \
    --value $DPDASH_IMPORT_API_USERS \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

export DPDASH_NUMBER_OF_USERS=$(($(echo $DPDASH_IMPORT_API_USERS | tr -cd , | wc -c) + 1))
aws ssm put-parameter \
    --name "DPDASH_IMPORT_API_KEYS" \
>>>>>>> 474a383 (add cdk infra with ci/cd)
    --value $(
      for i in seq $DPDASH_NUMBER_OF_USERS; do
        echo $(openssl rand -base64 32 | tr -d "+=/")
      done | tr '\n' ','
    ) \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

aws ssm put-parameter \
<<<<<<< HEAD
    --name "DPDASH_SESSION_SECRET_DEV" \
=======
    --name "DPDASH_SESSION_SECRET" \
>>>>>>> 474a383 (add cdk infra with ci/cd)
    --value $(openssl rand -base64 32 | tr -d "+=/") \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"
