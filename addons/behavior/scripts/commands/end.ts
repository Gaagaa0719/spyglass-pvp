import { system } from "@minecraft/server";
import { game } from "../Game";
import { commands } from "../lib/commands";

commands.register(
    { name: "gaagaa:end", description: "ゲームを強制終了します。", parameters: {} },
    () => {
        system.run(() => {
            game.end();
        });
    }
);
