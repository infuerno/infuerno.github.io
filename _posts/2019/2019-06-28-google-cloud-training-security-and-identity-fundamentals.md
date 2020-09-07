---
layout: post
title: "Google Cloud Training: Security & Identity Fundamentals"
---
https://google.qwiklabs.com/quests/40

# IAM Custom Roles

Roles bundle one or more permissions. **Predefined roles** are created and maintained by Google. **Custom roles** are user-defined.

Custom roles can be created at the organization level and at the project level, but not at the folder level.

Permissions are represented in the form `<service>.<resource>.<verb>` e.g. `compute.instances.list`.

Custom roles can only be used to grant permissions in policies for the same project or organization that owns the roles or resources under them. You cannot grant custom roles from one project or organization on a resource owned by a different project or organization.

* Create a custom role from a yaml file: `gcloud iam roles create editor --project $DEVSHELL_PROJECT_ID --file role-definition.yaml`
* List custom roles: `gcloud iam roles list --project $DEVSHELL_PROJECT_ID`

## General approach to updating

Common approach for updating is to read data, update locally, then send modified data for update. However, this pattern could conflict if more than one process is trying to udpate at the same time.

Cloud IAM solves this problem using an `etag` property in custom roles. This property is used to verify if the custom role has changed since the last request. When making a request to Cloud IAM with an `etag` value, Cloud IAM compares the etag value in the request with the existing etag value associated with the custom role. It writes the change only if the `etag` values match.

* View the current `etag` value using `gcloud iam roles describe editor --project $DEVSHELL_PROJECT_ID`
* Create a yaml file with current output
* Update yaml
* Update permissions: `gcloud iam roles update editor --project $DEVSHELL_PROJECT_ID --file new-role-definition.yaml`
* To disable, simply update the "stage" to DISABLED
* To deprecate, set the stage to DEPRECATED (and additionally set the `deprecation_message`)
* To delete use the `delete` command: `gcloud iam roles delete editor --project $DEVSHELL_PROJECT_ID` (`undelete`able for 7 days)

# Service Accounts and Roles: Fundamentals

Service accounts are a special type of Google account that grant permissions to virtual machines instead of end users. An application can use the service account to call Google APIs (instead of a user). e.g. VM may run under a service account and access the resources / APIs its needs.

* User-managed service accounts: A Compute Engine Service account is created by default when creating a new project (if Compute Engine API is enabled). It is `PROJECT_NUMBER-compute@developer.gserviceaccount.com`. Similarily for App Engines (if a project has one) - `PROJECT_ID@appspot.gserviceaccount.com`
* Google-managed service accounts. Additional accounts created and managed by google. e.g. the Google API service account: `PROJECT_NUMBER@cloudservices.gserviceaccount.com`. DO NOT REMOVE THIS ACCOUNT.

## Creating a service account

* Following the 2 automatically created service accounts, 98 service accounts can additionally be created.
* Create a service account: `gcloud iam service-accounts create my-sa-123 --display-name "my service account"`
* Service accounts can be treated as resources in their own right (and other users can be given permissions based on them). For example: if a VM is run under a service account, another user can be given the `serviceAccountUser` role to be grated permissions to start the VM (sounds strange! Why not just give permissions based on the VM instead?)

## Granting Roles to Service Accounts

`gcloud projects add-iam-policy-binding $DEVSHELL_PROJECT_ID --member serviceAccount:my-sa-123@$DEVSHELL_PROJECT_ID.iam.gserviceaccount.com --role roles/editor`

# VPC Network Peering

Allows private connectivity across two VPC networks regardless of whether or not they belong to the same project or the same organization.

Advantages:

