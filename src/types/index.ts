export type TileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

export type Point = { x: number; y: number; value: number };

export type AllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; point: number }[];

export type TileInfo = { x: number; y: number; point: number; value: number };

export type GameState = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE";
