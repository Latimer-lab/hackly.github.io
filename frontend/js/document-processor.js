class DocumentProcessor {
  constructor() {
    this.processingEndpoint = 'https://your-region-your-project.cloudfunctions.net/processDocument';
  }

  async processDocument(documentId) {
    try {
      // Show processing state in UI
      this.updateUIState('processing');

      const response = await fetch(this.processingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update UI with results
      this.updateUIState('completed', result.result);
      return result;
    } catch (error) {
      console.error('Error processing document:', error);
      this.updateUIState('error', null, error.message);
      throw error;
    }
  }

  updateUIState(state, result = null, error = null) {
    const statusElement = document.getElementById('processing-status');
    const resultsElement = document.getElementById('processing-results');

    switch (state) {
      case 'processing':
        statusElement.textContent = 'Processing document...';
        statusElement.className = 'processing';
        break;
      case 'completed':
        statusElement.textContent = 'Processing completed!';
        statusElement.className = 'completed';
        if (result) {
          this.displayResult(result);
        }
        break;
      case 'error':
        statusElement.textContent = `Error: ${error}`;
        statusElement.className = 'error';
        break;
    }
  }

  displayResult(result) {
    const resultsContainer = document.getElementById('processing-results');
    resultsContainer.innerHTML = `
      <div class="result-content">
        ${result}
      </div>
    `;
  }
} 