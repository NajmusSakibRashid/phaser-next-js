import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        const gridSize = 16;
        const cols = Math.ceil(this.scale.width / gridSize);
        const rows = Math.ceil(this.scale.height / gridSize);
        console.log("cols", cols);
        console.log("rows", rows);

        const background = this.add
            .image(0, 0, "background")
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setAlpha(0.2);

        const arm = this.add
            .image(512 - 8, 384 - 16, "arm")
            .setDisplaySize(150, 150)
            .setOrigin(0.2, 0.5)
            .setFlipX(true)
            .setAngle(-20);

        const body = this.add.image(512, 384, "body").setDisplaySize(75, 75);

        const bucket = this.add
            .image(512 - 8, 384 - 16, "bucket")
            .setDisplaySize(32, 32)
            .setOrigin(-2, -1)
            .setAngle(-20);

        const group = this.add.group([arm, body, bucket]);

        group.setX(160);

        this.input.keyboard?.on("keydown-UP", () => {
            if (arm.angle > -30 - 20) {
                arm.angle -= 30;
                bucket.angle -= 30;
            }
        });

        this.input.keyboard?.on("keydown-DOWN", () => {
            if (arm.angle < 0 - 20) {
                arm.angle += 30;
                bucket.angle += 30;
            }
        });

        this.input.keyboard?.on("keydown-RIGHT", () => {
            if (
                group
                    .getChildren()
                    .some(
                        (child) =>
                            (child as Phaser.GameObjects.Image).x +
                                (child as Phaser.GameObjects.Image)
                                    .displayWidth +
                                80 <
                            this.scale.width
                    )
            ) {
                group.incX(16);
            }
        });

        this.input.keyboard?.on("keydown-LEFT", () => {
            if (
                group
                    .getChildren()
                    .some(
                        (child) =>
                            (child as Phaser.GameObjects.Image).x > 0 + 40
                    )
            ) {
                group.incX(-16);
            }
        });

        // this.background.setAlpha(0.5);

        // this.gameText = this.add
        //     .text(512, 384, "Let's make a buldozer game.", {
        //         fontFamily: "Arial Black",
        //         fontSize: 38,
        //         color: "#ffffff",
        //         stroke: "#000000",
        //         strokeThickness: 8,
        //         align: "center",
        //     })
        //     .setOrigin(0.5)
        //     .setDepth(100);

        // for (let i = 0; i < cols; i++) {
        //     for (let j = 0; j < rows; j++) {
        //         this.add
        //             .rectangle(i * gridSize, j * gridSize, gridSize, gridSize)
        //             .setOrigin(0)
        //             .setStrokeStyle(1, 0xffffff, 1) // Set border color to white
        //             .setFillStyle(0xffffff, 0); // Set fill color to transparent
        //     }
        // }

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

