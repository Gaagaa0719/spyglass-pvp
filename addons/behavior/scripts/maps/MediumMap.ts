import { BlockVolume, Dimension, world } from "@minecraft/server";
import { Vec3 } from "../utils/vec3";
import { MapBase } from "./MapBase";

class MediumMap extends MapBase {
    dimension: Dimension = null;
    volume: BlockVolume = null;

    initialize(): void {
        this.dimension = world.getDimension("overworld");
        this.volume = new BlockVolume(new Vec3(-107, 0, 44), new Vec3(-203, 0, -97));
    }
}

export const mediumMap = new MediumMap();
