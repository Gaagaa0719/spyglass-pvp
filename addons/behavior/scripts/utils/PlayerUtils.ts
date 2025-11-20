import {
    EntityComponentTypes,
    EntityEquippableComponent,
    EquipmentSlot,
    ItemStack,
    Player,
    PlayerSoundOptions,
    world
} from "@minecraft/server";

export default class PlayerUtils {
    static isPlayer(player: unknown): player is Player {
        return player instanceof Player;
    }

    static setCurrentHp(player: Player, hp: number) {
        if (!player.isValid) return;

        const comp = player.getComponent(EntityComponentTypes.Health)!;
        comp.setCurrentValue(Math.min(hp, comp.effectiveMax));
    }

    static getCurrentHp(player: Player): number {
        if (!player.isValid) return 0;

        const comp = player.getComponent(EntityComponentTypes.Health)!;
        return comp.currentValue;
    }

    static playsoundForAll(
        soundId: string,
        soundOptions?: PlayerSoundOptions,
        filter?: (player: Player) => boolean
    ) {
        for (const player of world.getAllPlayers()) {
            if (filter && !filter(player)) continue;
            player.playSound(soundId, soundOptions);
        }
    }

    static getEquippableComponent(player: Player): EntityEquippableComponent {
        return player.getComponent(EntityComponentTypes.Equippable)!;
    }

    static getMainHandItem(player: Player): ItemStack | undefined {
        const equipComp = this.getEquippableComponent(player);
        return equipComp.getEquipment(EquipmentSlot.Mainhand);
    }

    static sendSuccessMessage(player: Player, msg: string) {
        player.playSound("note.bell");
        player.sendMessage(`§a${msg}`);
    }

    static sendErrorMessage(player: Player, msg: string) {
        player.playSound("note.bass");
        player.sendMessage(`§c${msg}`);
    }
}
