export class Vec3 {
    /**
     * @param {string|number} x
     * @param {string|number} y
     * @param {string|number} z
     */
    constructor(x = 0, y = 0, z = 0) {
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
    }

    static get ZERO() {
        return Vec3.from(0);
    }

    static get POSITIVE() {
        return Vec3.from(1);
    }

    static get NEGATIVE() {
        return Vec3.from(-1);
    }

    static get POSITIVE_INFINITY() {
        return Vec3.from(Number.POSITIVE_INFINITY);
    }

    static get NEGATIVE_INFINITY() {
        return Vec3.from(Number.NEGATIVE_INFINITY);
    }

    static get DOWN() {
        return new Vec3(0, -1, 0);
    }
    // @ts-ignore
    static isVec3(object) {
        return object instanceof Vec3;
    }

    /**
     * @param {import("./vec3.d.ts").Vec3Like} object
     * @param {(vec: Vec3) => Vec3} map
     * @returns {Vec3}
     */
    static from(object, map = (vec) => vec) {
        if (Vec3.isVec3(object)) return map(object);
        if (typeof object === "number") return map(new Vec3(object, object, object));
        if (typeof object === "string") return Vec3.from(object.trim().split(/ +/));
        if (Array.isArray(object)) return map(new Vec3(object[0], object[1], object[2]));
        const { x = 0, y = 0, z = 0 } = object ?? {};
        return map(new Vec3(x, y, z));
    }

    // @ts-ignore
    static add(vec, ...vector) {
        return vector.reduce(
            (t, vec) => Vec3.from(vec, (v) => new Vec3(t.x + v.x, t.y + v.y, t.z + v.z)),
            Vec3.from(vec)
        );
    }

    // @ts-ignore
    static subtract(vec, ...vector) {
        return vector.reduce(
            (t, vec) => Vec3.from(vec, (v) => new Vec3(t.x - v.x, t.y - v.y, t.z - v.z)),
            Vec3.from(vec)
        );
    }

    // @ts-ignore
    static multiply(vec, ...vector) {
        return vector.reduce(
            (t, vec) => Vec3.from(vec, (v) => new Vec3(t.x * v.x, t.y * v.y, t.z * v.z)),
            Vec3.from(vec)
        );
    }

    // @ts-ignore
    static divide(vec, ...vector) {
        return vector.reduce(
            (t, vec) => Vec3.from(vec, (v) => new Vec3(t.x / v.x, t.y / v.y, t.z / v.z)),
            Vec3.from(vec)
        );
    }

    // @ts-ignore
    static pow(vec, n) {
        return Vec3.from(vec, (v) => new Vec3(v.x * n, v.y * n, v.z * n));
    }

    // @ts-ignore
    static ceil(vec) {
        return Vec3.from(vec, (v) => new Vec3(Math.ceil(v.x), Math.ceil(v.y), Math.ceil(v.z)));
    }

    // @ts-ignore
    static round(vec) {
        return Vec3.from(vec, (v) => new Vec3(Math.round(v.x), Math.round(v.y), Math.round(v.z)));
    }

    // @ts-ignore
    static floor(vec) {
        return Vec3.from(vec, (v) => new Vec3(Math.floor(v.x), Math.floor(v.y), Math.floor(v.z)));
    }

