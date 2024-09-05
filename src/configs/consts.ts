import {
  IBase,
  ICharacterAttributes,
  ICharacterId,
  ICharacterWithoutIdAttributes,
  IMapPoint,
  IMapPointAvatar,
  ISkillAttributes,
  ISkillId,
  ITileType,
} from "@/types";

/**
 * Check xem thiết bị phải mobile không
 */
export const IS_MOBILE =
  typeof window !== "undefined"
    ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    : false;
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
 * Chiều cao status board
 */
export const STATUS_BOARD_HEIGHT = 150;
/**
 * Chiều rộng màn hình
 */
export const SCREEN_WIDTH = BOARD_SIZE;
/**
 * Chiều cao màn hình
 */
export const SCREEN_HEIGHT = BOARD_SIZE + STATUS_BOARD_HEIGHT;
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
 * Danh sách kỹ năng
 */
export const SKILLS: { [key in ISkillId]: ISkillAttributes } = {
  "qua-cau-lua": {
    name: "Quả Cầu Lửa",
    description: "Gây sát thương kẻ thù, lực sát thương bằng {0}, phá hủy tức thì 1 vùng diện tích 3x3 ô trên bàn cờ.",
    manaCost: 30,
  },
  "mua-thien-thach": {
    name: "Mưa Thiên Thạch",
    description:
      "Gây sát thương kẻ thù, lực sát thương bằng {0}, phá hủy tức thì từ 3 đến 5 vùng diện tích 2x2 ô trên bàn cờ.",
    manaCost: 60,
  },
  "lua-dia-nguc": {
    name: "Lửa Địa Ngục",
    description: "Gây sát thương kẻ thù, lực sát thương bằng {0}, phá hủy tức thì 2 vùng diện tích 4x4 ô trên bàn cờ.",
    manaCost: 100,
  },
  "chuoi-set": {
    name: "Chuỗi Sét",
    description: "Gây sát thương kẻ thù, lực sát thương bằng {0}, phá hủy tức thì từ 4 đến 8 ô trên bàn cờ.",
    manaCost: 30,
  },
  "khien-set": {
    name: "Khiên Sét",
    description: "Hóa giải tất cả các đòn tấn công của kẻ thù. Tác dụng trong 6 lượt.",
    manaCost: 60,
  },
  "sam-set": {
    name: "Sấm Sét",
    description:
      "Gây sát thương kẻ thù, lực sát thương bằng {0}, phá hủy tức thì từ 3 đến 6 vùng diện tích 3x3 ô trên bàn cờ.",
    manaCost: 100,
  },
  "mui-ten-bang": {
    name: "Mũi Tên Băng",
    description: "Gây sát thương kẻ thù, lực sát thương bằng {0}, triệt tiêu một lượng nhỏ năng lượng của kẻ thù.",
    manaCost: 30,
  },
  "cam-lo-thuy": {
    name: "Cam Lộ Thủy",
    description:
      "Phục hồi 20% sinh lực cho bản thân. Phá hủy tất cả trái tim trên bàn cờ và hấp thụ sinh lực của trái tim bị hủy.",
    manaCost: 60,
  },
  "bang-phong": {
    name: "Băng Phong",
    description:
      "Đóng băng kẻ thù trong 2 lượt, gây sát thương kẻ thù, lực sát thương bằng {0}, triệt tiêu một lượng lớn năng lượng của kẻ thù.",
    manaCost: 100,
  },
};
/**
 * Danh sách các nhân vật
 */
