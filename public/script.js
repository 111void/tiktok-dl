const form = document.getElementById('form');
const urlInput = document.getElementById('url');
const submitBtn = document.getElementById('submit');
const content = document.getElementById('content');

// Constants
const INSTRUCTIONS_HTML = `
    <ol>
        <li>Copy link of some tiktok video</li>
        <li>Paste link in text box</li>
        <li>Click the <b>GENERATE</b> button</li>
        <li>Watch and Download the video without watermark</li>
    </ol>
`;

const TIKTOK_PATTERNS = [
    /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com|vt\.tiktok\.com)/,
    /tiktok\.com\/@[\w\.-]+\/video\/\d+/,
    /tiktok\.com\/t\/[\w\d]+/,
    /vm\.tiktok\.com\/[\w\d]+/,
    /vt\.tiktok\.com\/[\w\d]+/,
    /m\.tiktok\.com\/v\/\d+/,
    /tiktok\.com\/.*\/video\/\d+/
];

// Utility functions
const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const isValidTikTokUrl = (url) => {
    return TIKTOK_PATTERNS.some(pattern => pattern.test(url));
};

const showInstructions = () => {
    content.innerHTML = INSTRUCTIONS_HTML;
};

const showLoading = () => {
    content.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Processing your TikTok video...</p>
        </div>
    `;
};

const showError = (message) => {
    content.innerHTML = `
        <div class="messageError">
            <i class='bx bx-error-circle'></i>
            <p>${message}</p>
        </div>
        ${INSTRUCTIONS_HTML}
    `;
};

const createDownloadButton = (url, filename, icon, text) => {
    return `<a href="${url}" class="btn" download="${filename}" target="_blank" rel="noopener">
        <i class='bx ${icon}'></i>${text}
    </a>`;
};

const buildVideoResult = (data) => {
    const videoInfo = `
        <div class="video-info">
            <h3>${data.title}</h3>
            ${data.author ? `<p><strong>Author:</strong> @${data.author}</p>` : ''}
            ${data.duration ? `<p><strong>Duration:</strong> ${data.duration}s</p>` : ''}
            ${data.likes ? `<p><strong>Likes:</strong> ${formatNumber(data.likes)}</p>` : ''}
        </div>
    `;

    const videoPlayer = `
        <video controls crossorigin="anonymous" preload="metadata">
            <source src="${data.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;

    const downloadButtons = [
        createDownloadButton(data.videoUrl, "tiktok-video-hd.mp4", "bx-download", "HD Video")
    ];

    if (data.videoUrlSD && data.videoUrlSD !== data.videoUrl) {
        downloadButtons.push(
            createDownloadButton(data.videoUrlSD, "tiktok-video.mp4", "bx-download", "SD Video")
        );
    }

    if (data.audioUrl) {
        downloadButtons.push(
            createDownloadButton(data.audioUrl, "tiktok-audio.mp3", "bx-music", " Download Audio")
        );
    }

    const downloadSection = `
        <div class="download-section">
            <div class="download-options">
                ${downloadButtons.join('')}
            </div>
            <p style="font-size: 12px; color: var(--color-text); margin-top: 1rem;">
                <i class='bx bx-info-circle'></i> Right-click and "Save as" if direct download doesn't work
            </p>
        </div>
    `;

    return videoInfo + videoPlayer + downloadSection;
};

// Main download function
const downloadTikTokVideo = async (url) => {
    try {
        showLoading();
        submitBtn.disabled = true;

        console.log('Processing URL:', url);

        const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.success && result.data) {
            content.innerHTML = buildVideoResult(result.data);
        } else {
            showError(result.message || 'Unable to fetch video. Please try again or check if the video is public.');
        }

    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to process video: ${error.message}. Please try again or check your internet connection.`);
    } finally {
        submitBtn.disabled = false;
    }
};

// Event listeners
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a TikTok URL');
        return;
    }

    if (!isValidTikTokUrl(url)) {
        showError('Please enter a valid TikTok URL (e.g., https://vm.tiktok.com/xxx or https://tiktok.com/@user/video/xxx)');
        return;
    }

    await downloadTikTokVideo(url);
});

urlInput.addEventListener('focus', () => {
    if (content.querySelector('.messageError')) {
        showInstructions();
    }
});

urlInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        const pastedUrl = e.target.value.trim();
        if (pastedUrl && isValidTikTokUrl(pastedUrl)) {
            setTimeout(() => form.dispatchEvent(new Event('submit')), 500);
        }
    }, 100);
});