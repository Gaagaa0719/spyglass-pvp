import {
    EntityDamageCause,
    GameMode,
    ItemStopUseAfterEvent,
    Player,
    world
} from "@minecraft/server";
import PlayerUtils from "../utils/PlayerUtils";
import { Vec3 } from "../utils/vec3";
import { ItemBase } from "./ItemBase";

class Spyglass extends ItemBase {
    readonly itemId = "minecraft:spyglass";
    readonly attackMaxRange = 200;
    static instance = new this();

    private constructor() {
        super();
    }

    onStopUse(ev: ItemStopUseAfterEvent): void {
        const player = ev.source;
        const dimension = player.dimension;

        this.applyDamage(player);
        this.spawnTrajectoryParticles(player);
        dimension.playSound("cauldron.explode", player.location);
    }

    applyDamage(player: Player) {
        const viewDir = player.getViewDirection();
        const entityHits = player.getEntitiesFromViewDirection({
            maxDistance: this.attackMaxRange,
            ignoreBlockCollision: false
        });

        for (const entityHit of entityHits) {
            const hitPlayer = entityHit.entity;
            if (!PlayerUtils.isPlayer(hitPlayer)) return;
            const currentHp = PlayerUtils.getCurrentHp(hitPlayer);

            if (currentHp > 2) hitPlayer.applyDamage(2, { cause: EntityDamageCause.selfDestruct });
            else {
                hitPlayer.setGameMode(GameMode.Spectator);
                hitPlayer.removeTag("living");
            }

            hitPlayer.applyImpulse(Vec3.multiply(viewDir, 2));

            const distance =
                Math.floor(Vec3.distance(player.location, hitPlayer.location) * 10) / 10;
            world.sendMessage(`${player.nameTag} -> ${hitPlayer.nameTag} (${distance}m)`);
        }
        if (entityHits.length > 0) player.playSound("note.bell");
    }

    spawnTrajectoryParticles(player: Player) {
        const dimension = player.dimension;
        const attackRange = this.getAttackRange(player);
        const initialLoc = Vec3.add(player.getHeadLocation(), player.getViewDirection());
        for (let i = 0; i < attackRange; i++) {
            const currentLoc = Vec3.add(initialLoc, Vec3.multiply(player.getViewDirection(), i));

            const isValid = dimension.isChunkLoaded(currentLoc);
            if (!isValid) break;

            dimension.spawnParticle("minecraft:endrod", currentLoc);
        }
    }

    getAttackRange(player: Player): number {
        const result = player.getBlockFromViewDirection({ maxDistance: this.attackMaxRange });

        return result
            ? Math.floor(Vec3.distance(result.block.location, player.location))
            : this.attackMaxRange;
    }
}
