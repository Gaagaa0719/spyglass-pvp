/**
 * Vec3になりうる値
 */
type Vec3Like =
    | { x?: string | number; y?: string | number; z?: string | number }
    | (string | number)[]
    | string
    | number;

/**
 * xyz軸のベクトル
 */
interface Vector3 {
    x: number;
    y: number;
    z: number;
}

/**
 * xy軸のベクトル
 */
interface VectorXY {
    x: number;
    y: number;
}

/**
 * ベクトルの操作
 */
export class Vec3 {
    /**
     * @param x x成分
     * @param y y成分
     * @param z z成分
     */
    constructor(x?: string | number, y?: string | number, z?: string | number);

    /**
     * @remarks
     * ゼロベクトル
     */
    static readonly ZERO: Vec3;

    /**
     * @remarks
     * 成分がそれぞれ1のベクトル
     */
    static readonly POSITIVE: Vec3;

    /**
     * @remarks
     * 成分がそれぞれ-1のベクトル
     */
    static readonly NEGATIVE: Vec3;

    /**
     * @remarks
     * 成分がそれぞれ正の無限大のベクトル
     */
    static readonly POSITIVE_INFINITY: Vec3;

    /**
     * @remarks
     * 成分がそれぞれ負の無限大のベクトル
     */
    static readonly NEGATIVE_INFINITY: Vec3;

    static readonly DOWN: Vec3;

    /**
     * @param vec 値
     * @remarks
     * 値がVec3であるかを判断する
     */
    static isVec3(vec: Vec3Like): vec is Vec3;

    /**
     * @param object 値
     * @param map パースした後の値
     * @remarks
     * 値をVec3にパースする
     */
    static from<V extends Vec3>(object: Vec3Like, map?: (vec: Vec3) => V): V;

    /**
     * @param vec 足されるベクトル
     * @param vector 足すベクトル
     * @remarks
     * ベクトルの和を取る
     */
    static add(vec: Vec3Like, ...vector: Vec3Like[]): Vec3;

    /**
     * @param vec 引かれるベクトル
     * @param vector 引くベクトル
     * @remarks
     * ベクトルの差を取る
     */
    static subtract(vec: Vec3Like, ...vector: Vec3Like[]): Vec3;

    /**
     * @param vec 掛けられるベクトル
     * @param vector 掛けるベクトル
     * @remarks
     * ベクトルの積を取る
     */
    static multiply(vec: Vec3Like, ...vector: Vec3Like[]): Vec3;

    /**
     * @param vec 割られるベクトル
     * @param vector 割るベクトル
     * @remarks
     * ベクトルの商を取る
     */
    static divide(vec: Vec3Like, ...vector: Vec3Like[]): Vec3;

    /**
     * @param vec 基ベクトル
     * @param n 指数
     * @remarks
     * ベクトルの各成分を切り上げる
     */
    static pow(vec: Vec3Like, n: number): Vec3;

