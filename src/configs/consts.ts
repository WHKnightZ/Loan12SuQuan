import { IBase, ITileType } from "@/types";

/**
 * Get danh sách các key của object
 */
export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
/**
 * Số khung hình mỗi giây
 */
export const FPS = 60;
/**
 * Khoảng thời gian giữa mỗi khung hình
 */
export const INTERVAL = 1000 / FPS;
/**
 * Màu các ô trên bàn, xen kẽ 2 màu
 */
export const BOARD_COLORS = ["#3e3226", "#554933"];
/**
 * Màu nền, áp dụng cho loading
 */
export const BACKGROUND_COLOR = BOARD_COLORS[1];
/**
 * Số cell trên bàn
 */
export const MAP_WIDTH = 8;
/**
 * Số cell trên bàn - 1
 */
export const MAP_WIDTH_1 = MAP_WIDTH - 1;
/**
 * Tổng số tile
 */
export const TOTAL_TILES = MAP_WIDTH * MAP_WIDTH;
/**
 * Kích thước 1 cell
 */
export const CELL_SIZE = 60;
/**
 * Chính giữa cell
 */
export const CELL_SIZE_HALF = CELL_SIZE / 2;
/**
 * Kích thước bàn
 */
export const BOARD_SIZE = MAP_WIDTH * CELL_SIZE;
/**
 * Chiều cao menu
 */
export const MENU_HEIGHT = 96;
/**
 * Chiều rộng màn hình
 */
export const SCREEN_WIDTH = BOARD_SIZE;
/**
 * Chiều cao màn hình
 */
export const SCREEN_HEIGHT = BOARD_SIZE + MENU_HEIGHT;
/**
 * Chính giữa ngang màn hình
 */
export const SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2;
/**
 * Chính giữa dọc màn hình
 */
export const SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;
/**
 * Kích thước hiển thị của tile
 */
export const TILE_SIZE = 50;
/**
 * Kích thước tile trong spritesheet
 */
export const REAL_TILE_SIZE = 28;
/**
 * Vẽ tile cách 1 khoảng offset để căn giữa tile
 */
export const TILE_OFFSET = Math.floor((CELL_SIZE - TILE_SIZE) / 2);
/**
 * Nếu ăn được 1 hàng nhiều hơn số này thì được thêm 1 lượt
 */
export const GAIN_TURN = 3;
/**
 * Thời gian để swap 2 tile với nhau
 */
export const SWAP_DURATION = 10;
/**
 * Khoảng cách tile dịch chuyển khi swap mỗi khung hình
 */
export const SWAP_OFFSET = CELL_SIZE / SWAP_DURATION;
/**
 * Tốc độ rơi khởi đầu
 */
export const VELOCITY_BASE = 3.5;
/**
 * Tốc độ rơi tăng thêm sau mỗi frame
 */
export const GRAVITY = 0.27;
/**
 * Tỉ lệ để phóng to tile lên
 */
export const SCALE_RATIO = TILE_SIZE / REAL_TILE_SIZE;
/**
 * Chỉ số tính xem gợi ý nước đi của người chơi tốt hay kém
 */
export const PLAYER_INTELLIGENCE = 20;
/**
 * Chỉ số thông minh của máy, quyết định nước đi tốt hay kém
 */
export const COMPUTER_INTELLIGENCE = 100;
/**
 * Mana khởi đầu
 */
export const DEFAULT_MANA = 72;
/**
 * Năng lượng khởi đầu
 */
export const DEFAULT_ENERGY = 100;
/**
 * Sai số để xét xem 1 số bằng 0 hay chưa
 */
export const EPSILON = 0.0001;
/**
 * Khoảng thời gian người chơi bị mất năng lượng (tính bằng số frame)
 */
export const LOSE_ENERGY_INTERVAL = 200;
/**
 * Khoảng thời gian người chơi được gợi ý nếu không thao tác (tính bằng số frame)
 */
export const TIMER_HINT_DELAY_DEFAULT = 300;
/**
 * Code của các tile
 */
export const TILES: { [key in ITileType]: number } = {
  SWORD: 0,
  HEART: 1,
  GOLD: 2,
  ENERGY: 3,
  MANA: 4,
  EXP: 5,
  SWORDRED: 6,
};
/**
 *
 */
export const SWORDRED_ATTACK_MULTIPLIER = 2.5;
/**
 * Tổng số Tile
 */
export const COUNT_TILES = Object.keys(TILES).length;
/**
 * Điểm nhận được khi ăn 4 tile 1 hàng
 */
export const MATCH_4_SCORE = 100;
/**
 * Empty texture
 */
const none = null as any;
/**
 * Lấy chi tiết tile từ tile code
 */
export const mapTileInfo: {
  [key: number]: {
    texture: HTMLImageElement;
    compatible: number[];
    probability: number;
    score: number;
    explosions: HTMLImageElement[];
  };
} = {
  [TILES.SWORD]: { compatible: [TILES.SWORDRED], probability: 90, score: 18, texture: none, explosions: [] },
  [TILES.HEART]: { compatible: [], probability: 100, score: 9, texture: none, explosions: [] },
  [TILES.GOLD]: { compatible: [], probability: 100, score: 6, texture: none, explosions: [] },
  [TILES.ENERGY]: { compatible: [], probability: 100, score: 7, texture: none, explosions: [] },
  [TILES.MANA]: { compatible: [], probability: 100, score: 8, texture: none, explosions: [] },
  [TILES.EXP]: { compatible: [], probability: 100, score: 6, texture: none, explosions: [] },
  [TILES.SWORDRED]: { compatible: [TILES.SWORD], probability: 10, score: 36, texture: none, explosions: [] },
};
/**
 * Chứa các thành phần quan trọng của game
 */
export const base = {} as IBase;
/**
 * Offset X của avatar
 */
export const AVATAR_OFFSET_X = 62;
/**
 * Offset Y của avatar
 */
export const AVATAR_OFFSET_Y = BOARD_SIZE + 24;
