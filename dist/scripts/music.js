document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if music elements already exist (to prevent duplicates)
    if (document.getElementById('bg-music-audio')) return;

    // 2. Create Audio Element
    const audio = document.createElement('audio');
    audio.id = 'bg-music-audio';
    audio.loop = true;
    audio.src = 'assets/audio/background_music.mp3'; // Default path
    document.body.appendChild(audio);

    // 3. Create Floating Control Button
    const btn = document.createElement('button');
    btn.id = 'music-control-btn';
    btn.className = 'music-btn paused'; // Default state
    btn.innerHTML = '🎵'; // Music Note Icon
    btn.title = 'Play Background Music';
    document.body.appendChild(btn);

    // 4. Load State from LocalStorage
    const isMusicPlaying = localStorage.getItem('dosaHouseMusicPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('dosaHouseMusicTime') || '0');

    // 5. Initialize State
    if (isMusicPlaying) {
        audio.currentTime = savedTime;
        // We attempt to play. Browsers might block autoplay without interaction.
        // We'll catch that error and show the "paused" state.
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                btn.classList.remove('paused');
                btn.classList.add('playing');
                btn.innerHTML = '⏸'; // Pause Icon
            }).catch(error => {
                console.log("Autoplay prevented:", error);
                // Keep UI as paused, user must click to start
                localStorage.setItem('dosaHouseMusicPlaying', 'false');
            });
        }
    }

    // 6. Handle Click Events
    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                btn.classList.remove('paused');
                btn.classList.add('playing');
                btn.innerHTML = '⏸';
                localStorage.setItem('dosaHouseMusicPlaying', 'true');
            }).catch(e => {
                console.error("Playback failed:", e);
                alert("Please ensure 'assets/audio/background_music.mp3' exists!");
            });
        } else {
            audio.pause();
            btn.classList.remove('playing');
            btn.classList.add('paused');
            btn.innerHTML = '🎵';
            localStorage.setItem('dosaHouseMusicPlaying', 'false');
        }
    });

    // 7. Periodic Time Save (for continuity across pages)
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('dosaHouseMusicTime', audio.currentTime);
        }
    }, 1000);

    // 8. Handle Page Unload (Save exact time)
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('dosaHouseMusicTime', audio.currentTime);
    });

    // 9. Error Handling
    audio.addEventListener('error', (e) => {
        console.warn("Music file not found or error loading.");
        btn.style.display = 'none'; // Hide button if no music
    });
});