const CHARACTER_WITHOUT_IDS: { [key in ICharacterId]: ICharacterWithoutIdAttributes } = {
  "trang-si": {
    name: "Tráng Sĩ",
    attack: 2,
    life: 100,
    intelligence: 60,
    skills: ["qua-cau-lua", "mua-thien-thach", "lua-dia-nguc"],
  },
  "linh-quen": { name: "Lính Quèn", attack: 1, life: 80, intelligence: 10, skills: [] },
  "cay-an-thit": { name: "Cây Ăn Thịt", attack: 3, life: 120, intelligence: 70, skills: [] },
  "nguyen-bac": { name: "Nguyễn Bặc", attack: 4.5, life: 160, intelligence: 50, skills: [] },
  "quy-ong": { name: "Quỷ Ong", attack: 5, life: 200, intelligence: 100, skills: [] },
  "linh-binh-kieu": { name: "Lính Bình Kiều", attack: 5, life: 200, intelligence: 100, skills: [] },
  "quy-lun": { name: "Quỷ Lùn", attack: 5, life: 200, intelligence: 100, skills: [] },
  "son-tac": { name: "Sơn Tặc", attack: 5, life: 200, intelligence: 100, skills: [] },
  "linh-hoi-ho": { name: "Lính Hồi Hồ", attack: 5, life: 200, intelligence: 100, skills: [] },
  "chon-tinh": { name: "Chồn Tinh", attack: 5, life: 200, intelligence: 100, skills: [] },
  "ly-khue": { name: "Lý Khuê", attack: 5, life: 200, intelligence: 100, skills: [] },
  "moc-tinh": { name: "Mộc Tinh", attack: 5, life: 200, intelligence: 100, skills: [] },
  "linh-phong-chau": { name: "Lính Phong Châu", attack: 5, life: 200, intelligence: 100, skills: [] },
  "la-duong": { name: "Lã Đường", attack: 5, life: 200, intelligence: 100, skills: [] },
  "linh-tam-dai": { name: "Lính Tam Đái", attack: 5, life: 200, intelligence: 100, skills: [] },
  "xa-tinh": { name: "Xà Tinh", attack: 5, life: 200, intelligence: 100, skills: [] },
  "tuong-do-dong": { name: "Tướng Đỗ Động", attack: 5, life: 200, intelligence: 100, skills: [] },
  "doc-nhan-tru": { name: "Độc Nhãn Trư", attack: 5, life: 200, intelligence: 100, skills: [] },
  "do-canh-thac": { name: "Đỗ Cảnh Thạc", attack: 5, life: 200, intelligence: 100, skills: [] },
  "ngo-xuong-xi": { name: "Ngô Xương Xí", attack: 5, life: 200, intelligence: 100, skills: [] },
  "nhen-tinh": { name: "Nhện Tinh", attack: 5, life: 200, intelligence: 100, skills: [] },
  "nguyen-tri-kha": { name: "Nguyễn Trí Khả", attack: 5, life: 200, intelligence: 100, skills: [] },
  "ngo-nhat-khanh": { name: "Ngô Nhật Khánh", attack: 5, life: 200, intelligence: 100, skills: [] },
  "sau-quy": { name: "Sâu Quỷ", attack: 5, life: 200, intelligence: 100, skills: [] },
  "kieu-thuan": { name: "Kiều Thuận", attack: 15, life: 1000, intelligence: 100, skills: [] },
  "kieu-cong-han": { name: "Kiều Công Hãn", attack: 15, life: 1000, intelligence: 100, skills: [] },
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

export const MAP_POINTS: IMapPoint[] = [
  { x: 66, y: 48 },
  { x: 97, y: 115 },
  { x: 180, y: 157 },
  { x: 288, y: 128 },
  { x: 398, y: 119 },
  { x: 426, y: 174 },
  { x: 341, y: 213 },
  { x: 320, y: 244, hidden: true },
  { x: 355, y: 272 },
  { x: 410, y: 300, hidden: true },
  { x: 395, y: 337 },
  { x: 282, y: 331 },
  { x: 182, y: 283 },
  { x: 79, y: 278 },
  { x: 55, y: 362 },
  { x: 139, y: 401 },
  { x: 246, y: 425 },
  { x: 338, y: 425 },
  { x: 378, y: 458, hidden: true },
  { x: 348, y: 500 },
  { x: 246, y: 522 },
  { x: 116, y: 536 },
  { x: 62, y: 591 },
  { x: 118, y: 637 },
  { x: 223, y: 633 },
  { x: 310, y: 611 },
  { x: 407, y: 622 },
  { x: 416, y: 685 },
  { x: 331, y: 718 },
  { x: 228, y: 714 },
  { x: 116, y: 722 },
];

export const MAP_VISIBLE_POINTS = MAP_POINTS.filter((x) => !x.hidden);
export const CYCLE_POINTS = MAP_POINTS.length;
export const CYCLE_VISIBLE_POINTS = MAP_VISIBLE_POINTS.length;
export const CYCLE_HEIGHT = MAP_POINTS[MAP_POINTS.length - 1].y;

const COUNT_ENEMIES = ENEMIES.length;
const COUNT_POINTS = 5000;
const CYCLES = Math.floor(COUNT_POINTS / CYCLE_VISIBLE_POINTS);

export const MAP: IMapPointAvatar[] = [];

let enemyIndex = 0;

for (let i = 0; i < CYCLES; i += 1) {
  MAP.push(
    ...MAP_POINTS.map((p) => {
      const ret = { ...p, y: p.y + CYCLE_HEIGHT * i, avatar: enemyIndex };
      if (!p.hidden) {
        enemyIndex += 1;
        if (enemyIndex === COUNT_ENEMIES) enemyIndex = 0;
      }
      return ret;
    })
  );
}

let currentCount = CYCLES * CYCLE_VISIBLE_POINTS;
let i = 0;
while (currentCount < COUNT_POINTS) {
  const p = MAP_POINTS[i];
  i += 1;
  MAP.push({ ...p, avatar: enemyIndex });
  if (!p.hidden) {
    currentCount += 1;
    enemyIndex += 1;
    if (enemyIndex === COUNT_ENEMIES) enemyIndex = 0;
  }
}
