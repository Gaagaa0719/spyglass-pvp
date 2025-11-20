import { system, world } from "@minecraft/server";
import { commands } from "../lib/commands";
import { ModalForm } from "../lib/ui-wrapper/ui";
import PlayerUtils from "../utils/PlayerUtils";

export const mapList = ["Large", "Medium", "Small"];

commands.register(
    {
        name: "gaagaa:select_map",
        description: "ゲームで使用するマップを選択します。",
        parameters: {}
    },
    (_, origin) => {
        system.run(() => {
            const player = origin.sourceEntity;
            if (!PlayerUtils.isPlayer(player)) return;

            const form = new ModalForm();
            form.dropdown(
                "maps",
                mapList,
                (select) => world.setDynamicProperty("selectedMapId", mapList[select]),
                1
            );
            form.show(player);
        });
    }
);
