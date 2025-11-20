const fs = require("node:fs");
const path = require("node:path");
const vanillaDataPath = "./temp/bedrock-samples-main/";

let base = `
/**
 * このファイルは生成用スクリプトで作られたものです。
 * このファイルを編集しても変更は適応されません。
 * 編集する場合はgenerateItemTextureListを編集してください。
 */

export const texturePathList = `;

/**
 * @typedef itemData
 * @prop {string} command_name
 * @prop {string} name
 * @prop {number} raw_id
 * @prop {string} serialization_id
 * @prop {string} serialization_name
 */

const texturePathList = {};

/** @type {itemData[]} */
const vanillaItems = JSON.parse(
    fs.readFileSync(`${vanillaDataPath}/metadata/vanilladata_modules/mojang-items.json`, "utf-8")
).data_items;

const textureFileNames = fs
    .readdirSync(`${vanillaDataPath}/resource_pack/textures/items`)
    .map((fileName) => fileName.replace(".png", ""));

const sortedTextureNames = textureFileNames.map((fileName) => ({
    name: fileName,
    sortedNameParts: fileName.split("_").sort()
}));

for (const item of vanillaItems) {
    const itemBaseName = item.name.replace("minecraft:", "");
    const sortedNameParts = itemBaseName.split("_").sort();

    const matchingTexture = sortedTextureNames.find(
        (texture) => JSON.stringify(texture.sortedNameParts) === JSON.stringify(sortedNameParts)
    );

    texturePathList[item.name] = matchingTexture
        ? `textures/items/${matchingTexture.name}`
        : undefined;
}

base += JSON.stringify(texturePathList, null, "\t");

fs.writeFileSync("../addons/behavior/scripts/item_textures.js", base);
