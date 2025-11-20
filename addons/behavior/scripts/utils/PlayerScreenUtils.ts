import { Player, TitleDisplayOptions, world } from "@minecraft/server";

type PlayerFilter = (player: Player) => boolean;
type TitleDurationOptions = {
    fadeInDuration: number;
    stayDuration: number;
    fadeOutDuration: number;
};

export class PlayerScreenUtils {
    static setActionbar(player: Player, text: string) {
        player.onScreenDisplay.setActionBar(text);
    }

    static setActionbarForAll(text: string, filter?: PlayerFilter) {
        for (const player of world.getAllPlayers()) {
            if (filter && !filter(player)) continue;
            player.onScreenDisplay.setActionBar(text);
        }
    }

    static setSubtitle(
        player: Player,
        text: string,
        options: TitleDurationOptions = {
            fadeInDuration: 3,
            stayDuration: 15,
            fadeOutDuration: 3
        }
    ): number {
        player.onScreenDisplay.setTitle(" ", { subtitle: text, ...options });
        return options.fadeInDuration + options.stayDuration + options.fadeOutDuration;
    }

    static setSubtitleForAll(text: string, filter?: PlayerFilter, options?: TitleDurationOptions) {
        for (const player of world.getAllPlayers()) {
            if (filter && !filter(player)) continue;
            this.setSubtitle(player, text, options);
        }
    }

    static setTitleForAll(text: string, options?: TitleDisplayOptions, filter?: PlayerFilter) {
        for (const player of world.getAllPlayers()) {
            if (filter && !filter(player)) continue;
            player.onScreenDisplay.setTitle(text, options);
        }
    }
}
