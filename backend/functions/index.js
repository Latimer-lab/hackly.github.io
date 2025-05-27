const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ 
  origin: [
    'http://127.0.0.1:5500',
    'https://hackly.tech',
    'https://gethackly.github.io'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
});
const fetch = require('node-fetch');

// Initialize Firebase Admin with ignoreUndefinedProperties
admin.initializeApp({
  ignoreUndefinedProperties: true
});

// Initialize Google Drive API with service account
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account.json',
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/documents'
  ]
});

const drive = google.drive({ version: 'v3', auth });
const docs = google.docs({ version: 'v1', auth });

// Get the Google Drive folder ID from Firebase config
const GOOGLE_DRIVE_FOLDER_ID = '180V-h3mTTXPnhFE2nMFrv2oWM9m6Xi0J';

// Create a new document in Firestore and Google Drive
exports.create_doc = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { title = '', content = '' } = req.body || {};

      // Create a new Google Doc
      const fileMetadata = {
        name: title || 'Untitled Document',
        mimeType: 'application/vnd.google-apps.document',
        parents: [GOOGLE_DRIVE_FOLDER_ID]
      };

      let googleDocData = {
        webContentLink: 'https://docs.google.com/document/d/placeholder',
        webViewLink: 'https://docs.google.com/document/d/placeholder/preview',
        embedLink: 'https://docs.google.com/document/d/placeholder/preview'
      };

      try {
        const file = await drive.files.create({
          resource: fileMetadata,
          fields: 'id, webViewLink, webContentLink'
        });

        if (file.data) {
          // Get the document ID
          const docId = file.data.id;

          // Create an embed link
          const embedLink = `https://docs.google.com/document/d/${docId}/preview`;

          // Set permissions to anyone with the link can view
          await drive.permissions.create({
            fileId: docId,
            requestBody: {
              role: 'reader',
              type: 'anyone'
            }
          });

          googleDocData = {
            webContentLink: file.data.webContentLink || googleDocData.webContentLink,
            webViewLink: file.data.webViewLink || googleDocData.webViewLink,
            embedLink: embedLink
          };
        }
      } catch (driveError) {
        console.error('Error creating Google Doc:', driveError);
        // Continue with placeholder URLs
      }

      // Create document in Firestore
      const docRef = await admin.firestore().collection('documents').add({
        title: title || 'Untitled Document',
        content: content || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'processed',
        views: 0,
        googleDocUrl: googleDocData.webContentLink,
        googleDocWebViewUrl: googleDocData.webViewLink,
        googleDocEmbedUrl: googleDocData.embedLink
      });

      // Send Discord notification
      try {
        const webhookUrl = 'https://discord.com/api/webhooks/1234567890/your-webhook-token';
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `New document created: ${title}\nView it here: ${googleDocData.webViewLink}`
          })
        });
      } catch (webhookError) {
        console.error('Error sending Discord notification:', webhookError);
        // Continue without Discord notification
      }

      res.json({
        success: true,
        documentId: docRef.id,
        googleDocUrl: googleDocData.webContentLink,
        googleDocWebViewUrl: googleDocData.webViewLink,
        googleDocEmbedUrl: googleDocData.embedLink
      });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});

// Get document status and URLs
exports.get_doc_status = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { documentId } = req.query || {};
      
      if (!documentId) {
        throw new Error('Document ID is required');
      }

      const docRef = admin.firestore().collection('documents').doc(documentId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Document not found');
      }

      res.json({
        success: true,
        data: doc.data()
      });
    } catch (error) {
      console.error('Error getting document status:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});

// Minimal test function to ensure deployment
exports.helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.json({ message: 'Hello from Firebase!' });
  });
}); 