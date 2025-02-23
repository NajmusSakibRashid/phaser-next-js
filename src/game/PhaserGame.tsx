import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const game = useRef<Phaser.Game | null>(null!);

        const resizer = () => {
            if (game.current) {
                let { innerWidth, innerHeight } = window;
                let { width, height } = game.current.scale;
                if (innerWidth < 640) {
                    const k = 1.5;
                    game.current.scale.resize(innerHeight * k, height);
                    setYScale(innerWidth / height);
                    setXScale(1 / k);
                } else {
                    game.current.scale.resize(innerWidth, height);
                    setXScale(1);
                    setYScale(innerHeight / height);
                }
            }
        };

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");
                resizer();
                window.addEventListener("resize", resizer);
                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref]);

        useEffect(() => {
            EventBus.on(
                "current-scene-ready",
                (scene_instance: Phaser.Scene) => {
                    if (
                        currentActiveScene &&
                        typeof currentActiveScene === "function"
                    ) {
                        currentActiveScene(scene_instance);
                    }

                    if (typeof ref === "function") {
                        ref({ game: game.current, scene: scene_instance });
                    } else if (ref) {
                        ref.current = {
                            game: game.current,
                            scene: scene_instance,
                        };
                    }
                }
            );
            return () => {
                EventBus.removeListener("current-scene-ready");
            };
        }, [currentActiveScene, ref]);

        const [xScale, setXScale] = useState(1);
        const [yScale, setYScale] = useState(1);

        return (
            <div
                id="game-container"
                className="rotate-90 sm:rotate-0"
                style={{
                    transform: `scale(${xScale}, ${yScale})`,
                    transformOrigin: "center",
                }}
            ></div>
        );
    }
);

