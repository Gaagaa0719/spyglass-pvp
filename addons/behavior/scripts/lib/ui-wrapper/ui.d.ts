import { Player } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, MessageFormData, ModalFormData } from "@minecraft/server-ui";

export type RawMessage = import('@minecraft/server').RawMessage;

export type FormButtonCallback = (player: Player) => Promise<void> | void;

export class ActionForm {
  body(bodyText: string | RawMessage): ActionForm;
  label(text: string | RawMessage): ActionForm;
  divider(): ActionForm;
  button(text: string | RawMessage, callback: FormButtonCallback, iconPath?: string): ActionForm;
  title(titleText: string | RawMessage): ActionForm;
  cancel(callback: (player: Player, reason: FormCancelationReason) => void): ActionForm;
  setBusyRetry(retry: boolean): ActionForm;
  show(player: Player): Promise<boolean>;
}

export class MessageForm {
  title(titleText: string | RawMessage): MessageForm;
  body(bodyText: string | RawMessage): MessageForm;
  button1(text: string, callback: FormButtonCallback): MessageForm;
  button2(text: string, callback: FormButtonCallback): MessageForm;
  cancel(callback: (player: Player, reason: FormCancelationReason) => void): MessageForm;
  setBusyRetry(retry: boolean): MessageForm;
  show(player: Player): Promise<boolean>;
}

export type ModalCallback = (value: string | number | boolean, player?: Player) => Promise<void> | void;
export type ModalDropdownCallback = (selected: number, player?: Player) => Promise<void> | void;
export type ModalSliderCallback = (value: number, player?: Player) => Promise<void> | void;
export type ModalTextFieldCallback = (text: string, player?: Player) => Promise<void> | void;
export type ModalToggleCallback = (value: boolean, player?: Player) => Promise<void> | void;

export class ModalForm {
  title(titleText: string | RawMessage): ModalForm;
  label(text: string): ModalForm;
  submitButton(submitButtonText: string | RawMessage): ModalForm;
  dropdown(label: string | RawMessage, options: string[], callback: ModalDropdownCallback, defaultValueIndex?: number): ModalForm;
  slider(label: string | RawMessage, minimumValue: number, maximumValue: number, valueStep: number, callback: ModalSliderCallback, defaultValue?: number): ModalForm;
  textField(label: string | RawMessage, placeholderText: string, callback: ModalTextFieldCallback, defaultValue?: string): ModalForm;
  toggle(label: string | RawMessage, callback: ModalToggleCallback, defaultValue?: boolean): ModalForm;
  cancel(callback: (player: Player, reason: FormCancelationReason) => void): ModalForm;
  show(player: Player): Promise<boolean>;
}
