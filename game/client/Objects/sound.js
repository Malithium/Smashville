// Sound object to manage sound files

function Sound(song) {
    // Init
    this.music = game.add.audio(song);
    this.currSong = song;
    this.nextSong = false;

    this.musicUpdate = function() {
        if(!this.music.loop && !this.music.isPlaying) {
            this.musicStop();
            nextSong(this.nextSong);
        }
    };

    this.queueSong = function(song) {
        this.nextSong = song;
        this.music.loop = false;
        this.music.fadeOut(3000);
    };

    this.musicPlay = function() {
        this.music.play();
    };

    this.musicLoop = function() {
        this.music.play();
        this.music.loopFull();
    };

    this.musicStop = function() {
        this.music.stop();
    };

    this.setVolume = function(vol) {
        this.vol = vol;
        this.music.volume = vol;
    };
}

function nextSong(song) {
    music = new Sound(song);
    music.setVolume(0.2); // Reduce sound to background level
    music.musicLoop();
}