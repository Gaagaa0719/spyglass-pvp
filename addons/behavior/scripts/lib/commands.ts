import type {
    BlockType,
    CustomCommandOrigin,
    CustomCommandParamType,
    CustomCommandRegistry,
    CustomCommandResult,
    Entity,
    EntityType,
    ItemType,
    Player,
    Vector3
} from "@minecraft/server";
import { CommandPermissionLevel, CustomCommandStatus, system } from "@minecraft/server";

interface CustomCmdParam {
    type: CustomCommandParamType;
    required?: boolean;
}

interface CustomCmdData<P extends Record<string, CustomCmdParam>> {
    name: `${string}:${string}`;
    description: string;
    parameters: P;
    permission?: CommandPermissionLevel;
}

type CustomCmdParamParse<P extends CustomCmdParam, N, ENUMS> = P extends {
    type: infer T extends CustomCommandParamType;
    required?: infer Req extends boolean;
}
    ? T extends CustomCommandParamType.Enum
        ? ENUMS extends Record<string, string[]>
            ? N extends keyof ENUMS
                ? ENUMS[N][number] | (Req extends false ? undefined : never)
                : CustomCmdParamMap[T] | (Req extends false ? undefined : never)
            : CustomCmdParamMap[T] | (Req extends false ? undefined : never)
        : CustomCmdParamMap[T] | (Req extends false ? undefined : never)
    : never;

type CustomCmdCallback<P extends Record<string, CustomCmdParam>, ENUMS> = (
    args: { [K in keyof P]: CustomCmdParamParse<P[K], K, ENUMS> },
    origin: CustomCommandOrigin,
    output: CustomCmdOutput
) => void;

interface CustomCmdParamMap {
    [CustomCommandParamType.BlockType]: BlockType;
    [CustomCommandParamType.Boolean]: boolean;
    [CustomCommandParamType.EntitySelector]: Entity[];
    [CustomCommandParamType.EntityType]: EntityType;
    [CustomCommandParamType.Enum]: string;
    [CustomCommandParamType.Float]: number;
    [CustomCommandParamType.Integer]: number;
    [CustomCommandParamType.ItemType]: ItemType;
    [CustomCommandParamType.PlayerSelector]: Player[];
    [CustomCommandParamType.Location]: Vector3;
    [CustomCommandParamType.String]: string;
}

class CommandManager<ENUMS> {
    public static readonly instance = new CommandManager();
    private static readonly commands = new Map<string, Command>();
    private static readonly enums = new Map<string, { name: string; values: string[] }>();

    private constructor() {}

    register<PARAMS extends Record<string, CustomCmdParam>>(
        data: CustomCmdData<PARAMS>,
        callback: CustomCmdCallback<PARAMS, ENUMS>
    ) {
        if (CommandManager.commands.has(data.name))
            return this.sendError(`Command '${data.name}' is already registered.`);
        if (!this.paramCheck(data.parameters))
            return this.sendError(
                `Command '${data.name}' Mandatory parameters cannot be added after optional parameters.`
            );
        CommandManager.commands.set(data.name, Command.from(data, callback));
        return this;
    }

    registerEnum<N extends `${string}:${string}`, V extends string[]>(name: N, ...values: V) {
        if (!values.length) return this.sendError(`Enum '${name}' has no value.`);
        if (CommandManager.enums.has(name))
            return this.sendError(`Enum '${name}' is already registered.`);
        CommandManager.enums.set(name, { name, values });
        return this as unknown as CommandManager<{
            [K in N | keyof ENUMS]: K extends keyof ENUMS ? ENUMS[K] : V;
        }>;
    }

    private paramCheck(params: Record<string, CustomCmdParam>) {
        return Object.entries(params).every(([_, current], i, a) => {
            if (i === 0) return true;
            return (a[i - 1][1].required ?? false) || !(current.required ?? false);
        });
    }

    private sendError(message: string) {
        console.warn(`[Custom Command][Warn] ${message} Registration skipped.`);
        return this;
    }

    static {
        system.beforeEvents.startup.subscribe((ev) => {
            for (const { name, values } of CommandManager.enums.values()) {
                ev.customCommandRegistry.registerEnum(name, values);
            }
            for (const cmd of CommandManager.commands.values()) {
                ev.customCommandRegistry.registerCommand(cmd.data, cmd.callback);
            }
        });
    }
}

class Command {
    constructor(
        public readonly data: Parameters<CustomCommandRegistry["registerCommand"]>[0],
        public readonly callback: Parameters<CustomCommandRegistry["registerCommand"]>[1]
    ) {}

    static from<PARAMS extends Record<string, CustomCmdParam>, ENUMS>(
        data: CustomCmdData<PARAMS>,
        callback: CustomCmdCallback<PARAMS, ENUMS>
    ) {
        return new Command(
            {
                name: data.name,
                description: data.description,
                permissionLevel: data.permission ?? CommandPermissionLevel.GameDirectors,
                mandatoryParameters: Command.parseParameters(data.parameters),
                optionalParameters: Command.parseParameters(data.parameters, true)
            },
            (origin, ...args) => {
                const output = new CustomCmdOutput();
                callback(
                    Object.fromEntries(
                        Object.keys(data.parameters).map((k, i) => [k, args[i]])
                    ) as {
                        [K in keyof PARAMS]: CustomCmdParamParse<PARAMS[K], K, ENUMS>;
                    },
                    origin,
                    output
                );
                return output;
            }
        );
    }

    private static parseParameters(params: Record<string, CustomCmdParam>, optional = false) {
        return Object.entries(params).flatMap(([name, { type, required }]) =>
            !required === optional ? { name, type } : []
        );
    }
}

class CustomCmdOutput implements CustomCommandResult {
    private _status: CustomCommandStatus;
    private _message?: string;
    constructor() {
        this._status = CustomCommandStatus.Success;
    }

    success(message?: string) {
        this._status = CustomCommandStatus.Success;
        this._message = message;
    }
    error(message?: string) {
        this._status = CustomCommandStatus.Failure;
        this._message = message;
    }

    get status() {
        return this._status;
    }

    get message() {
        return this._message;
    }
}

export const commands = CommandManager.instance;
