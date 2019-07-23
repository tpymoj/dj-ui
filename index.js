var playlistItems = [];
var individualTracks = [];
var playlistCurrentIndex = 0;
var selectedTrackIndex = 0;
var playlistAudio = document.getElementById('playlist-audio');
var individualAudio = document.getElementById('individual-audio');
var playlistIsPlaying = false;
var individualIsPlaying = false;

var playButton = document.getElementById('play');
var fadeInButton = document.getElementById('fade-in');
var fadeOutButton = document.getElementById('fade-out');

function readPlaylistFiles(evt) {
    playlistItems = [];
    playlistCurrentIndex = 0;
    var files = evt.target.files;
    if (files) {
        for (var i = 0, f; f = files[i]; i++) {
            playlistItems.push(f.name);
        }
        var playlistList = document.querySelector("#playlist .list");
        while (playlistList.firstChild) {
            playlistList.removeChild(playlistList.firstChild);
        }
        playlistItems.forEach(function(item, index){
            var listItem = document.createElement("li");
            listItem.innerText = item;
            if (index == 0) {
                listItem.classList.add('selected');    
            }
            playlistList.appendChild(listItem);
        })
        if (playlistItems.length > 0) {
            playlistAudio.src = `music/playlist/${playlistItems[playlistCurrentIndex]}`;
        }
    } else {
        alert("Failed to load files");
    }
}

function readIndividualTracks(evt) {
    individualTracks = [];
    selectedTrackIndex = 0;
    var files = evt.target.files;
    if (files) {
        for (var i = 0, f; f = files[i]; i++) {
            individualTracks.push(f.name);
        }
        var individualList = document.querySelector("#individual .list");
        while (individualList.firstChild) {
            individualList.removeChild(individualList.firstChild);
        }
        individualTracks.forEach(function(track, index){
            var listItem = document.createElement("li");
            if (index == 0) {
                listItem.classList.add('selected');    
            }
            listItem.innerText = track;
            listItem.value = index;
            listItem.addEventListener('click', setCurrentTrack);
            individualList.appendChild(listItem);
        })
        if (individualTracks.length > 0) {
            individualAudio.src = `music/${individualTracks[selectedTrackIndex]}`;
        }
    } else {
        alert("Failed to load files");
    }
}

function setCurrentTrack(){
    individualAudio.src = `music/${this.innerText}`;
    selectedTrackIndex = this.value;
    Array.from(document.querySelector("#individual .list").children).forEach(function(n){
        n.classList.remove('selected');
    })
    individualAudio.load();
    this.classList.add("selected")
    if (individualIsPlaying) {
        individualAudio.play();
    }
}

document.getElementById('playlist-input').addEventListener('change', readPlaylistFiles, false);
document.getElementById('individual-input').addEventListener('change', readIndividualTracks, false);
document.getElementById('repeat').addEventListener('change', evalLoop);
playlistAudio.addEventListener('ended', advancePlaylistIndex);

function evalLoop(){
    
    if (document.getElementById('repeat').checked){
        individualAudio.loop = true;
        console.log('loop')
    } else {
        individualAudio.loop = false;
        console.log('n loop')
    }
}

function advancePlaylistIndex() {
    console.log("advance")
    if (playlistCurrentIndex < playlistItems.length - 1) {
        playlistCurrentIndex++;    
    } else {
        playlistCurrentIndex = 0;
    }
    Array.from(document.querySelector("#playlist .list").children).forEach(function(n, index){
        n.classList.remove("selected");
        if (index == playlistCurrentIndex) {
            n.classList.add("selected");
        }
    })
    playlistAudio.src = `music/playlist/${playlistItems[playlistCurrentIndex]}`;
    playlistAudio.load();
    playlistAudio.play();
}

var playlistPlayButton = document.querySelector("#playlist .btn");
playlistPlayButton.addEventListener('click', playlistButtonClicked);

function playlistButtonClicked(){
    if (playlistIsPlaying) {
        playlistAudio.pause();
        playlistPlayButton.innerText = "播放"

    } else {
        playlistAudio.play();
        playlistPlayButton.innerText = "暫停"
    }
    playlistIsPlaying = !playlistIsPlaying;
}

var individualPlayButton = document.querySelector("#play");
individualPlayButton.addEventListener('click', individualPlayButtonClicked);

function individualPlayButtonClicked(){
    if (individualIsPlaying) {
        individualAudio.pause();
        individualPlayButton.innerText = "播放"
    } else {
        playlistAudio.pause();
        playlistIsPlaying = false;
        playlistPlayButton.innerText = "播放"    
        individualAudio.play();
        individualPlayButton.innerText = "暫停"
    }
    individualIsPlaying = !individualIsPlaying;
}


playlistVolumeControl = document.getElementById('playlist-vol-control');
playlistVolumeControl.addEventListener('change', setPlaylistVolume);
playlistVolumeControl.addEventListener('input', setPlaylistVolume);

function setPlaylistVolume() { 
    console.log("setPlaylistVolume");
    playlistAudio.volume = this.value / 100; 
    // individualAudio.volume = Math.abs(100 - this.value)/100;
    // individualVolumeControl.value = 100 - this.value;
};

individualVolumeControl = document.getElementById('individual-vol-control');
individualVolumeControl.addEventListener('change', setIndividualVolume);
individualVolumeControl.addEventListener('input', setIndividualVolume);

function setIndividualVolume() { 
    individualAudio.volume = this.value / 100; 
    // playlistAudio.volume = Math.abs(100 - this.value)/100; 
    // playlistVolumeControl.value = 100 - this.value;
};