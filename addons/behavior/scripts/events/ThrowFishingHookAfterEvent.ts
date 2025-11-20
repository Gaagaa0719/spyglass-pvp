import { Entity, EntityComponentTypes, Player, system, world } from "@minecraft/server";
import { EventSignalBase } from "./EventSignalBase";

export interface ThrowFishingHookAfterEvent {
    player: Player;
    fishingHook: Entity;
}

class ThrowFishingHookAfterEventSignal extends EventSignalBase<ThrowFishingHookAfterEvent> {
    private fishingHooks: Entity[] = [];

    constructor() {
        super();

        system.runInterval(() => {
            this.fishingHooks = [];
        });

        world.afterEvents.itemUse.subscribe((ev) => {
            const { source: player, itemStack: item } = ev;

            if (item.typeId !== "minecraft:fishing_rod") return;
            const fishingHook = this.fishingHooks.pop();
            if (!fishingHook) return;

            const projectileComp = fishingHook.getComponent(EntityComponentTypes.Projectile);
            projectileComp.owner = player;

            for (const [callback] of this.callbackMap) {
                callback({ player, fishingHook });
            }
        });

        world.afterEvents.entitySpawn.subscribe((ev) => {
            const entity = ev.entity;
            if (entity.typeId !== "minecraft:fishing_hook") return;
            this.fishingHooks.push(entity);
        });
    }
}

export const ThrowFishingHookEvent = new ThrowFishingHookAfterEventSignal();
