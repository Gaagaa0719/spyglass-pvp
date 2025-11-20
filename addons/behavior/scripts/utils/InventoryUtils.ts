import {
    EntityComponentTypes,
    EntityInventoryComponent,
    ItemLockMode,
    ItemStack,
    Player
} from "@minecraft/server";
import { ArrayUtils } from "./ArrayUtils";
import PlayerUtil from "./PlayerUtils";

export default class InventoryUtils {
    static getHasItemAmountFromTag(player: Player, tags: string[]): number {
        const inventoryComp = this.getInventoryComponent(player);
        const container = inventoryComp.container;
        let amount = 0;
        for (let i = 0; i < container.size; i++) {
            const targetItem = container.getItem(i);
            if (!targetItem || !ArrayUtils.isSubset(tags, targetItem.getTags())) continue;
            amount += targetItem.amount;
        }

        return amount;
    }

    static getHasItemAmount(player: Player, itemId: string): number {
        const inventoryComp = this.getInventoryComponent(player);
        const container = inventoryComp.container;
        let amount = 0;
        for (let i = 0; i < container.size; i++) {
            const targetItem = container.getItem(i);
            if (!targetItem || targetItem.typeId !== itemId) continue;
            amount += targetItem.amount;
        }

        return amount;
    }

    static getEmptySlotsCount(player: Player): number {
        const inventoryComp = this.getInventoryComponent(player);
        const container = inventoryComp.container;
        return container.emptySlotsCount;
    }

    static setItem(player: Player, slot: number, item?: ItemStack) {
        const inventoryComp = this.getInventoryComponent(player);
        const container = inventoryComp.container;

        container.setItem(slot, item);
    }

    static addItemStack(player: Player, itemStack: ItemStack) {
        const inventoryComp = this.getInventoryComponent(player);
        const container = inventoryComp.container;
        container.addItem(itemStack);
    }

    static addItem(
        player: Player,
        itemId: string,
        amount: number,
        lockMode = ItemLockMode.none
    ): boolean {
        const inventoryComp = this.getInventoryComponent(player);
        const container = inventoryComp.container;

        function getRequiredEmptySlotsCount(itemId: string, amount: number): number {
            const itemStack = new ItemStack(itemId);
            const maxAmount = itemStack.maxAmount;
            return Math.ceil(amount / maxAmount);
        }
        const requiredEmptySlotsCount = getRequiredEmptySlotsCount(itemId, amount);

        if (container.emptySlotsCount < requiredEmptySlotsCount) {
            PlayerUtil.sendErrorMessage(
                player,
                "インベントリに余裕がありません。\n" +
                    `インベントリの余白を${requiredEmptySlotsCount}枠以上用意してから再度お試しください。`
            );
            return false;
        }

        for (const _ of new Array(requiredEmptySlotsCount)) {
            const itemStack = new ItemStack(itemId);
            itemStack.lockMode = lockMode;
            itemStack.amount = itemStack.maxAmount;
            if (itemStack.maxAmount < amount) amount -= itemStack.maxAmount;
            else itemStack.amount = amount;
            container.addItem(itemStack);
        }

        return true;
    }

    static clearAll(player: Player) {
        const inventoryComp = this.getInventoryComponent(player);
        inventoryComp.container.clearAll();
    }

    static removeItem(player: Player, itemId: string, amount: number): boolean {
        const hasAmount = this.getHasItemAmount(player, itemId);
        if (hasAmount < amount) {
            PlayerUtil.sendErrorMessage(
                player,
                `%${new ItemStack(itemId).localizationKey}の削除に失敗\n` +
                    `アイテム数が${amount - hasAmount}個足りません。`
            );
            return false;
        }
        player.runCommand(`clear @s ${itemId} 0 ${amount}`);

        return true;
    }

    static getInventoryItems(player: Player): Map<number, ItemStack> {
        const comp = this.getInventoryComponent(player);
        const container = comp.container;
        const items: Map<number, ItemStack> = new Map();
        for (let i = 0; i < container.size; i++) {
            const itemStack = container.getItem(i);
            if (!itemStack) continue;
            items.set(i, itemStack);
        }

        return items;
    }

    static getInventoryComponent(player: Player): EntityInventoryComponent {
        return player.getComponent(EntityComponentTypes.Inventory)!;
    }
}
