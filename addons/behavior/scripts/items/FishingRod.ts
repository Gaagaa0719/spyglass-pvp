import { Entity, ItemLockMode, Player, system } from "@minecraft/server";
import {
    PullUpFishingHookBeforeEvent,
    PullUpFishingHookEvent
} from "../events/PullUpFishingHookAfterEvent";
import {
    ThrowFishingHookAfterEvent,
    ThrowFishingHookEvent
} from "../events/ThrowFishingHookAfterEvent";
import InventoryUtils from "../utils/InventoryUtils";
import { Vec3 } from "../utils/vec3";

class FishingRod {
    static instance = new this();
    readonly coolTimeTick = 20 * 2;

    private constructor() {
        ThrowFishingHookEvent.subscribe(this.throwHook.bind(this));
        PullUpFishingHookEvent.subscribe(this.pullUpHook.bind(this));
    }

    throwHook(ev: ThrowFishingHookAfterEvent) {
        const { player, fishingHook } = ev;
        const vel = fishingHook.getVelocity();
        fishingHook.applyImpulse(Vec3.multiply(vel, 0.75));
        player.playSound("mob.snowgolem.shoot");
    }

    pullUpHook(ev: PullUpFishingHookBeforeEvent) {
        const { player, fishingHook } = ev;
        this.launch(player, fishingHook);
        this.startCoolTime(player);
    }

    startCoolTime(player: Player) {
        system.run(async () => {
            InventoryUtils.setItem(player, player.selectedSlotIndex);
            await system.waitTicks(this.coolTimeTick);
            if (!player.isValid) return;
            InventoryUtils.addItem(player, "minecraft:fishing_rod", 1, ItemLockMode.inventory);
        });
    }

    launch(player: Player, fishingHook: Entity) {
        const playerLoc = player.location;
        const fishingHookLoc = fishingHook.location;
        const distance = Vec3.distance(playerLoc, fishingHookLoc);
        const unit = Vec3.normalize(Vec3.subtract(fishingHookLoc, playerLoc));
        const vector = Vec3.multiply(unit, distance / 5);
        vector.y = Math.min(vector.y, 1.5);

        system.run(() => {
            player.applyImpulse(vector);
            player.playSound("mob.breeze.shoot");
        });
    }
}
