import { BlockVolume, Dimension, VectorXZ, world } from "@minecraft/server";
import MathUtils from "../utils/MathUtils";
import { Vec3 } from "../utils/vec3";

export abstract class MapBase {
    abstract dimension: Dimension | null;
    abstract volume: BlockVolume | null;
    private cachedMinLoc: VectorXZ | null = null;
    private cachedMaxLoc: VectorXZ | null = null;

    constructor() {
        world.afterEvents.worldLoad.subscribe(this.initialize.bind(this));
    }

    abstract initialize(): void;

    getCenterPos(): VectorXZ {
        if (this.volume === null) throw new Error("This map is not initialized.");
        const maxLoc = this.getMaxLocation();
        const minLoc = this.getMinLocation();

        const centerX = minLoc.x + (maxLoc.x - minLoc.x) / 2;
        const centerZ = minLoc.z + (maxLoc.z - minLoc.z) / 2;
        return { x: centerX, z: centerZ };
    }

    getRandomPos(): Vec3 {
        if (this.volume === null) throw new Error("This map is not initialized.");
        const maxLoc = this.getMaxLocation();
        const minLoc = this.getMinLocation();

        const location = {
            x: MathUtils.getRandomInt(minLoc.x, maxLoc.x),
            z: MathUtils.getRandomInt(minLoc.z, maxLoc.z)
        };
        const topmostBlock = this.dimension.getTopmostBlock(location);
        const y = topmostBlock ? topmostBlock.location.y + 1 : 0;

        return new Vec3(location.x + 0.5, y, location.z + 0.5);
    }

    private getMaxLocation(): VectorXZ {
        if (this.volume === null) throw new Error("This map is not initialized.");

        if (!this.cachedMaxLoc) {
            const fromLoc = this.volume.from;
            const toLoc = this.volume.to;
            const maxX = Math.max(fromLoc.x, toLoc.x);
            const maxZ = Math.max(fromLoc.z, toLoc.z);
            this.cachedMaxLoc = { x: maxX, z: maxZ };
        }

        return this.cachedMaxLoc;
    }

    private getMinLocation(): VectorXZ {
        if (this.volume === null) throw new Error("This map is not initialized.");

        if (!this.cachedMinLoc) {
            const fromLoc = this.volume.from;
            const toLoc = this.volume.to;
            const minX = Math.min(fromLoc.x, toLoc.x);
            const minZ = Math.min(fromLoc.z, toLoc.z);
            this.cachedMinLoc = { x: minX, z: minZ };
        }

        return this.cachedMinLoc;
    }
}
