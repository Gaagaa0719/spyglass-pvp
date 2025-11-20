import { Entity, Player, system, world } from "@minecraft/server";
import { EventSignalBase } from "./EventSignalBase";
import { ThrowFishingHookEvent } from "./ThrowFishingHookAfterEvent";

export interface PullUpFishingHookBeforeEvent {
    player: Player;
    fishingHook: Entity;
}

class PullUpFishingHookBeforeEventSignal extends EventSignalBase<PullUpFishingHookBeforeEvent> {
    private players: Player[] = [];
    private fishingHookMap = new Map<string, Entity>();

    constructor() {
        super();

        ThrowFishingHookEvent.subscribe((ev) => {
            const { player, fishingHook } = ev;
            this.fishingHookMap.set(player.id, fishingHook);
        });

        system.runInterval(() => {
            this.players = [];
        });

        world.beforeEvents.itemUse.subscribe((ev) => {
            const { source: player, itemStack: item } = ev;
            if (item.typeId !== "minecraft:fishing_rod") return;
            if (!this.fishingHookMap.has(player.id)) return;
            this.players.push(player);
        });

        world.beforeEvents.entityRemove.subscribe((ev) => {
            const entity = ev.removedEntity;
            if (entity.typeId !== "minecraft:fishing_hook") return;
            const player = this.players.pop();
            if (!player) return;

            for (const [callback] of this.callbackMap) {
                callback({ player, fishingHook: entity });
            }
            this.fishingHookMap.delete(player.id);
        });
    }
}

export const PullUpFishingHookEvent = new PullUpFishingHookBeforeEventSignal();
