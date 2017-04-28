// Sound object to manage sound files

/**
 * Simple sound object. Used to manage sounds and transitioning.
 * @param song
 */
function sound(song) {
    // Init
    this.music = game.add.audio(song);

    this.musicUpdate = function() {
        if(!this.music.loop && !this.music.isPlaying) {
            this.music = game.add.audio(this.nextSong);
            this.musicLoop();
            this.setVolume(this.vol); // Re-apply sound config
        }
    };

    this.queueSong = function(song) {
        this.nextSong = song;
        this.music.loop = false;
        this.music.fadeOut(6000);
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