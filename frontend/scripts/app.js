// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhqF7t5-3pKVf5a3O8xR60OokawSRuiK0",
  authDomain: "hackly-mvp.firebaseapp.com",
  projectId: "hackly-mvp",
  storageBucket: "hackly-mvp.firebasestorage.app",
  messagingSenderId: "827934530206",
  appId: "1:827934530206:web:74e3b56884475c871bf98f",
  measurementId: "G-J140SVTKRV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Add these variables for sorting and searching
let currentSortField = 'createdAt';
let currentSortDirection = 'desc';
let currentSearchTerm = '';
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener("DOMContentLoaded", () => {
    loadIdeas();

    const createTabButton = document.getElementById("create_tab_button");
    const ideaForm = document.getElementById("idea_form");
    const desktopButton = document.getElementById("submit_idea_desktop");
    const mobileButton = document.getElementById("submit_idea_mobile");
    
    if (desktopButton) desktopButton.addEventListener("click", () => {
        const title = document.getElementById("title_desktop").value.trim();
        if (title) {
            createNewIdea(title, false);
        }
    });
    if (mobileButton) mobileButton.addEventListener("click", () => {
        const title = document.getElementById("title_mobile").value.trim();
        if (title) {
            createNewIdea(title, true);
        }
    });
    
    // Add sort and search event listeners
    const sortDateButtons = document.querySelectorAll('.sort_by_date');
    const sortRankButtons = document.querySelectorAll('.sort_by_rank');
    const searchInputs = document.querySelectorAll('.search_input');

    // Add click handlers to all date sort buttons
    sortDateButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentSortField === 'createdAt') {
                currentSortDirection = currentSortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSortField = 'createdAt';
                currentSortDirection = 'desc';
            }
            updateSortIcons(sortDateButtons);
            loadIdeas();
        });
    });

    // Add click handlers to all rank sort buttons
    sortRankButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentSortField === 'views') {
                currentSortDirection = currentSortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSortField = 'views';
                currentSortDirection = 'desc';
            }
            updateSortIcons(sortRankButtons);
            loadIdeas();
        });
    });

    // Add input handler to all search inputs
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            currentPage = 1; // Reset to first page on search
            loadIdeas();
        });
    });

    // Add pagination event listeners
    const prevPageButton = document.getElementById('prev_page');
    const nextPageButton = document.getElementById('next_page');

    if (prevPageButton) {
        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadIdeas();
            }
        });
    }

    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => {
            currentPage++;
            loadIdeas();
        });
    }
    
    // Gestion des onglets
    const tabLinks = document.querySelectorAll(".tab_link");
    const tabContents = document.querySelectorAll(".tab_content");

    tabLinks.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabLinks.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((c) => c.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    // Gestion des modals
    const modal = document.getElementById("doc_modal");
    const closeModalButton = document.getElementById("close_doc_modal");
    const docIframe = document.getElementById("doc_iframe");

    window.openDocModal = async function(id, docLink) {
        if (!docLink) {
            alert('Document is still being processed. Please try again in a few moments.');
            return;
        }
        
        const docIframe = document.getElementById("doc_iframe");
        const modal = document.getElementById("doc_modal");
        
        docIframe.src = docLink;
        modal.style.display = "block";
        document.body.classList.add("no-scroll");

        const ideaRef = db.collection("documents").doc(id);
        await ideaRef.update({
            views: firebase.firestore.FieldValue.increment(1)
        });
    };

    closeModalButton.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "none";
        docIframe.src = "";
        document.body.classList.remove("no-scroll");
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            docIframe.src = "";
            document.body.classList.remove("no-scroll");
        }
    });
});

function updateSortIcons(buttons) {
    buttons.forEach(button => {
        const icon = button.querySelector('.sort_icon');
        if (icon) {
            icon.textContent = currentSortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward';
        }
    });
}

async function loadIdeas() {
    console.log("Loading ideas...");

    let ideaListElement = document.querySelector(".idea_list_item");
    let ideasCountElement = document.getElementById("ideas_count");
    let currentPageElement = document.getElementById("current_page");
    let prevPageButton = document.getElementById('prev_page');
    let nextPageButton = document.getElementById('next_page');

    if (!ideaListElement || !ideasCountElement) {
        console.error("Elements not found in DOM.");
        return;
    }

    ideaListElement.innerHTML = "<li>Loading ideas...</li>";
    ideasCountElement.innerText = "Loading ideas...";

    try {
        const querySnapshot = await db.collection("documents").get();
        let ideas = [];
        
        // Convert to array and filter by search term
        querySnapshot.forEach((doc) => {
            const idea = doc.data();
            if (currentSearchTerm === '' || 
                idea.title.toLowerCase().includes(currentSearchTerm)) {
                ideas.push({ id: doc.id, ...idea });
            }
        });

        // Sort the ideas
        ideas.sort((a, b) => {
            let comparison = 0;
            if (currentSortField === 'createdAt') {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                comparison = dateA - dateB;
            } else if (currentSortField === 'views') {
                comparison = (a.views || 0) - (b.views || 0);
            }
            return currentSortDirection === 'desc' ? -comparison : comparison;
        });

        // Calculate pagination
        const totalPages = Math.ceil(ideas.length / itemsPerPage);
        
        // Ensure current page is valid
        if (currentPage > totalPages) {
            currentPage = totalPages || 1;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedIdeas = ideas.slice(startIndex, endIndex);

        // Update pagination controls
        if (currentPageElement) {
            currentPageElement.textContent = currentPage;
        }
        if (prevPageButton) {
            prevPageButton.disabled = currentPage === 1;
        }
        if (nextPageButton) {
            nextPageButton.disabled = currentPage >= totalPages;
        }

        // Update the count
        ideasCountElement.innerText = `Total Ideas: ${ideas.length}`;

        // Clear the list
        ideaListElement.innerHTML = "";

        if (paginatedIdeas.length === 0) {
            ideaListElement.innerHTML = "<li>No ideas found.</li>";
            return;
        }

        // Add the ideas to the list
        paginatedIdeas.forEach((idea) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <a href="#" class="idea_container" onclick="openDocModal('${idea.id}', '${idea.googleDocWebViewUrl || ''}')">
                    <div class="idea_date" id="idea_date">${idea.createdAt 
                        ? new Date(idea.createdAt.seconds * 1000)
                            .toLocaleDateString("fr-FR", { year: "2-digit", month: "2-digit", day: "2-digit" })
                            .replace(/\//g, "-") 
                        : "Unknown"
                    }</div>
                    <div class="responsive_info">
                        <div class="idea_date" id="responsive_idea_date">${idea.createdAt 
                            ? new Date(idea.createdAt.seconds * 1000)
                                .toLocaleDateString("fr-FR", { year: "2-digit", month: "2-digit", day: "2-digit" })
                                .replace(/\//g, "-") 
                            : "Unknown"
                        }</div>
                        <div class="idea_views" id="responsive_idea_views"><span class="material-icons">ads_click</span>  ${idea.views || 0}</div>
                    </div>
                    <div class="idea_name">${idea.title}</div>
                    <div class="idea_views" id="idea_views"><span class="material-icons">ads_click</span>  ${idea.views || 0}</div>
                </a>
            `;
            ideaListElement.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading ideas:", error);
        ideasCountElement.innerText = "Error loading ideas";
        ideaListElement.innerHTML = "<li>Error loading ideas.</li>";
    }
}
