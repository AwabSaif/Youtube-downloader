const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle POST request for downloading playlist
app.use(express.json());

app.post('/download', async (req, res) => {
    const { playlistUrl } = req.body;

    try {
        const playlistInfo = await ytdl.getPlaylist(playlistUrl);
        const playlistName = playlistInfo.title;

        // Create directory for the playlist
        const playlistDir = path.join(__dirname, 'downloads', playlistName);
        await fs.ensureDir(playlistDir);

        // Download each video in the playlist
        for (const video of playlistInfo.videos) {
            const videoTitle = video.title;
            const videoUrl = video.url;
            const outputPath = path.join(playlistDir, `${videoTitle}.mp4`);

            console.log(`Downloading ${videoTitle}...`);
            await downloadVideo(videoUrl, outputPath);
        }

        res.json({ status: 'success', message: 'All videos downloaded successfully!' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'An error occurred: ' + error.message });
    }
});

// Helper function to download video
async function downloadVideo(url, outputPath) {
    return new Promise((resolve, reject) => {
        ytdl(url, { quality: 'highestvideo' })
            .pipe(fs.createWriteStream(outputPath))
            .on('finish', resolve)
            .on('error', reject);
    });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