    /**
     * @param vec ベクトル
     * @remarks
     * ベクトルの各成分を切り上げる
     */
    static ceil(vec: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @remarks
     * ベクトルの各成分を四捨五入する
     */
    static round(vec: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @remarks
     * ベクトルの各成分を切り捨てる
     */
    static floor(vec: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @remarks
     * ベクトルの各成分の絶対値を取る
     */
    static abs(vec: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @remarks
     * ベクトルの各成分の符号を-1, 0, 1として表したベクトルを取る
     */
    static sign(vec: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @param n 桁
     * @remarks
     * ベクトルの各成分を少数第n桁目で四捨五入したベクトルを取る
     */
    static fixed(vec: Vec3Like, n: number): Vec3;

    /**
     * @param vector ベクトル
     * @remarks
     * 入力したベクトルの成分の内、最も小さい値を成分とするベクトルを取る
     */
    static min(...vector: Vec3Like[]): Vec3;

    /**
     * @param vector ベクトル
     * @remarks
     * 入力したベクトルの成分の内、最も大きい値を成分とするベクトルを取る
     */
    static max(...vector: Vec3Like[]): Vec3;

    /**
     * @param vec ベクトル
     * @remarks
     * ベクトルの大きさを返す
     */
    static magnitude(vec: Vec3Like): number;

    /**
     * @param vec ベクトル
     * @remarks
     * ベクトルを正規化する
     */
    static normalize(vec: Vec3Like): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * 二つのベクトルの外積を取る
     */
    static cross(a: Vec3Like, b: Vec3Like): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * 二つのベクトルの内積を取る
     */
    static dot(a: Vec3Like, b: Vec3Like): number;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * 二つのベクトルの角度を返す
     */
    static angleBetween(a: Vec3Like, b: Vec3Like): number;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * 二つのベクトルの正射影ベクトルを取る
     */
    static projection(a: Vec3Like, b: Vec3Like): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * 二つのベクトルの反射影ベクトルを取る
     */
    static rejection(a: Vec3Like, b: Vec3Like): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * 二つのベクトルの反射ベクトルを取る
     */
    static reflect(vec: Vec3Like, n: number): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @param t aからのbへの割合 (0-1)
     * @remarks
     * ベクトルの線形補間を取る
     */
    static lerp(a: Vec3Like, b: Vec3Like, t: number): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @param t aからのbへの割合 (0-1)
     * @remarks
     * ベクトルの球面線形補間を取る
     */
    static slerp(a: Vec3Like, b: Vec3Like, t: number): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * 二つのベクトルの距離を返す
     */
    static distance(a: Vec3Like, b: Vec3Like): number;

    /**
     * @param vec 中心のベクトル
     * @param radius 半径
     * @param angle 角度 [rad]
     * @remarks
     * 角度から円上の点のベクトルを取る
     */
    static circle(vec: Vec3Like, radius: number, angle: number): Vec3;

    /**
     * @param vec 中心のベクトル
     * @param radius 半径
     * @param longitude 経度 [rad]
     * @param latitude 緯度 [rad]
     * @remarks
     * 経度と緯度から球上の点のベクトルを取る
     */
    static sphere(vec: Vec3Like, radius: number, longitude: number, latitude: number): Vec3;

    /**
     * @param vec ベクトル
     * @param angle 角度 [rad]
     * @param origin 中心
     * @remarks
     * originを原点とするx軸に対して点対称に回転させたベクトルを取る
     */
    static rotateX(vec: Vec3Like, angle: number, origin?: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @param angle 角度 [rad]
     * @param origin 中心
     * @remarks
     * originを原点とするy軸に対して点対称に回転させたベクトルを取る
     */
    static rotateY(vec: Vec3Like, angle: number, origin?: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @param angle 角度 [rad]
     * @param origin 中心
     * @remarks
     * originを原点とするz軸に対して点対称に回転させたベクトルを取る
     */
    static rotateZ(vec: Vec3Like, angle: number, origin?: Vec3Like): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * a座標からb座標を見た時の正規化された方向ベクトルを取る
     */
    static facDirection(a: Vec3Like, b: Vec3Like): Vec3;

    /**
     * @param rot 向き
     * @remarks
     * 向きから正規化された方向ベクトルを取る
     */
    static rotDirection(rot: VectorXY): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @param axis 軸
     * @remarks
     * aベクトルとbベクトルの各成分が等しい時trueを返す
     */
    static equals(a: Vec3Like, b: Vec3Like, axis?: `${"x" | ""}${"y" | ""}${"z" | ""}`): boolean;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * aベクトルとbベクトルのコンテナとするベクトルを取る
     */
    static size(a: Vec3Like, b: Vec3Like): Vec3;

    /**
     * @param a ベクトル
     * @param b ベクトル
     * @remarks
     * aベクトルとbベクトルのコンテナ内の成分数を返す
     */
    static volume(a: Vec3Like, b: Vec3Like): number;

    /**
     * @remarks
     * x成分
     */
    x: number;

    /**
     * @remarks
     * y成分
     */
    y: number;

    /**
     * @remarks
     * z成分
     */
    z: number;

    /**
     * @param vector ベクトル
     * @remarks
     * ベクトルを和を取る
     * {@link Vec3.add()}
     */
    add(...vector: Vec3Like[]): Vec3;

    /**
     * @param vector ベクトル
     * @remarks
     * ベクトルを差を取る
     * {@link Vec3.subtract()}
     */
    subtract(...vector: Vec3Like[]): Vec3;

    /**
     * @param vector ベクトル
     * @remarks
     * ベクトルを積を取る
     * {@link Vec3.multiply()}
     */
    multiply(...vector: Vec3Like[]): Vec3;

    /**
     * @param vector ベクトル
     * @remarks
     * ベクトルを商を取る
     * {@link Vec3.divide()}
     */
    divide(...vector: Vec3Like[]): Vec3;

    /**
     * @param n 指数
     * @remarks
     * ベクトルの各成分をn乗する
     */
    pow(n: number): Vec3;

    /**
     * @remarks
     * ベクトルの各成分を切り上げる
     */
    ceil(): Vec3;

    /**
     * @remarks
     * ベクトルの各成分を切り捨てる
     */
    floor(): Vec3;

    /**
     * @remarks
     * ベクトルの各成分の絶対値を取る
     */
    abs(): Vec3;

    /**
     * @remarks
     * ベクトルの各成分の符号を-1, 0, 1として表す
     */
    sign(): Vec3;

    /**
     * @param n 桁
     * @remarks
     * ベクトルの各成分を少数第n桁目で四捨五入する
     */
    fixed(n: number): Vec3;

    /**
     * @remarks
     * ベクトルを正規化する
     */
    normalize(): Vec3;

    /**
     * @param x x成分
     * @remarks
     * ベクトルのx成分を指定する
     */
    setX(x: number): Vec3;

    /**
     * @param y y成分
     * @remarks
     * ベクトルのy成分を指定する
     */
    setY(y: number): Vec3;

    /**
     * @param z z成分
     * @remarks
     * ベクトルのz成分を指定する
     */
    setZ(z: number): Vec3;

    /**
     * @param x x成分
     * @param y y成分
     * @param z z成分
     * @remarks
     * ベクトルの相対座標
     */
    offset(x: number, y: number, z: number): Vec3;

    /**
     * @param x x成分
     * ベクトルからの相対x座標
     */
    offsetX(x: number): Vec3;

    /**
     * @param y y成分
     * ベクトルからの相対y座標
     */
    offsetY(y: number): Vec3;

    /**
     * @param z z成分
     * ベクトルからの相対z座標
     */
    offsetZ(z: number): Vec3;

    /**
     * @param x x成分
     * @param y y成分
     * @param z z成分
     * @param dirct 方向ベクトル
     * @remarks
     * ベクトルからのローカル座標
     */
    offsetLocal(x: number, y: number, z: number, dirct: Vec3Like): Vec3;

    /**
     * @param x x成分
     * @param dirct 方向ベクトル
     * @remarks
     * ベクトルからのローカルx座標
     */
    offsetLocalX(x: number, dirct: Vec3Like): Vec3;

    /**
     * @param y y成分
     * @param dirct 方向ベクトル
     * @remarks
     * ベクトルからのローカルy座標
     */
    offsetLocalY(y: number, dirct: Vec3Like): Vec3;

    /**
     * @param z z成分
     * @param dirct 方向ベクトル
     * @remarks
     * ベクトルからのローカルz座標
     */
    offsetLocalZ(z: number, dirct: Vec3Like): Vec3;

    /**
     * @param angle 角度 [rad]
     * @param origin 中心
     * @remarks
     * originを原点とするx軸に対して点対称に回転させる
     */
    rotateX(angle: number, origin?: Vec3Like): Vec3;

    /**
     * @param angle 角度 [rad]
     * @param origin 中心
     * @remarks
     * originを原点とするy軸に対して点対称に回転させる
     */
    rotateY(angle: number, origin?: Vec3Like): Vec3;

    /**
     * @param angle 角度 [rad]
     * @param origin 中心
     * @remarks
     * originを原点とするz軸に対して点対称に回転させる
     */
    rotateZ(angle: number, origin?: Vec3Like): Vec3;

    /**
     * @param vec ベクトル
     * @param axis 軸
     * @remarks
     * ベクトルとの各成分が等しい時trueを返す
     */
    equals(vec: Vec3Like, axis?: `${"x" | ""}${"y" | ""}${"z" | ""}`): boolean;

    /**
     * @reamrks
     * ベクトルの各成分を文字列として返す
     */
    toString(): string;

    /**
     * @reamrks
     * ベクトルの各成分を配列として返す
     */
    toArray(): [x: number, y: number, z: number];

    /**
     * @reamrks
     * ベクトルの各成分を連想配列として返す
     */
    toJSON(): Vector3;
}
