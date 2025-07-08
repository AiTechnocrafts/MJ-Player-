// === ELEMENTS ===
const audioPlayer = document.getElementById('audio-player');
const songImage = document.getElementById('song-image');
const songTitle = document.getElementById('song-title');
const downloadLink = document.getElementById('download-link');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const ytUrlInput = document.getElementById('youtube-url');
const addYtBtn = document.getElementById('add-yt-btn');
const playlistList = document.getElementById('playlist-list');

// === PLAYLIST & STATE ===
const myPlaylist = [
    // === YAHAN BADLAAV KIYA GAYA HAI ===
    { type: 'mp3', title: ' Atif_Aslam_Hit_Songs', src: 'https://drive.proton.me/urls/ZVYSKPN0YC#rGbY6TLcsup3', image: './mjlogo.png', download: 'https://linksense.in/YtR8H' },
    { type: 'mp3', title: 'Hits of KK', src: 'https://drive.proton.me/urls/HHCW3FH7A8#ABKBjBr8b8pR', image: './mjlogo.png', download: 'https://linksense.in/Hits_of_KK' },
    { type: 'mp3', title: 'Baarish Vibes With Arijit', src: 'https://drive.proton.me/urls/R3NQ6SK5V0#olUo9ho4Qdn6', image: './mjlogo.png', download: 'https://linksense.in/Arijit_Singh_Barish_ke_gane' },
];
let currentPlaylist = [...myPlaylist];
let currentSongIndex = 0;
let ytPlayer;
let isPlaying = false;
let isYTPlayerReady = false;

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', initPlayer);

function initPlayer() {
    loadSong(currentSongIndex);
    updatePlaylistUI();
    setupEventListeners();
}

function setupEventListeners() {
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    addYtBtn.addEventListener('click', addYouTubeSong);
    playlistList.addEventListener('click', handlePlaylistClick);
    audioPlayer.addEventListener('play', () => setIsPlaying(true));
    audioPlayer.addEventListener('pause', () => setIsPlaying(false));
    audioPlayer.addEventListener('ended', playNextSong);
}

// === YOUTUBE API CALLBACKS ===
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }
    });
}

function onPlayerReady(event) {
    isYTPlayerReady = true;
    ytUrlInput.disabled = false;
    addYtBtn.disabled = false;
    ytUrlInput.placeholder = 'YouTube link yahan daalein';
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        const videoData = ytPlayer.getVideoData();
        currentPlaylist[currentSongIndex].title = videoData.title;
        songTitle.textContent = videoData.title;
        updatePlaylistUI();
        setIsPlaying(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
        setIsPlaying(false);
    } else if (event.data === YT.PlayerState.ENDED) {
        playNextSong();
    }
}

// === PLAYLIST UI FUNCTION ===
function updatePlaylistUI() {
    playlistList.innerHTML = '';
    currentPlaylist.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.dataset.index = index;
        if (index === currentSongIndex) {
            li.classList.add('active');
        }
        playlistList.appendChild(li);
    });
}

// === CORE PLAYER LOGIC ===
function loadSong(index) {
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    setIsPlaying(false);
    songTitle.textContent = song.title;
    // Yahan badlav kiya gaya hai taaki youtube video ke liye thumbnail dikhe
    songImage.src = song.type === 'mp3' ? song.image : `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
    updatePlaylistUI();

    if (song.type === 'mp3') {
        audioPlayer.src = song.src;
        downloadLink.classList.remove('disabled');
        downloadLink.href = song.download;
    } else {
        downloadLink.classList.add('disabled');
        downloadLink.href = '#';
        if (isYTPlayerReady) {
            ytPlayer.cueVideoById(song.id);
        }
    }
}

function togglePlayPause() {
    if (isPlaying) pauseSong();
    else playSong();
}

function playSong() {
    const song = currentPlaylist[currentSongIndex];
    if (song.type === 'mp3') {
        audioPlayer.play();
    } else if (song.type === 'youtube' && isYTPlayerReady) {
        ytPlayer.playVideo();
    }
}

function pauseSong() {
    const song = currentPlaylist[currentSongIndex];
    if (song.type === 'mp3') {
        audioPlayer.pause();
    } else if (song.type === 'youtube' && isYTPlayerReady) {
        ytPlayer.pauseVideo();
    }
}

function setIsPlaying(state) {
    isPlaying = state;
    playPauseBtn.innerHTML = state ? '❚❚' : '▶';
    songImage.classList.toggle('rotate', state);
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    loadSong(currentSongIndex);
    playSong();
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadSong(currentSongIndex);
    playSong();
}

function addYouTubeSong() {
    const url = ytUrlInput.value;
    const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    
    if (videoId && videoId[1]) {
        const newSong = {
            type: 'youtube',
            id: videoId[1],
            title: 'YouTube Gaana (Loading...)',
        };
        currentPlaylist.push(newSong);
        ytUrlInput.value = '';
        updatePlaylistUI();
        if (!isPlaying) {
            loadSong(currentPlaylist.length - 1);
            playSong();
        }
    } else {
        alert('Yeh ek valid YouTube link nahi hai.');
    }
}

function handlePlaylistClick(e) {
    if (e.target && e.target.nodeName === 'LI') {
        const index = parseInt(e.target.dataset.index, 10);
        loadSong(index);
        playSong();
    }
                     }
