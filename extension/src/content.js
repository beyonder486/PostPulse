// content.js - Complete Implementation

let lastScrapedMetrics = [];
let scrapingActive = true;
let observer;
let sentPostUrls = new Set();

// Load sent posts from chrome.storage.local
function loadSentPostUrls() {
  return new Promise(resolve => {
    chrome.storage.local.get(['sentPostUrls'], ({ sentPostUrls: stored }) => {
      sentPostUrls = new Set(stored || []);
      resolve();
    });
  });
}

// Save sent posts to chrome.storage.local
function saveSentPostUrls() {
  chrome.storage.local.set({ sentPostUrls: Array.from(sentPostUrls) });
}

async function extractPostMetrics() {
  if (!scrapingActive) return;
  await loadSentPostUrls();

  // Get the LinkedIn account name from chrome.storage.local
  const { linkedinAccountName } = await new Promise(resolve => {
    chrome.storage.local.get(['linkedinAccountName'], resolve);
  });

  try {
    const posts = [...document.querySelectorAll('div.feed-shared-update-v2')].flatMap((post) => {
      // Get the post author's name
      const authorName = post.querySelector('.feed-shared-actor__name, .update-components-actor__name')?.textContent?.trim();

      // Only scrape if author matches the stored LinkedIn account name
      if (!linkedinAccountName || authorName !== linkedinAccountName) return [];

      // Only use posts with their own data-urn
      let urn = post.getAttribute('data-urn');
      let activityId = urn ? urn.split(':').pop() : null;

      // Fallback: Try to find a link with activity-<id>
      if (!activityId) {
        const link = post.querySelector('a[href*="activity-"]');
        if (link) {
          const match = link.href.match(/activity-(\d+)/);
          if (match) activityId = match[1];
        }
      }
      if (!activityId) return [];

      const postUrl = `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}/`;

      let posted_at = extractTimestampFromId(activityId);
      if (!posted_at) {
        const relativeTime = extractRelativeTime(post);
        posted_at = parseRelativeTime(relativeTime);
      }

      // Debug log
      console.log('ActivityID:', activityId, 'PostURL:', postUrl, 'Date:', posted_at);

      return [{
        post_url: postUrl,
        content: (post.innerText || "").substring(0, 500),
        likes: parseMetric(post.querySelector('.social-details-social-counts__reactions-count')?.textContent),
        comments: parseMetric(post.querySelector('[aria-label*="comment"]')?.textContent),
        views: parseMetric(post.querySelector('[aria-label*="views"]')?.textContent),
        posted_at: posted_at || new Date().toISOString()
      }];
    });

    // Only send posts that haven't been sent before (persisted)
    const newPosts = posts.filter(p => p.post_url && !sentPostUrls.has(p.post_url));
    newPosts.forEach(p => sentPostUrls.add(p.post_url));
    saveSentPostUrls();

    lastScrapedMetrics = posts.filter(p => p.post_url);

    if (newPosts.length > 0) {
      chrome.runtime.sendMessage({
        type: "POST_METRICS",
        data: newPosts
      });
    }

  } catch (err) {
    console.error("Scraping error:", err);
  }
}

function extractTimestampFromId(activityId) {
  if (!activityId || !/^\d+$/.test(activityId)) return null;
  try {
    const binaryStr = BigInt(activityId).toString(2)
    const timestampBits = binaryStr.substring(0, 41); // First 41 bits = epoch ms
    const timestampMs = parseInt(timestampBits, 2);
    const date = new Date(timestampMs);
    const thisYear = new Date().getFullYear();
    if (isNaN(date.getTime()) || date.getFullYear() < 2010 || date.getFullYear() > thisYear + 1) {
      return null;
    }
    return date.toISOString();
  } catch {
    return null;
  }
}

function extractRelativeTime(postElement) {
  const timeElement = postElement.querySelector('time[datetime]');
  if (timeElement) {
    return timeElement.textContent.trim().split('•')[0].trim();
  }
  const textElements = [
    ...postElement.querySelectorAll('.feed-shared-actor__sub-description span, .update-components-actor__sub-description span')
  ];
  for (const el of textElements) {
    const text = el.textContent.trim().split('•')[0].trim();
    if (/^\d+(s|m|h|d|w|mo|y)/.test(text)) {
      return text;
    }
  }
  return null;
}

function parseRelativeTime(relativeStr) {
  if (!relativeStr) return null;
  const units = {
    's': 1000,
    'm': 60000,
    'h': 3600000,
    'd': 86400000,
    'w': 604800000,
    'mo': 2592000000,
    'y': 31536000000
  };
  const match = relativeStr.match(/^(\d+)(s|m|h|d|w|mo|y)/);
  if (!match) return null;
  const [, value, unit] = match;
  return new Date(Date.now() - (parseInt(value) * (units[unit] || 0))).toISOString();
}

function parseMetric(text) {
  if (!text) return 0;
  text = text.toLowerCase().replace(/,/g, '').trim();
  if (text.endsWith('k')) return Math.round(parseFloat(text) * 1000);
  if (text.endsWith('m')) return Math.round(parseFloat(text) * 1000000);
  return parseInt(text.replace(/\D/g, ''), 10) || 0;
}

// ===== EXECUTION ===== //

// Run on initial load
setTimeout(extractPostMetrics, 3000);

// Watch for new posts in LinkedIn's SPA (debounced)
let scrapeTimeout;
observer = new MutationObserver(() => {
  clearTimeout(scrapeTimeout);
  scrapeTimeout = setTimeout(() => {
    if (scrapingActive && document.querySelector('.feed-shared-update-v2')) {
      extractPostMetrics();
    }
  }, 1000);
});
observer.observe(document.body, { childList: true, subtree: true });

// Listen for popup requests
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getMetrics') {
    sendResponse(lastScrapedMetrics);
    scrapingActive = false;
    if (observer) observer.disconnect();
  }
});