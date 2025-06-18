// === ELEMENTS ===
const audioPlayer = document.getElementById('audio-player');
const songImage = document.getElementById('song-image');
const songTitle = document.getElementById('song-title');
const downloadLink = document.getElementById('download-link');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const ytUrlInput = document.getElementById('youtube-url');
const ytPlayBtn = document.getElementById('play-yt-btn');

// === PLAYLIST & STATE ===
const myPlaylist = [
    { type: 'mp3', title: 'Pehla Gaana', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', image: './default.jpg', download: '#' },
    { type: 'mp3', title: 'Doosra Gaana', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', image: './default.jpg', download: '#' }
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
    setupEventListeners();
}

function setupEventListeners() {
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    ytPlayBtn.addEventListener('click', addYouTubeSong);
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
    ytPlayBtn.disabled = false;
    ytUrlInput.placeholder = 'YouTube link yahan daalein';
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        const videoData = ytPlayer.getVideoData();
        songTitle.textContent = videoData.title;
        currentPlaylist[currentSongIndex].title = videoData.title;
        setIsPlaying(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
        setIsPlaying(false);
    } else if (event.data === YT.PlayerState.ENDED) {
        playNextSong();
    }
}

// === CORE PLAYER LOGIC ===
function loadSong(index) {
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    setIsPlaying(false);
    songTitle.textContent = song.title;
    songImage.src = song.image;

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
    playPauseBtn.innerHTML = state ? '❚❚' : '▶'; // Pause : Play
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
            image: `https://i.ytimg.com/vi/${videoId[1]}/hqdefault.jpg`
        };
        currentPlaylist.push(newSong);
        ytUrlInput.value = '';
        loadSong(currentPlaylist.length - 1);
        playSong();
    } else {
        alert('Yeh ek valid YouTube link nahi hai.');
    }
}
