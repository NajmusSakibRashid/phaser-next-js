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

        const roadSpeed = 500; // pixels per second
        const roadDuration = (roadWidth / roadSpeed) * 1000;

        this.tweens.add({
            targets: road,
            x: -roadWidth,
            ease: "Linear",
            duration: roadDuration,
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
            duration: roadDuration,
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

                const buildingSpeed = 500; // pixels per second
                const buildingDuration =
                    ((this.scale.width + building.displayWidth) /
                        buildingSpeed) *
                    1000;

                this.tweens.add({
                    targets: building,
                    x: -building.displayWidth,
                    ease: "Linear",
                    duration: buildingDuration,
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
                                    .add("explosion-sound", { volume: 0.05 })
                                    .play();
                                building.destroy();
                                updatePoints(1);
                                this.tweens.killTweensOf(building);
                                // Handle collision here
                            }

                            bucketMask.destroy();
                            buildingMask.destroy();
                        }
                    },
                    onComplete: () => {
                        if (currentHealth > 0) {
                            currentHealth -= 25;
                            drawHealthBar();
                            this.cameras.main.shake(500, 0.01);
                            this.sound
                                .add("despicable-sound", { volume: 0.25 })
                                .play();
                        } else {
                            this.changeScene();
                        }
                        building.destroy();
                    },
                });
                foo();
            }, Math.random() * 4000 + 1500);
        };

        const random_sounds = [
            "joy-bangla",
            "bongoboltu",
            "kemon-achen",
            "thakbena",
        ];

        const random_sound = () => {
            setTimeout(() => {
                this.sound
                    .add(
                        random_sounds[
                            Math.floor(Math.random() * random_sounds.length)
                        ],
                        { volume: 0.25 }
                    )
                    .play();
                random_sound();
            }, Math.random() * 10000 + 5000);
        };

        const buldozerSound = this.sound.add("buldozer-sound", {
            volume: 0.25,
        });
        buldozerSound.play();
        buldozerSound.on("complete", () => {
            foo();
            random_sound();
        });

        // foo();

        group.setX(160);

        let spaceKeyPressed = false;

        this.input.on("pointerdown", () => {
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

        const instructionText = this.add
            .text(
                this.scale.width - 20,
                20,
                "Press space bar or\n tap on the screen to strike",
                {
                    fontFamily: "Arial",
                    fontSize: "24px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 4,
                    align: "center",
                }
            )
            .setOrigin(1, 0)
            .setDepth(100);

        const healthBar = this.add.graphics();
        const maxHealth = 100;
        let currentHealth = maxHealth;

        const drawHealthBar = () => {
            healthBar.clear();
            healthBar.fillStyle(0xff0000, 1);
            healthBar.fillRect(20, 20, 200 * (currentHealth / maxHealth), 20);
            healthBar.lineStyle(2, 0xffffff, 1);
            healthBar.strokeRect(20, 20, 200, 20);
        };

        drawHealthBar();

        const pointsText = this.add
            .text(20, 50, "Points: 0", {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
            })
            .setDepth(100);

        let points = 0;

        const updatePoints = (value: number) => {
            points += value;
            pointsText.setText(`Points: ${points}`);
        };

        // Example of how to update points
        // updatePoints(10);

        EventBus.emit("current-scene-ready", this);

        console.log(this.background.height + road.height);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

