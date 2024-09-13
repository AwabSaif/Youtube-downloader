document.getElementById('downloadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const playlistUrl = document.getElementById('playlistUrl').value;
    const statusMessage = document.getElementById('statusMessage');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');

    statusMessage.textContent = 'Starting download...';
    progress.style.width = '0';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playlistUrl })
        });

        const data = await response.json();

        if (data.status === 'success') {
            statusMessage.textContent = data.message;
            progress.style.width = '100%';
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        statusMessage.textContent = 'Error: ' + error.message;
    }
});