* lower network latency
* services not exposed to public internet (regular VPN wouldn't be though?)
* GCP costs lower since use internal IP addressing not external

Setting up a network and VM in one project:

* Set project in shell: `gcloud config set project <PROJECT_ID>`
* Create custom network: `gcloud compute networks create network-a --subnet-mode custom`
* Create a subnet: `gcloud compute networks subnets create network-a-central --network network-a --range 10.0.0.0/16 --region us-central1`
* Create a vm in the subnet: `gcloud compute instances create vm-a --zone us-central1-a --network network-a --subnet network-a-central`
* Enable SSH and ping: `gcloud compute firewall-rules create network-a-fw --network network-a --allow tcp:22,icmp`

# User Authentication: Identity-Aware Proxy

Authenticating users of your web app is often necessary, and usually requires special programming in your app. For Google Cloud Platform apps you can hand those responsibilities off to the Identity-Aware Proxy service.

Identity-Aware Proxy (IAP) is a Google Cloud Platform service that intercepts web requests sent to your application, authenticates the user making the request using the Google Identity Service, and only lets the requests through if they come from a user you authorize. In addition, it can modify the request headers to include information about the authenticated user.

* Deploy the app - `gcloud app deploy` - with no authorization
* Test access - `gcloud app browse`
* Configure IAP consent screen: host url, homepage url, privacy url etc
* Turn on IAP
* Test access - not authorized
* Allow email (tick checkbox - add email, role Cloud IAP/IAP-Secured Web App Use)
* Test access - only email given access is now authorized
* Clear the login cookie by appending: `/_gcp_iap/clear_login_cookie` - should be requested to reauthenticate
* Now the IAP will provider two extra headers when forwarding requests to your application: `X-Goog-Authenticated-User-Email` and `X-Goog-Authenticated-User-ID`

# Getting Started with Cloud KMS

Cloud KMS is a cryptographic key management service on GCP. Ensure the API is enabled e.g. `gcloud services enable cloudkms.googleapis.com`

## Create a Keyring and Cryptokey

In order to encrypt the data, you need to create a KeyRing and a CryptoKey. KeyRings are useful for grouping keys. Keys can be grouped by any conceptual grouping e.g. `test`, `staging`, `prod`.

These examples will use the KeyRing `test` and the CryptoKey `qwiklab`.

* Create the KeyRing: `gcloud kms keyrings create test --location global`
* Create the CryptoKey: `gcloud kms keys create qwiklab --location global --keyring test --purpose encryption`
    * Note: CryptoKeys and KeyRings cannot be deleted in Cloud KMS!
* Encode text file using base64: `cat file.txt | base64 -w0` (base64 encoding allows binary data to be encoded as plain text)
* Send this to the API to encrypt: 
```
curl -v "https://cloudkms.googleapis.com/v1/projects/$DEVSHELL_PROJECT_ID/locations/global/keyRings/$KEYRING_NAME/cryptoKeys/$CRYPTOKEY_NAME:encrypt" \
  -d "{\"plaintext\":\"$PLAINTEXT\"}" \
  -H "Authorization:Bearer $(gcloud auth application-default print-access-token)"\
  -H "Content-Type: application/json"
```
* Save the `ciphertext` field of the resulting JSON to a file using the `jq` tool: `jq .ciphertext -r > 1.encrypted`
* Test by sending the the API to decrypt:
```
curl -v "https://cloudkms.googleapis.com/v1/projects/$DEVSHELL_PROJECT_ID/locations/global/keyRings/$KEYRING_NAME/cryptoKeys/$CRYPTOKEY_NAME:decrypt" \
  -d "{\"ciphertext\":\"$(cat 1.encrypted)\"}" \
  -H "Authorization:Bearer $(gcloud auth application-default print-access-token)"\
  -H "Content-Type:application/json" \
| jq .plaintext -r | base64 -d
```

## Configure IAM Permissions

Two major sets of permissions: permissions to manage KMS resources i.e. keys, keyrings: `cloudkms.admin`; permissions to access KMS resources to encrypt and decrypt data: `cloudkms.cryptoKeyEncrypterDecrypter`



