# Hackly-MVP Project Configuration Guide

## Firebase Configuration

### Project Details
- Project ID: `hackly-mvp`
- Project Console: https://console.firebase.google.com/project/hackly-mvp/overview

### Service Account
The service account credentials are stored in `backend/functions/service-account.json`. This file contains sensitive information and should never be committed to version control.

Service Account Email: `hackly-cloud-service-account@hackly-mvp.iam.gserviceaccount.com`

### Google Drive Integration
- Google Drive Folder ID: `180V-h3mTTXPnhFE2nMFrv2oWM9m6Xi0J`
- Folder URL: https://drive.google.com/drive/u/0/folders/180V-h3mTTXPnhFE2nMFrv2oWM9m6Xi0J

### Cloud Functions
Two main functions are deployed:

1. `create_doc`
   - URL: https://us-central1-hackly-mvp.cloudfunctions.net/create_doc
   - Method: POST
   - Body: `{ "title": "string", "content": "string" }`

2. `process_doc`
   - Trigger: Firestore document creation
   - Collection: `documents/{documentId}`

### Environment Variables
Firebase Functions config:
```bash
firebase functions:config:set google.drive_folder_id="180V-h3mTTXPnhFE2nMFrv2oWM9m6Xi0J"
```

### Required APIs
Make sure these APIs are enabled in Google Cloud Console:
- Cloud Functions API
- Cloud Build API
- Artifact Registry API
- Google Drive API
- Google Docs API

### Dependencies
Required npm packages in `backend/functions`:
```bash
npm install firebase-admin firebase-functions googleapis @google-cloud/local-auth cors
```

## Security Notes
1. The service account JSON file contains sensitive credentials and should be:
   - Kept secure and never shared
   - Added to .gitignore
   - Stored securely when deploying to production

2. The service account needs these permissions:
   - Cloud Functions Invoker
   - Service Account User
   - Storage Object Viewer

## Deployment Steps
1. Initialize Firebase:
   ```bash
   firebase init functions
   ```

2. Install dependencies:
   ```bash
   cd backend/functions
   npm install
   ```

3. Set environment variables:
   ```bash
   firebase functions:config:set google.drive_folder_id="YOUR_FOLDER_ID"
   ```

4. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```

## CORS Configuration
The functions are configured to accept requests from any origin. For production, you should restrict this to your specific domain.

## Troubleshooting
If you encounter CORS issues:
1. Check the function logs in Firebase Console
2. Verify the CORS configuration in the function code
3. Ensure the client is sending the correct headers

If you encounter Google Drive API issues:
1. Verify the service account has the correct permissions
2. Check if the Google Drive folder is shared with the service account email
3. Verify the folder ID is correct in the environment variables 