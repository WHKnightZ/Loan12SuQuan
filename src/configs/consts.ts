import { IBase, ICharacterAttributes, ICharacterId, ICharacterWithoutIdAttributes, IPoint, ITileType } from "@/types";

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
 * Chính giữa bàn
 */
export const BOARD_CENTER = BOARD_SIZE / 2;
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
 * Sai số để xét xem 1 số bằng 0 hay chưa
 */
export const EPSILON_2 = 0.01;
/**
 * Khoảng thời gian người chơi được gợi ý nếu không thao tác (tính bằng số frame)
 */
export const TIMER_HINT_DELAY_DEFAULT = 300;
/**
 * Sau khi load font xong, x2 kích thước font
 */
export const FONT_SCALE = 2;
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
 * Sát thương tăng thêm của kiếm đỏ
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
 * Sát thương tăng thêm khi được cuồng nộ
 */
export const POWER_ATTACK_MULTIPLIER = 2.5;
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
  [TILES.ENERGY]: { compatible: [], probability: 100, score: 8, texture: none, explosions: [] },
  [TILES.MANA]: { compatible: [], probability: 100, score: 7, texture: none, explosions: [] },
  [TILES.EXP]: { compatible: [], probability: 100, score: 6, texture: none, explosions: [] },
  [TILES.SWORDRED]: { compatible: [TILES.SWORD], probability: 10, score: 36, texture: none, explosions: [] },
};
/**
 * Chứa các thành phần quan trọng của game
 */
export const base = {} as IBase;
/**
 * Avatar width
 */
export const AVATAR_WIDTH = 60;
/**
 * Avatar height
 */
export const AVATAR_HEIGHT = 52;
/**
 * Avatar center
 */
export const AVATAR_CENTER = AVATAR_WIDTH / 2;
/**
 * Offset X của avatar
 */
export const AVATAR_OFFSET_X = 62;
/**
 * Offset Y của avatar
 */
export const AVATAR_OFFSET_Y = BOARD_SIZE + 24;
/**
 * Màu của spin
 */
export const SPIN_ANIMATION_COLOR = "#96e6e0";
/**
 * Danh sách các nhân vật
 */
const CHARACTER_WITHOUT_IDS: { [key in ICharacterId]: ICharacterWithoutIdAttributes } = {
  "trang-si": { name: "Tráng Sĩ", attack: 2, life: 100, intelligence: 60 },
  "linh-quen": { name: "Lính Quèn", attack: 1, life: 80, intelligence: 10 },
  "cay-an-thit": { name: "Cây Ăn Thịt", attack: 3, life: 120, intelligence: 70 },
  "nguyen-bac": { name: "Nguyễn Bặc", attack: 4.5, life: 160, intelligence: 50 },
  "quy-ong": { name: "Quỷ Ong", attack: 5, life: 200, intelligence: 100 },
  "linh-binh-kieu": { name: "Lính Bình Kiều", attack: 5, life: 200, intelligence: 100 },
  "quy-lun": { name: "Quỷ Lùn", attack: 5, life: 200, intelligence: 100 },
  "son-tac": { name: "Sơn Tặc", attack: 5, life: 200, intelligence: 100 },
  "linh-hoi-ho": { name: "Lính Hồi Hồ", attack: 5, life: 200, intelligence: 100 },
  "chon-tinh": { name: "Chồn Tinh", attack: 5, life: 200, intelligence: 100 },
  "ly-khue": { name: "Lý Khuê", attack: 5, life: 200, intelligence: 100 },
  "moc-tinh": { name: "Mộc Tinh", attack: 5, life: 200, intelligence: 100 },
  "linh-phong-chau": { name: "Lính Phong Châu", attack: 5, life: 200, intelligence: 100 },
  "la-duong": { name: "Lã Đường", attack: 5, life: 200, intelligence: 100 },
  "linh-tam-dai": { name: "Lính Tam Đái", attack: 5, life: 200, intelligence: 100 },
  "xa-tinh": { name: "Xà Tinh", attack: 5, life: 200, intelligence: 100 },
  "tuong-do-dong": { name: "Tướng Đỗ Động", attack: 5, life: 200, intelligence: 100 },
  "doc-nhan-tru": { name: "Độc Nhãn Trư", attack: 5, life: 200, intelligence: 100 },
  "do-canh-thac": { name: "Đỗ Cảnh Thạc", attack: 5, life: 200, intelligence: 100 },
  "ngo-xuong-xi": { name: "Ngô Xương Xí", attack: 5, life: 200, intelligence: 100 },
  "nhen-tinh": { name: "Nhện Tinh", attack: 5, life: 200, intelligence: 100 },
  "nguyen-tri-kha": { name: "Nguyễn Trí Khả", attack: 5, life: 200, intelligence: 100 },
  "ngo-nhat-khanh": { name: "Ngô Nhật Khánh", attack: 5, life: 200, intelligence: 100 },
  "sau-quy": { name: "Sâu Quỷ", attack: 5, life: 200, intelligence: 100 },
  "kieu-thuan": { name: "Kiều Thuận", attack: 15, life: 1000, intelligence: 100 },
  "kieu-cong-han": { name: "Kiều Công Hãn", attack: 15, life: 1000, intelligence: 100 },
};
export const CHARACTERS = getKeys(CHARACTER_WITHOUT_IDS).reduce(
  (a, b) => ({ ...a, [b]: { ...CHARACTER_WITHOUT_IDS[b], id: b } }),
  {} as { [key in ICharacterId]: ICharacterAttributes }
);

export const ENEMIES = [
  CHARACTERS["linh-quen"],
  CHARACTERS["cay-an-thit"],
  CHARACTERS["nguyen-bac"],
  CHARACTERS["quy-ong"],
  CHARACTERS["linh-binh-kieu"],
  CHARACTERS["quy-lun"],
  CHARACTERS["son-tac"],
  CHARACTERS["linh-hoi-ho"],
  CHARACTERS["chon-tinh"],
  CHARACTERS["ly-khue"],
  CHARACTERS["moc-tinh"],
  CHARACTERS["linh-phong-chau"],
  CHARACTERS["la-duong"],
  CHARACTERS["linh-tam-dai"],
  CHARACTERS["xa-tinh"],
  CHARACTERS["tuong-do-dong"],
  CHARACTERS["doc-nhan-tru"],
  CHARACTERS["do-canh-thac"],
  CHARACTERS["ngo-xuong-xi"],
  CHARACTERS["nhen-tinh"],
  CHARACTERS["nguyen-tri-kha"],
  CHARACTERS["ngo-nhat-khanh"],
  CHARACTERS["sau-quy"],
  CHARACTERS["kieu-thuan"],
  CHARACTERS["kieu-cong-han"],
];

export const DEFAULT_CHARACTER: ICharacterId = "trang-si";

export const BASE_MAP: IPoint[] = [];
