import type { Player as BetaPlayer } from "@minecraft/server";

export * from "@minecraft/server";
export * from "@minecraft/server-ui";

declare module "@minecraft/server" {
    export interface Dimension {
        spawnEntity(identifier: string, location: Vector3, options?: SpawnEntityOptions): Entity;
    }

    export interface Entity {
        getProperty<T extends boolean | number | string | Vector3>(
            identifier: string
        ): NoInfer<T> | undefined;
        getDynamicProperty<T extends boolean | number | string | Vector3>(
            identifier: string
        ): NoInfer<T> | undefined;
        setDynamicProperty<T extends boolean | number | string | Vector3>(
            identifier: string,
            value?: T
        ): void;
    }

    export interface World {
        getDynamicProperty<T extends boolean | number | string | Vector3>(
            identifier: string
        ): NoInfer<T> | undefined;
        setDynamicProperty<T extends boolean | number | string | Vector3>(
            identifier: string,
            value?: T
        ): void;
    }
}

declare module "@minecraft/server-ui" {
    export interface ActionFormData {
        show(player: BetaPlayer): Promise<ActionFormResponse>;
    }

    export interface MessageFormData {
        show(player: BetaPlayer): Promise<MessageFormResponse>;
    }

    export interface ModalFormData {
        show(player: BetaPlayer): Promise<ModalFormResponse>;
    }
}