    // @ts-ignore
    static abs(vec) {
        return Vec3.from(vec, (v) => new Vec3(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)));
    }

    // @ts-ignore
    static sign(vec) {
        return Vec3.from(vec, (v) => new Vec3(Math.sign(v.x), Math.sign(v.y), Math.sign(v.z)));
    }

    // @ts-ignore
    static fixed(vec, n) {
        return Vec3.divide(Vec3.round(Vec3.multiply(vec, 10 ** n)), 10 ** n);
    }

    // @ts-ignore
    static min(...vector) {
        return vector.reduce(
            (t, vec) =>
                Vec3.from(
                    vec,
                    (v) => new Vec3(Math.min(t.x, v.x), Math.min(t.y, v.y), Math.min(t.z, v.z))
                ),
            Vec3.POSITIVE_INFINITY
        );
    }

    // @ts-ignore
    static max(...vector) {
        return vector.reduce(
            (t, vec) =>
                Vec3.from(
                    vec,
                    (v) => new Vec3(Math.max(t.x, v.x), Math.max(t.y, v.y), Math.max(t.z, v.z))
                ),
            Vec3.NEGATIVE_INFINITY
        );
    }

    // @ts-ignore
    static magnitude(vec) {
        return Math.sqrt(Vec3.dot(vec, vec));
    }

    // @ts-ignore
    static normalize(vec) {
        return Vec3.divide(vec, Vec3.magnitude(vec));
    }

    // @ts-ignore
    static cross(a, b) {
        return ((a, b) =>
            new Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x))(
            Vec3.from(a),
            Vec3.from(b)
        );
    }

    // @ts-ignore
    static dot(a, b) {
        return ((a, b) => a.x * b.x + a.y * b.y + a.z * b.z)(Vec3.from(a), Vec3.from(b));
    }

    // @ts-ignore
    static angleBetween(a, b) {
        return Math.acos(Vec3.dot(a, b) / (Vec3.magnitude(a) * Vec3.magnitude(b)));
    }

    // @ts-ignore
    static projection(a, b) {
        return Vec3.multiply(b, Vec3.dot(a, b) / Vec3.dot(b, b) ** 2);
    }

    // @ts-ignore
    static rejection(a, b) {
        return Vec3.subtract(a, Vec3.projection(a, b));
    }

    // @ts-ignore
    static reflect(vec, n) {
        return Vec3.subtract(vec, Vec3.multiply(n, 2 * Vec3.dot(vec, n)));
    }

    // @ts-ignore
    static lerp(a, b, t) {
        return Vec3.multiply(a, 1 - t).add(Vec3.multiply(b, t));
    }

    // @ts-ignore
    static slerp(a, b, t) {
        const dot = Vec3.dot(a, b);
        const theta = Math.acos(dot) * t;
        return Vec3.multiply(a, Math.cos(theta)).add(
            Vec3.subtract(b, Vec3.multiply(a, dot)).multiply(Math.sin(theta))
        );
    }

    // @ts-ignore
    static distance(a, b) {
        return Vec3.magnitude(Vec3.subtract(a, b));
    }

    // @ts-ignore
    static circle(vec, radius, angle) {
        return Vec3.from(vec).offset(radius * Math.cos(angle), 0, radius * Math.sin(angle));
    }

    // @ts-ignore
    static sphere(vec, radius, longitude, latitude) {
        return Vec3.from(vec).offset(
            radius * Math.sin(latitude) * Math.cos(longitude),
            radius * Math.cos(latitude),
            radius * Math.sin(latitude) * Math.sin(longitude)
        );
    }

    // @ts-ignore
    static rotateX(vec, angle, origin = Vec3.ZERO) {
        const v = Vec3.from(vec);
        const o = Vec3.from(origin);
        const d = Vec3.subtract(v, o);
        return new Vec3(
            v.x,
            d.y * Math.cos(angle) - d.z * Math.sin(angle) + o.y,
            d.y * Math.sin(angle) + d.z * Math.cos(angle) + o.z
        );
    }

    // @ts-ignore
    static rotateY(vec, angle, origin = Vec3.ZERO) {
        const v = Vec3.from(vec);
        const o = Vec3.from(origin);
        const d = Vec3.subtract(v, o);
        return new Vec3(
            d.x * Math.cos(angle) - d.z * Math.sin(angle) + o.x,
            v.y,
            d.x * Math.sin(angle) + d.z * Math.cos(angle) + o.z
        );
    }

    // @ts-ignore
    static rotateZ(vec, angle, origin = Vec3.ZERO) {
        const v = Vec3.from(vec);
        const o = Vec3.from(origin);
        const d = Vec3.subtract(v, o);
        return new Vec3(
            d.x * Math.cos(angle) - d.y * Math.sin(angle) + o.x,
            d.x * Math.sin(angle) + d.y * Math.cos(angle) + o.y,
            v.z
        );
    }

    // @ts-ignore
    static facDirection(a, b) {
        return Vec3.normalize(Vec3.subtract(b, a));
    }

    // @ts-ignore
    static rotDirection(rot) {
        return ((vec) =>
            new Vec3(
                -Math.sin(vec.y) * Math.cos(vec.x),
                -Math.sin(vec.x),
                Math.cos(vec.y) * Math.cos(vec.x)
            ))(Vec3.multiply(rot, Math.PI / 180));
    }

    // @ts-ignore
    static equals(a, b, axis = "xyz") {
        // @ts-ignore
        return ((a, b) => [...axis].every((x) => a[x] === b[x]))(Vec3.from(a), Vec3.from(b));
    }

    // @ts-ignore
    static size(a, b) {
        return Vec3.subtract(Vec3.max(a, b), Vec3.min(a, b)).add(1);
    }

    // @ts-ignore
    static volume(a, b) {
        const size = Vec3.size(a, b);
        return size.x * size.y * size.z;
    }

    // @ts-ignore
    add(...vector) {
        return Vec3.add(this, ...vector);
    }

    // @ts-ignore
    subtract(...vector) {
        return Vec3.subtract(this, ...vector);
    }

    // @ts-ignore
    multiply(...vector) {
        return Vec3.multiply(this, ...vector);
    }

    // @ts-ignore
    divide(...vector) {
        return Vec3.divide(this, ...vector);
    }

    // @ts-ignore
    pow(n) {
        return Vec3.pow(this, n);
    }

    ceil() {
        return Vec3.ceil(this);
    }

    round() {
        return Vec3.round(this);
    }

    floor() {
        return Vec3.floor(this);
    }

    abs() {
        return Vec3.abs(this);
    }

    sign() {
        return Vec3.sign(this);
    }

    // @ts-ignore
    fixed(n) {
        return Vec3.fixed(this, n);
    }

    normalize() {
        return Vec3.normalize(this);
    }

    // @ts-ignore
    setX(x) {
        return new Vec3(x, this.y, this.z);
    }

    // @ts-ignore
    setY(y) {
        return new Vec3(this.x, y, this.z);
    }

    // @ts-ignore
    setZ(z) {
        return new Vec3(this.x, this.y, z);
    }

    // @ts-ignore
    offset(x, y, z) {
        return Vec3.add(this, new Vec3(x, y, z));
    }

    // @ts-ignore
    offsetX(x) {
        return this.offset(x, 0, 0);
    }

    // @ts-ignore
    offsetY(y) {
        return this.offset(0, y, 0);
    }

    // @ts-ignore
    offsetZ(z) {
        return this.offset(0, 0, z);
    }

    // @ts-ignore
    offsetLocal(x, y, z, dirct) {
        const zVec = Vec3.from(dirct);
        const xVec = Vec3.normalize(new Vec3(zVec.z, 0, -zVec.x));
        const yVec = Vec3.cross(zVec, xVec);
        return Vec3.add(
            this,
            Vec3.multiply(xVec, x),
            Vec3.multiply(yVec, y),
            Vec3.multiply(zVec, z)
        );
    }

    // @ts-ignore
    offsetLocalX(x, dirct) {
        return this.offsetLocal(x, 0, 0, dirct);
    }

    // @ts-ignore
    offsetLocalY(y, dirct) {
        return this.offsetLocal(0, y, 0, dirct);
    }

    // @ts-ignore
    offsetLocalZ(z, dirct) {
        return this.offsetLocal(0, 0, z, dirct);
    }

    // @ts-ignore
    rotateX(angle, origin = Vec3.ZERO) {
        return Vec3.rotateX(this, angle, origin);
    }

    // @ts-ignore
    rotateY(angle, origin = Vec3.ZERO) {
        return Vec3.rotateY(this, angle, origin);
    }

    // @ts-ignore
    rotateZ(angle, origin = Vec3.ZERO) {
        return Vec3.rotateZ(this, angle, origin);
    }

    // @ts-ignore
    equals(vec, axis = "xyz") {
        return Vec3.equals(this, vec, axis);
    }

    toString() {
        return `${this.x} ${this.y} ${this.z}`;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }

    toJSON() {
        return { x: this.x, y: this.y, z: this.z };
    }
}
