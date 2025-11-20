import { GameMode, ItemLockMode, Player, system, world } from "@minecraft/server";
import { mapList } from "./commands/selectMap";
import { largeMap } from "./maps/LargeMap";
import { MapBase } from "./maps/MapBase";
import { mediumMap } from "./maps/MediumMap";
import { smallMap } from "./maps/SmallMap";
import InventoryUtils from "./utils/InventoryUtils";
import { PlayerScreenUtils } from "./utils/PlayerScreenUtils";
import PlayerUtils from "./utils/PlayerUtils";
import { Vec3 } from "./utils/vec3";

class Game {
    private runId: number = null;
    private isInGame = false;

    get usingMap(): MapBase {
        const mapId = world.getDynamicProperty<string>("selectedMapId");
        switch (mapId) {
            case mapList[0]:
                return largeMap;

            case mapList[1]:
                return mediumMap;

            case mapList[2]:
                return smallMap;

            default:
                return mediumMap;
        }
    }

    start() {
        if (this.isInGame) return;

        const map = this.usingMap;
        const players = world.getAllPlayers();
        for (const player of players) {
            InventoryUtils.clearAll(player);
            this.giveInitialItems(player);

            player.addTag("living");
            PlayerUtils.setCurrentHp(player, 6);
            player.setGameMode(GameMode.Adventure);
            player.teleport(map.getRandomPos());
            PlayerScreenUtils.setSubtitle(player, "Start");

            system.runTimeout(() => {
                player.playSound("random.anvil_land");
            }, 1);
        }

        this.isInGame = true;
        this.runId = system.runInterval(this.update.bind(this));
    }

    update() {
        const livingPlayers = world.getPlayers({ tags: ["living"], gameMode: GameMode.Adventure });
        if (livingPlayers.length > 1) return;

        this.end();
    }

    end() {
        if (!this.isInGame) return;

        const winner = world.getPlayers({ tags: ["living"], gameMode: GameMode.Adventure })[0];
        if (winner) PlayerScreenUtils.setTitleForAll(`${winner.nameTag} Wins！`);
        else PlayerScreenUtils.setTitleForAll("draw");

        const players = world.getAllPlayers();
        for (const player of players) {
            InventoryUtils.clearAll(player);
            player.setGameMode(GameMode.Adventure);
            player.removeTag("living");
            PlayerUtils.setCurrentHp(player, 6);
            player.teleport(new Vec3(-65, -35, -74));
            system.runTimeout(() => {
                player.playSound("mob.wither.death");
            }, 1);
        }

        this.isInGame = false;
        system.clearRun(this.runId);
    }

    giveInitialItems(player: Player) {
        InventoryUtils.addItem(player, "minecraft:spyglass", 1, ItemLockMode.inventory);
        InventoryUtils.addItem(player, "minecraft:fishing_rod", 1, ItemLockMode.inventory);
        InventoryUtils.addItem(player, "minecraft:feather", 3, ItemLockMode.inventory);
    }
}

export const game = new Game();
