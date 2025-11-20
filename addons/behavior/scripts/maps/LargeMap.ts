import { BlockVolume, Dimension, world } from "@minecraft/server";
import { Vec3 } from "../utils/vec3";
import { MapBase } from "./MapBase";

class LargeMap extends MapBase {
    dimension: Dimension = null;
    volume: BlockVolume = null;

    initialize(): void {
        this.dimension = world.getDimension("overworld");
        this.volume = new BlockVolume(new Vec3(383, 0, 43), new Vec3(527, 0, 242));
    }
}

export const largeMap = new LargeMap();
