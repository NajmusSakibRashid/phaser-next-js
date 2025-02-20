import build from "next/dist/build";
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

        this.background = this.add.image(0, 0, "background").setOrigin(0);

        const backgroundWidth = this.background.displayWidth;
        this.background.setX(0);

        this.tweens.add({
            targets: this.background,
            x: -backgroundWidth,
            ease: "Linear",
            duration: 30000,
            repeat: -1,
            onRepeat: () => {
                this.background.x = 0;
            },
        });

        const background2 = this.add
            .image(backgroundWidth, 0, "background")
            .setOrigin(0);

        this.tweens.add({
            targets: background2,
            x: 0,
            ease: "Linear",
            duration: 30000,
            repeat: -1,
            onRepeat: () => {
                background2.x = backgroundWidth;
            },
        });

        const road = this.add
            .image(0, this.background.height, "road")
            .setOrigin(0);

        const roadWidth = road.displayWidth;
        road.setX(0);

        this.tweens.add({
            targets: road,
            x: -roadWidth,
            ease: "Linear",
            duration: 5000,
            repeat: -1,
            onRepeat: () => {
                road.x = 0;
            },
        });

        const road2 = this.add
            .image(roadWidth, this.background.height, "road")
            .setOrigin(0);

        this.tweens.add({
            targets: road2,
            x: 0,
            ease: "Linear",
            duration: 5000,
            repeat: -1,
            onRepeat: () => {
                road2.x = roadWidth;
            },
        });

        const arm = this.add
            .image(512 - 8, this.background.height - 16, "arm")
            .setDisplaySize(150, 150)
            .setOrigin(0.2, 0.5)
            .setFlipX(true)
            .setAngle(-20 - 60);

        const body = this.add
            .image(512, this.background.height, "body")
            .setDisplaySize(75, 75);

        const bucket = this.add
            .image(512 - 8, this.background.height - 16, "bucket")
            .setDisplaySize(32, 32)
            .setOrigin(-2, -1)
            .setAngle(-20 - 60);

        const group = this.add.group([arm, body, bucket]);

        group.setDepth(10);

        this.anims.create({
            key: "explosion",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 22,
            repeat: 0,
            hideOnComplete: true,
        });

        const foo = () => {
            setTimeout(() => {
                const arr = [0, 48 - 4, 96];
                const building = this.add
                    .image(this.scale.width, this.background.height, "building")
                    .setDisplaySize(100, 100)
                    .setDepth(5);

                this.tweens.add({
                    targets: building,
                    x: -building.displayWidth,
                    ease: "Linear",
                    duration: 2750,
                    repeat: 0,
                    onUpdate: () => {
                        if (
                            Phaser.Geom.Intersects.RectangleToRectangle(
                                bucket.getBounds(),
                                building.getBounds()
                            )
                        ) {
                            const bucketMask = bucket.createBitmapMask();
                            const buildingMask = building.createBitmapMask();

                            if (
                                Phaser.Geom.Intersects.RectangleToRectangle(
                                    bucket.getBounds(),
                                    building.getBounds()
                                )
                            ) {
                                this.add
                                    .sprite(building.x, building.y, "explosion")
                                    .setDisplaySize(100, 100)
                                    .play("explosion")
                                    .setDepth(15);
                                this.sound
                                    .add("explosion-sound", { volume: 0.1 })
                                    .play();
                                building.destroy();
                                this.tweens.killTweensOf(building);
                                // Handle collision here
                            }

                            bucketMask.destroy();
                            buildingMask.destroy();
                        }
                    },
                    onComplete: () => {
                        building.destroy();
                    },
                });

                foo();
            }, Math.random() * 4000 + 1500);
        };

        foo();

        group.setX(160);

        let spaceKeyPressed = false;

        this.input.keyboard?.on("keydown-SPACE", () => {
            if (!spaceKeyPressed) {
                spaceKeyPressed = true;
                this.tweens.add({
                    targets: [arm, bucket],
                    angle: -20,
                    duration: 250,
                    yoyo: true,
                    ease: "Sine.easeInOut",
                    onComplete: () => {
                        setTimeout(() => {
                            spaceKeyPressed = false;
                        }, 750);
                    },
                });
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
        //     .text(512, this.background.height, "Let's make a buldozer game.", {
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

        //[0,48,96]

        EventBus.emit("current-scene-ready", this);

        console.log(this.background.height + road.height);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

