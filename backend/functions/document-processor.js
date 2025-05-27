const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude AI client
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Function to process a document with Claude
exports.processDocument = functions.https.onRequest(async (req, res) => {
  const cors = require('cors')({ 
    origin: [
      'http://127.0.0.1:5500',
      'https://hackly.tech',
      'https://gethackly.github.io'
    ],
    methods: ['POST', 'OPTIONS'],
    credentials: true
  });

  return cors(req, res, async () => {
    try {
      const { documentId } = req.body;
      
      if (!documentId) {
        throw new Error('Document ID is required');
      }

      const db = admin.firestore();
      const docRef = db.collection('documents').doc(documentId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Document not found');
      }

      const documentData = doc.data();

      // Update status to processing
      await docRef.update({
        processingStatus: 'processing',
        processingStartedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Process with Claude
      const response = await claude.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Please analyze and process the following content: ${documentData.content}`
        }]
      });

      const result = response.content[0].text;

      // Store processing results
      await docRef.update({
        processingStatus: 'completed',
        processingCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
        aiResult: result,
        lastProcessedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        message: 'Document processed successfully',
        documentId: documentId,
        result: result
      });
    } catch (error) {
      console.error('Error processing document:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}); 