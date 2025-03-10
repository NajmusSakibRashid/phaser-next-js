import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(this.scale.width/2, this.scale.height/2, "background");

        const background = this.add
            .image(0, 0, "background-original")
            .setOrigin(0);

        //  A simple progress bar. This is the outline of the bar.
        this.add
            .rectangle(this.scale.width / 2, this.scale.height / 2, 468, 32)
            .setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(
            this.scale.width / 2 - 230,
            this.scale.height / 2,
            4,
            28,
            0xffffff
        );

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        // this.load.setPath("assets");

        this.load.image("body", "imported/excavator-body.png");
        this.load.image("arm", "imported/excavator-arm.png");
        this.load.image("bucket", "imported/excavator-bucket.png");
        this.load.image("building", "imported/building.png");
        this.load.image("logo", "imported/logo.png");
        // this.load.image(
        //     "background_building",
        //     "imported/background_building.png"
        // );
        this.load.image("road", "imported/road.png");
        this.load.spritesheet(
            "explosion",
            "imported/explosion-sprite-resized.png",
            {
                frameWidth: 108,
                frameHeight: 108,
            }
        );
        this.load.audio("explosion-sound", "imported/explosion-sound.mp3");
        this.load.audio("despicable-sound", "imported/despicable.mp3");
        this.load.audio("buldozer-sound", "imported/buldozer.mp3");
        this.load.audio("joy-bangla", "imported/joy-bangla.mp3");
        this.load.audio("bongoboltu", "imported/bongoboltu.mp3");
        this.load.audio("kemon-achen", "imported/kemon-achen.mp3");
        this.load.audio("thakbena", "imported/bangladesh-thakbena.mp3");
        this.load.audio("rat-pohale", "imported/rat-pohale.mp3");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("MainMenu");
    }
}

