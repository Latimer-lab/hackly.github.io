//ACCORDION

document.addEventListener("DOMContentLoaded", () => {
    const accordion_buttons = document.querySelectorAll(".accordion_button");

    accordion_buttons.forEach(button => {
        button.addEventListener("click", () => {
            const content = button.nextElementSibling;

            // Toggle the display of the content
            if (content.style.display === "block") {
                content.style.display = "none";
                button.classList.remove("active");
            } else {
                content.style.display = "block";
                button.classList.add("active");
            }
        });
    });
});

//IDEA FORM
async function createNewIdea(title, isMobile = false) {
    const errorMessage = isMobile ? document.getElementById("error_message_mobile") : document.getElementById("error_message");
    const submitButton = isMobile ? document.getElementById("submit_idea_mobile") : document.getElementById("submit_idea_desktop");
    const docModal = document.getElementById("doc_modal");
    const docIframe = document.getElementById("doc_iframe");
    
    try {
        // Disable the submit button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = "Creating...";
        
        // Call the Cloud Function to create document
        const response = await fetch('https://us-central1-hackly-mvp.cloudfunctions.net/create_doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create document');
        }

        // Clear the form
        if (isMobile) {
            document.getElementById("title_mobile").value = "";
        } else {
            document.getElementById("title_desktop").value = "";
        }
        
        // Show success message
        errorMessage.textContent = "Document created successfully!";
        errorMessage.style.color = "green";
        
        // Use the web view URL instead of embed URL
        if (data.doc_link) {
            // Configure iframe first
            docIframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
            docIframe.setAttribute('referrerpolicy', 'no-referrer');
            docIframe.src = data.doc_link;
            
            // Force modal to open immediately
            docModal.style.display = "block";
            docModal.style.opacity = "1";
            docModal.style.visibility = "visible";
            document.body.classList.add("no-scroll");
            
            // Ensure modal is visible
            setTimeout(() => {
                if (docModal.style.display !== "block") {
                    docModal.style.display = "block";
                    docModal.style.opacity = "1";
                    docModal.style.visibility = "visible";
                }
            }, 0);
        }
        
        // Reload the ideas list
        if (typeof loadIdeas === 'function') {
            loadIdeas();
        }
    } catch (error) {
        errorMessage.textContent = error.message || "Failed to create document. Please try again.";
        errorMessage.style.color = "red";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
    }
}

// Close modal functionality
document.getElementById("close_doc_modal").addEventListener("click", function(e) {
    e.preventDefault();
    const docModal = document.getElementById("doc_modal");
    const docIframe = document.getElementById("doc_iframe");
    docModal.style.display = "none";
    docIframe.src = "";
    document.body.classList.remove("no-scroll");
});

// Handle page transitions
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        document.body.style.transition = "opacity 0.5s ease-out";
        document.body.style.opacity = "0";
        
        setTimeout(() => {
            window.location.href = this.href;
        }, 500);
    });
});
