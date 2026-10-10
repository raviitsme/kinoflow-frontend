/**
 * Extracts the 11-character YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=LXb3EKWsInQ
 * - https://youtu.be/LXb3EKWsInQ
 * - https://www.youtube.com/embed/LXb3EKWsInQ
 * - LXb3EKWsInQ (raw ID)
 */

export default function extractYouTubeId(url) {
    if(!url) return null;
    const cleanUrl = url.trim();
    const urlRegExp = /^[a-zA-Z0-9_-]{11}/;

    if(urlRegExp.test(cleanUrl)) {
        return cleanUrl;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
}

