import { ItemUseAfterEvent } from "@minecraft/server";
import { Vec3 } from "../utils/vec3";
import { ItemBase } from "./ItemBase";

class Feather extends ItemBase {
    itemId = "minecraft:feather";
    static instance = new this();

    private constructor() {
        super();
    }

    onUse(ev: ItemUseAfterEvent): void {
        const player = ev.source;
        player.applyImpulse(new Vec3(0, 2, 0));
        player.playSound("wind_charge.burst");
        player.runCommand(`clear @s ${this.itemId} 0 1`);
    }
}
