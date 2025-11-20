import { system } from "@minecraft/server";
import { game } from "../Game";
import { commands } from "../lib/commands";

commands.register(
    { name: "gaagaa:start", description: "ゲームを開始します。", parameters: {} },
    () => {
        system.run(() => {
            game.start();
        });
    }
);
