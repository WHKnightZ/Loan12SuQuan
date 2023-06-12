import { APP_NAME } from "@/configs/consts";

export const getAppName = () => APP_NAME;

export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const getImageSrc = (src: string, ext: "png" | "jpg" | "svg" = "png") => `/static/images/${src}.${ext}`;
