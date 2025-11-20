import { BlockVolume, Dimension, world } from "@minecraft/server";
import { Vec3 } from "../utils/vec3";
import { MapBase } from "./MapBase";

class SmallMap extends MapBase {
    dimension: Dimension = null;
    volume: BlockVolume = null;

    initialize(): void {
        this.dimension = world.getDimension("overworld");
        this.volume = new BlockVolume(new Vec3(221, 0, -36), new Vec3(290, 0, 60));
    }
}

export const smallMap = new SmallMap();
