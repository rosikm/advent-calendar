// Configuration
const PDF_PATH = 'AdventCalendar2025.pdf';
const TOTAL_WINDOWS = 24;

// Test mode - set to true to unlock all windows
const TEST_MODE = false;

// Page distribution according to requirements
const PAGE_DISTRIBUTION = [
    // Windows 1-7: 3 pages each
    { window: 1, startPage: 1, endPage: 3 },
    { window: 2, startPage: 4, endPage: 6 },
    { window: 3, startPage: 7, endPage: 9 },
    { window: 4, startPage: 10, endPage: 12 },
    { window: 5, startPage: 13, endPage: 15 },
    { window: 6, startPage: 16, endPage: 18 },
    { window: 7, startPage: 19, endPage: 21 },
    // Windows 8-23: 4 pages each
    { window: 8, startPage: 22, endPage: 25 },
    { window: 9, startPage: 26, endPage: 29 },
    { window: 10, startPage: 30, endPage: 33 },
    { window: 11, startPage: 34, endPage: 37 },
    { window: 12, startPage: 38, endPage: 41 },
    { window: 13, startPage: 42, endPage: 45 },
    { window: 14, startPage: 46, endPage: 49 },
    { window: 15, startPage: 50, endPage: 53 },
    { window: 16, startPage: 54, endPage: 57 },
    { window: 17, startPage: 58, endPage: 61 },
    { window: 18, startPage: 62, endPage: 65 },
    { window: 19, startPage: 66, endPage: 69 },
    { window: 20, startPage: 70, endPage: 73 },
    { window: 21, startPage: 74, endPage: 77 },
    { window: 22, startPage: 78, endPage: 81 },
    { window: 23, startPage: 82, endPage: 85 },
    // Window 24: 7 pages
    { window: 24, startPage: 86, endPage: 92 }
];

// Global variables
let pdfDoc = null;
let currentPageNum = 1;
let currentWindow = null;
let openedWindows = new Set();

// Load opened windows from localStorage
function loadOpenedWindows() {
    const saved = localStorage.getItem('openedWindows');
    if (saved) {
        openedWindows = new Set(JSON.parse(saved));
    }
}

// Save opened windows to localStorage
function saveOpenedWindows() {
    localStorage.setItem('openedWindows', JSON.stringify([...openedWindows]));
}

// Check if a window is unlocked based on current date
function isWindowUnlocked(windowNum) {
    // Test mode - unlock all windows
    if (TEST_MODE) {
        return true;
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (November = 10, December = 11)
    const currentDay = now.getDate();
    
    // Check if we're in December
    if (currentMonth === 11) { // December
        return currentDay >= windowNum;
    }
    
    // If we're past December, all windows are unlocked
    if (currentMonth > 11 || currentYear > 2025) {
        return true;
    }
    
    // Before December, all windows are locked
    return false;
}

// Create calendar windows
function createCalendar() {
    const calendar = document.getElementById('calendar');
    
    for (let i = 1; i <= TOTAL_WINDOWS; i++) {
        const window = document.createElement('div');
        window.className = 'window';
        window.dataset.window = i;
        window.textContent = i;
        
        const unlocked = isWindowUnlocked(i);
        
        if (!unlocked) {
            window.classList.add('locked');
        } else if (openedWindows.has(i)) {
            window.classList.add('opened');
        }
        
        window.addEventListener('click', () => handleWindowClick(i, unlocked));
        
        calendar.appendChild(window);
    }
}

// Handle window click
function handleWindowClick(windowNum, unlocked) {
    if (!unlocked) {
        alert(`This window will be available on December ${windowNum}!`);
        return;
    }
    
    const windowData = PAGE_DISTRIBUTION.find(w => w.window === windowNum);
    if (windowData) {
        currentWindow = windowData;
        openPdfViewer(windowData.startPage, windowData.endPage);
        
        // Mark window as opened
        openedWindows.add(windowNum);
        saveOpenedWindows();
        
        // Update window appearance
        const windowElement = document.querySelector(`[data-window="${windowNum}"]`);
        if (windowElement) {
            windowElement.classList.add('opened');
        }
    }
}

// Open PDF viewer modal
function openPdfViewer(startPage, endPage) {
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'block';
    
    currentPageNum = startPage;
    
    if (!pdfDoc) {
        loadPdf();
    } else {
        renderPage(currentPageNum);
    }
}

// Load PDF
async function loadPdf() {
    try {
        const loadingTask = pdfjsLib.getDocument(PDF_PATH);
        pdfDoc = await loadingTask.promise;
        renderPage(currentPageNum);
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please make sure the PDF file is in the same folder as this page.');
    }
}

// Render specific page
async function renderPage(pageNum) {
    if (!pdfDoc || !currentWindow) return;
    
    try {
        const page = await pdfDoc.getPage(pageNum);
        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Update page info
        const pageInfo = document.getElementById('pageInfo');
        const relativePageNum = pageNum - currentWindow.startPage + 1;
        const totalPages = currentWindow.endPage - currentWindow.startPage + 1;
        pageInfo.textContent = `Page ${relativePageNum} of ${totalPages}`;
        
        // Update button states
        document.getElementById('prevPage').disabled = pageNum <= currentWindow.startPage;
        document.getElementById('nextPage').disabled = pageNum >= currentWindow.endPage;
    } catch (error) {
        console.error('Error rendering page:', error);
    }
}

// Navigate to previous page
function previousPage() {
    if (currentPageNum <= currentWindow.startPage) return;
    currentPageNum--;
    renderPage(currentPageNum);
}

// Navigate to next page
function nextPage() {
    if (currentPageNum >= currentWindow.endPage) return;
    currentPageNum++;
    renderPage(currentPageNum);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'none';
    currentWindow = null;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOpenedWindows();
    createCalendar();
    
    // Modal controls
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('prevPage').addEventListener('click', previousPage);
    document.getElementById('nextPage').addEventListener('click', nextPage);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('pdfModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('pdfModal');
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') previousPage();
            if (e.key === 'ArrowRight') nextPage();
            if (e.key === 'Escape') closeModal();
        }
    });
});
