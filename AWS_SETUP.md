### 1. Request DNS Certificate

For this step you will require two things:

1. A domain name for the DP Dash application
2. The ability to set CNAME records for that domain which reference AWS DNS names

Log in to your AWS console and navigate to the Certificate Manager service.

![Screenshot of the AWS Certificate Manager link](/doc/assets/aws_setup/01_request_certificate//create_certificate_01.png)

Click the Request button in the top right corner.

![Screenshot of the Request Certificate button](/doc/assets/aws_setup/01_request_certificate//create_certificate_02.png)

Select "Request a public certificate".

![Screenshot of the Request Certificate form](/doc/assets/aws_setup/01_request_certificate//create_certificate_04.png)

Enter the fully qualified domain name at which the DP Dash app will be hosted, e.g. `dpdash.mydomain.com` if using a subdomain. Leave all other settings unchanged and click "Request".

AWS will provide a CNAME record to add to your DNS records. Set this record in the management system for your domain and AWS will automatically verify it and create your certificate.

![Screenshot of CNAME values for certificate verification](/doc/assets/aws_setup/01_request_certificate//create_certificate_05.png)

Copy the ARN of the issued certificate and save it locally. We will use it when configuring the deployment for your environment.

![Screenshot of ARN for certificate](/doc/assets/aws_setup/01_request_certificate//create_certificate_06.png)

### 2. Create AWS Role for Github Actions

Navigate to the IAM service in the AWS Console.

![Screenshot of the IAM link](/doc/assets/aws_setup/02_create_github_role/create_github_role_01.png)

Select "Roles" from the IAM Dashboard and click the Create button.

![Screenshot of IAM dashboard](/doc/assets/aws_setup/02_create_github_role/create_github_role_02.png)

For Trusted Entity select "Web Identity". For Identity Provider select "token.actions.githubusercontent.com". For Audience select "sts.amazonaws.com". Enter your Github Organization Name and the repo you wish to grant access to. Click "Create".

![Screenshot of role creation form with values filled out](/doc/assets/aws_setup/02_create_github_role/create_github_role_03.png)

Copy the ARN of the new role and save it locally. We will use it when configuring the deployment for your environment.

### 3. Bootstrap the CDK

This step will only need to be completed if the CDK has not been bootstrapped for your account/AWS environment. Ensure you are logged in via the AWS CLI. From the root of the project directory run:

```bash
npm i
npm run bootstrap
```

### 4. Set Github Action Variables and Deploy

Navigate to your Github repository and select the Settings tab. Open the "Secrets and Variables" menu on the left-hand side and select "Actions", then "New Variable".

![Screenshot of the Github Settings Menu](/doc/assets/aws_setup/04_set_github_variables/set_github_variables_01.png)

![Screenshot of Github Actions Variables](/doc/assets/aws_setup/04_set_github_variables/set_github_variables_02.png)

Create 2 variables.

1. Variable Name: CERT_ARN, Variable Value: ARN of your AWS Certificate from Step 1.
2. Variable Name: ROLE_ARN, Variable Value: ARN of your Role from Step 2.

Navigate to the Actions tab and the Deploy Infrastructure workflow. Select "Run Workflow". The application will deploy.

![Screenshot of Actions tab with Run Workflow button](/doc/assets/aws_setup/04_set_github_variables/set_github_variables_03.png)
