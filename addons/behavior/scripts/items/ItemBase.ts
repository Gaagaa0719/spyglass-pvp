import { ItemStopUseAfterEvent, ItemUseAfterEvent, world } from "@minecraft/server";

export abstract class ItemBase {
    abstract itemId: string;
    constructor() {
        world.afterEvents.itemUse.subscribe((ev) => {
            const { itemStack: item } = ev;
            if (item.typeId !== this.itemId) return;
            this.onUse(ev);
        });

        world.afterEvents.itemStopUse.subscribe((ev) => {
            const { itemStack: item } = ev;
            if (!item) return;
            if (item.typeId !== this.itemId) return;
            this.onStopUse(ev);
        });
    }

    onUse(ev: ItemUseAfterEvent) {}

    onStopUse(ev: ItemStopUseAfterEvent) {}
}
