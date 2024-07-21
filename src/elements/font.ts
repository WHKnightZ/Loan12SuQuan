import { base, BOARD_CENTER, BOARD_SIZE, FONT_SCALE, getKeys, SCREEN_WIDTH_HALF } from "@/configs/consts";
import { fontTextures } from "@/textures";
import { IFontFamily } from "@/types";

type IFontProperties = {
  chars: string;
  xList: number[];
  yList: number[];
  widthList: number[];
  heightList: number[];
  offsetXList: number[];
  offsetYList: number[];
  letterSpacing: number;
  isUpperCase: boolean;
};

type IFontChar = { x: number; y: number; width: number; height: number; offsetX: number; offsetY: number };

type IMappingChar = {
  [key: string]: IFontChar;
};

type IMappingFont = {
  [key in IFontFamily]: {
    mappingChar: IMappingChar;
    letterSpacing: number;
    isUpperCase: boolean;
  };
};

const fonts: { [key in IFontFamily]: IFontProperties } = {
  CAP_WHITE: {
    chars:
      ' 0123456789.,:!?()+-*/#$%"@<=>;_&ABCD\u0110EFGHIJKLMNOPQRSTUVWXYZ\u00c1\u00c0\u1ea2\u00c3\u1ea0\u0102\u1eae\u1eb0\u1eb2\u1eb4\u1eb6\u00c2\u1ea4\u1ea6\u1ea8\u1eaa\u1eac\u00c9\u00c8\u1eba\u1ebc\u1eb8\u00ca\u1ebe\u1ec0\u1ec2\u1ec4\u1ec6\u00cd\u00cc\u1ec8\u0128\u1eca\u00d3\u00d2\u1ece\u00d5\u1ecc\u00d4\u1ed0\u1ed2\u1ed4\u1ed6\u1ed8\u01a0\u1eda\u1edc\u1ede\u1ee0\u1ee2\u00da\u00d9\u1ee6\u0168\u1ee4\u01af\u1ee8\u1eea\u1eec\u1eee\u1ef0\u00dd\u1ef2\u1ef6\u1ef8\u1ef4',
    xList: [
      0, 2, 10, 16, 24, 32, 40, 48, 56, 64, 72, 80, 84, 88, 92, 80, 0, 6, 12, 87, 19, 26, 32, 41, 49, 62, 67, 92, 78,
      12, 96, 86, 32, 49, 58, 66, 74, 83, 41, 92, 0, 20, 8, 14, 29, 48, 55, 65, 37, 73, 81, 90, 0, 20, 7, 28, 46, 57,
      65, 36, 90, 15, 73, 0, 24, 43, 52, 61, 33, 82, 91, 9, 70, 0, 18, 42, 51, 60, 28, 35, 79, 9, 67, 86, 93, 0, 16, 42,
      60, 23, 29, 35, 49, 74, 83, 0, 9, 49, 58, 18, 27, 36, 67, 76, 85, 0, 46, 11, 22, 33, 92, 57, 85, 65, 73, 0, 44,
      33, 54, 10, 20, 81, 89, 64, 72, 0,
    ],
    yList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 9, 9, 9, 7, 9, 9, 9, 9, 9, 9, 9, 9, 15, 16, 0, 17, 18, 18, 18, 19,
      20, 20, 20, 20, 21, 21, 24, 24, 27, 27, 27, 28, 29, 29, 29, 29, 30, 30, 33, 36, 36, 36, 37, 38, 38, 39, 40, 42,
      45, 45, 45, 46, 47, 50, 50, 51, 52, 54, 56, 57, 57, 58, 59, 59, 62, 63, 64, 64, 64, 66, 68, 69, 70, 71, 71, 71,
      71, 74, 76, 78, 80, 82, 82, 83, 83, 83, 86, 88, 88, 92, 93, 95, 95, 95, 76, 94, 97, 98, 102, 104, 105, 106, 106,
      107, 107, 109, 109, 110, 113, 114,
    ],
    widthList: [
      2, 8, 6, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 7, 6, 6, 7, 5, 7, 6, 9, 8, 13, 5, 11, 8, 8, 8, 4, 8, 9, 9, 8, 8, 9,
      9, 7, 7, 8, 9, 6, 6, 8, 7, 10, 8, 9, 8, 9, 8, 7, 8, 8, 8, 11, 8, 8, 7, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
      10, 9, 9, 7, 7, 7, 7, 7, 7, 7, 7, 9, 7, 7, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9, 10, 9, 9, 11, 11, 11, 11, 11,
      11, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8,
    ],
    heightList: [
      1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 6, 7, 9, 9, 12, 12, 7, 3, 7, 12, 9, 11, 9, 5, 10, 8, 5, 8, 9, 3, 9, 9, 9, 9,
      9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 11, 9, 9, 9, 9, 9, 9, 9, 9, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12,
      14, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11,
      12, 12, 12, 12, 12, 14, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11,
    ],
    offsetXList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    offsetYList: [
      11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 8, 5, 3, 3, 2, 2, 4, 6, 2, 2, 3, 2, 3, 2, 3, 4, 5, 4, 5, 11, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0,
      0, 3, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3,
    ],
    letterSpacing: 2,
    isUpperCase: true,
  },
  CAP_YELLOW: {
    chars:
      ' 0123456789.,:!?()+-*/#$%"@<=>;_&ABCD\u0110EFGHIJKLMNOPQRSTUVWXYZ\u00c1\u00c0\u1ea2\u00c3\u1ea0\u0102\u1eae\u1eb0\u1eb2\u1eb4\u1eb6\u00c2\u1ea4\u1ea6\u1ea8\u1eaa\u1eac\u00c9\u00c8\u1eba\u1ebc\u1eb8\u00ca\u1ebe\u1ec0\u1ec2\u1ec4\u1ec6\u00cd\u00cc\u1ec8\u0128\u1eca\u00d3\u00d2\u1ece\u00d5\u1ecc\u00d4\u1ed0\u1ed2\u1ed4\u1ed6\u1ed8\u01a0\u1eda\u1edc\u1ede\u1ee0\u1ee2\u00da\u00d9\u1ee6\u0168\u1ee4\u01af\u1ee8\u1eea\u1eec\u1eee\u1ef0\u00dd\u1ef2\u1ef6\u1ef8\u1ef4',
    xList: [
      0, 2, 10, 16, 24, 32, 40, 48, 56, 64, 72, 80, 84, 88, 92, 80, 0, 6, 12, 87, 19, 26, 32, 41, 49, 62, 67, 92, 78,
      12, 96, 86, 32, 49, 58, 66, 74, 83, 41, 92, 0, 20, 8, 14, 29, 48, 55, 65, 37, 73, 81, 90, 0, 20, 7, 28, 46, 57,
      65, 36, 90, 15, 73, 0, 24, 43, 52, 61, 33, 82, 91, 9, 70, 0, 18, 42, 51, 60, 28, 35, 79, 9, 67, 86, 93, 0, 16, 42,
      60, 23, 29, 35, 49, 74, 83, 0, 9, 49, 58, 18, 27, 36, 67, 76, 85, 0, 46, 11, 22, 33, 92, 57, 85, 65, 73, 0, 44,
      33, 54, 10, 20, 81, 89, 64, 72, 0,
    ],
    yList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 9, 9, 9, 7, 9, 9, 9, 9, 9, 9, 9, 9, 15, 16, 0, 17, 18, 18, 18, 19,
      20, 20, 20, 20, 21, 21, 24, 24, 27, 27, 27, 28, 29, 29, 29, 29, 30, 30, 33, 36, 36, 36, 37, 38, 38, 39, 40, 42,
      45, 45, 45, 46, 47, 50, 50, 51, 52, 54, 56, 57, 57, 58, 59, 59, 62, 63, 64, 64, 64, 66, 68, 69, 70, 71, 71, 71,
      71, 74, 76, 78, 80, 82, 82, 83, 83, 83, 86, 88, 88, 92, 93, 95, 95, 95, 76, 94, 97, 98, 102, 104, 105, 106, 106,
      107, 107, 109, 109, 110, 113, 114,
    ],
    widthList: [
      2, 8, 6, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 7, 6, 6, 7, 5, 7, 6, 9, 8, 13, 5, 11, 8, 8, 8, 4, 8, 9, 9, 8, 8, 9,
      9, 7, 7, 8, 9, 6, 6, 8, 7, 10, 8, 9, 8, 9, 8, 7, 8, 8, 8, 11, 8, 8, 7, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
      10, 9, 9, 7, 7, 7, 7, 7, 7, 7, 7, 9, 7, 7, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9, 10, 9, 9, 11, 11, 11, 11, 11,
      11, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8,
    ],
    heightList: [
      1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 6, 7, 9, 9, 12, 12, 7, 3, 7, 12, 9, 11, 9, 5, 10, 8, 5, 8, 9, 3, 9, 9, 9, 9,
      9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 11, 9, 9, 9, 9, 9, 9, 9, 9, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12,
      14, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11,
      12, 12, 12, 12, 12, 14, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11,
    ],
    offsetXList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    offsetYList: [
      11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 8, 5, 3, 3, 2, 2, 4, 6, 2, 2, 3, 2, 3, 2, 3, 4, 5, 4, 5, 11, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0,
      0, 3, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3,
    ],
    letterSpacing: 2,
    isUpperCase: true,
  },
  ARIAL: {
    chars:
      " 0123456789.,:!?()+-*/#$%abcdefghijklmnopqrstuvwxyzáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđABCDEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẶĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ",
    xList: [
      0, 2, 7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 51, 52, 53, 54, 59, 62, 65, 70, 73, 78, 81, 88, 93, 102, 107, 112,
      116, 121, 126, 130, 135, 140, 141, 143, 148, 149, 158, 163, 168, 173, 178, 181, 186, 189, 194, 199, 208, 213, 218,
      223, 228, 233, 238, 243, 248, 253, 258, 263, 268, 273, 278, 283, 288, 293, 298, 303, 308, 313, 318, 323, 328, 333,
      338, 343, 348, 353, 358, 363, 365, 367, 370, 374, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 436,
      442, 448, 454, 460, 466, 471, 476, 481, 486, 491, 498, 505, 512, 519, 526, 533, 538, 543, 548, 553, 558, 564, 571,
      577, 584, 591, 597, 602, 609, 616, 617, 622, 629, 635, 642, 649, 656, 662, 669, 676, 682, 689, 696, 703, 714, 721,
      728, 735, 742, 749, 756, 763, 770, 777, 784, 791, 798, 805, 812, 819, 826, 833, 840, 847, 854, 860, 866, 872, 878,
      884, 890, 896, 902, 908, 914, 920, 922, 924, 927, 931, 932, 939, 946, 953, 960, 967, 974, 981, 988, 995, 1002,
      1009, 1017, 1025, 1033, 1041, 1049, 1057, 1064, 1071, 1078, 1085, 1092, 1101, 1110, 1119, 1128, 1137, 1146, 1153,
      1160, 1167, 1174, 1181,
    ],
    yList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    widthList: [
      2, 5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 5, 3, 3, 5, 3, 5, 3, 7, 5, 9, 5, 5, 4, 5, 5, 4, 5, 5, 1, 2, 5, 1, 9,
      5, 5, 5, 5, 3, 5, 3, 5, 5, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 2, 2, 3, 4, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 5, 5,
      5, 5, 5, 6, 7, 6, 7, 7, 6, 5, 7, 7, 1, 5, 7, 6, 7, 7, 7, 6, 7, 7, 6, 7, 7, 7, 11, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
      7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 3, 4, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8,
      8, 8, 8, 8, 7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9, 7, 7, 7, 7, 7, 8,
    ],
    heightList: [
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
      14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
    ],
    offsetXList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    offsetYList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    isUpperCase: false,
    letterSpacing: 2,
  },
  BLACK: {
    chars:
      " 0123456789.,:!?()+-*/#$%abcdefghijklmnopqrstuvwxyzáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđABCDĐEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ\\\"@<=>;_&'`^~{}[]",
    xList: [
      0, 2, 8, 13, 19, 25, 31, 37, 43, 49, 55, 61, 62, 64, 65, 66, 71, 74, 77, 84, 87, 92, 96, 103, 108, 119, 124, 130,
      84, 77, 61, 0, 6, 90, 119, 130, 91, 12, 21, 27, 33, 39, 45, 48, 52, 65, 56, 108, 96, 122, 71, 101, 75, 80, 85, 90,
      12, 17, 22, 27, 45, 56, 65, 95, 106, 111, 127, 0, 32, 38, 50, 5, 118, 70, 76, 82, 88, 11, 61, 132, 124, 101, 95,
      134, 103, 109, 17, 23, 29, 35, 41, 47, 53, 115, 5, 121, 128, 67, 74, 81, 88, 95, 101, 29, 107, 121, 11, 19, 35,
      43, 51, 59, 0, 127, 113, 5, 0, 67, 74, 81, 87, 93, 100, 118, 10, 27, 15, 61, 107, 34, 22, 40, 48, 55, 124, 0, 111,
      63, 69, 76, 83, 90, 101, 117, 8, 27, 14, 34, 41, 48, 55, 124, 107, 62, 69, 76, 0, 83, 90, 97, 114, 7, 21, 27, 14,
      20, 33, 39, 45, 51, 121, 128, 104, 132, 131, 57, 60, 110, 65, 83, 91, 113, 73, 0, 26, 8, 16, 34, 42, 50, 121, 59,
      99, 68, 77, 86, 108, 0, 24, 50, 7, 31, 40, 115, 124, 57, 16, 77, 93, 100, 66, 130, 70, 0, 93, 0, 115, 99, 60, 84,
      0, 84, 107, 49, 10, 23, 73, 109,
    ],
    yList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 7, 7, 9, 9, 5, 7, 7, 5, 9,
      9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 12, 12, 14, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 18, 18,
      18, 18, 19, 19, 24, 25, 25, 25, 26, 26, 17, 19, 22, 26, 17, 26, 27, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29,
      34, 35, 35, 36, 36, 36, 37, 37, 37, 38, 38, 38, 38, 39, 39, 30, 39, 40, 41, 42, 44, 45, 45, 46, 46, 46, 46, 47,
      47, 48, 17, 47, 48, 48, 48, 49, 50, 51, 53, 52, 54, 54, 54, 55, 55, 55, 55, 56, 56, 57, 57, 57, 58, 59, 60, 61,
      63, 63, 63, 64, 64, 64, 64, 64, 65, 57, 68, 69, 69, 69, 69, 69, 71, 72, 72, 73, 39, 51, 71, 75, 73, 75, 76, 76,
      76, 77, 79, 80, 81, 81, 81, 81, 83, 84, 87, 87, 88, 88, 88, 88, 91, 92, 92, 93, 93, 95, 96, 96, 99, 93, 99, 99,
      99, 100, 84, 19, 104, 88, 76, 88, 26, 38, 100, 1, 1, 100, 103, 104, 104, 104, 104,
    ],
    widthList: [
      2, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 1, 2, 1, 1, 5, 3, 3, 7, 3, 5, 4, 7, 5, 11, 5, 6, 5, 6, 6, 4, 6, 6, 1, 3, 5, 1, 9,
      6, 6, 6, 6, 3, 4, 4, 6, 5, 9, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 7, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6,
      7, 6, 6, 2, 2, 2, 4, 1, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 5, 5,
      5, 5, 5, 7, 7, 6, 6, 7, 7, 6, 5, 7, 7, 3, 4, 6, 5, 8, 7, 8, 6, 8, 6, 6, 7, 7, 7, 11, 6, 7, 6, 7, 7, 7, 7, 7, 7, 7,
      7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 3, 3, 3, 5, 3, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9,
      9, 9, 9, 9, 9, 7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9, 7, 7, 7, 7, 7, 4, 4, 10, 6, 6, 6, 2, 7, 7, 1, 2, 7, 7, 5, 5, 3, 3,
    ],
    heightList: [
      1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 4, 7, 9, 9, 12, 12, 7, 1, 5, 12, 9, 12, 9, 7, 10, 7, 10, 7, 10, 9, 10, 9, 11,
      10, 10, 7, 7, 7, 9, 9, 7, 7, 9, 7, 7, 7, 7, 9, 7, 10, 10, 10, 10, 9, 10, 12, 12, 12, 12, 12, 10, 10, 10, 11, 12,
      12, 10, 10, 10, 10, 9, 10, 10, 10, 11, 12, 12, 10, 10, 10, 10, 11, 10, 10, 10, 10, 9, 10, 10, 10, 11, 12, 12, 8,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 10, 10, 10, 10, 11, 12, 12, 12, 12, 9, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
      9, 9, 9, 9, 9, 9, 9, 11, 9, 9, 9, 9, 9, 9, 9, 9, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12,
      12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12,
      14, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11, 11, 12, 12, 12, 12, 13, 12, 12, 12, 12, 11, 12, 4, 10, 7, 3, 7, 9,
      1, 9, 3, 2, 4, 3, 12, 12, 12, 12,
    ],
    offsetXList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    offsetYList: [
      11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 10, 10, 5, 3, 3, 2, 2, 5, 8, 2, 2, 3, 2, 3, 5, 2, 5, 2, 5, 2, 5, 2, 3, 3, 2, 2,
      5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 5, 2, 0, 0, 0, 0, 2, 2, 2, 2, 1, 0, 2, 2, 2, 2, 2, 5, 2, 2,
      2, 1, 0, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 5, 2, 2, 2, 1, 0, 2, 4, 2, 2, 2, 2, 4, 2, 2, 2, 2, 5, 3, 2, 2, 2, 2, 3, 2,
      2, 2, 2, 5, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
      3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 1, 2, 3, 5, 6, 5, 5, 13, 3, 2, 2, 3, 7, 2, 2, 2,
      2,
    ],
    isUpperCase: false,
    letterSpacing: 2,
  },
  VERDANA: {
    chars:
      " 0123456789.,:!?()+-*/#$%abcdefghijklmnopqrstuvwxyzáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđABCDĐEFGHIJKLMNOPQRSTUVWXYZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ\\\"@<=>;_&'`^~{}[]",
    xList: [
      0, 9, 16, 23, 30, 37, 45, 52, 59, 66, 73, 80, 83, 87, 90, 93, 99, 104, 109, 118, 123, 130, 137, 0, 118, 80, 109,
      7, 14, 21, 28, 34, 41, 146, 48, 53, 87, 60, 71, 90, 137, 130, 144, 97, 103, 0, 78, 116, 7, 21, 60, 66, 90, 34,
      109, 137, 14, 41, 53, 0, 73, 80, 125, 97, 116, 21, 7, 60, 87, 132, 139, 30, 105, 14, 37, 45, 52, 123, 94, 144, 67,
      146, 0, 112, 71, 78, 115, 6, 21, 85, 101, 130, 137, 28, 60, 13, 35, 43, 51, 67, 75, 108, 122, 92, 115, 0, 83, 7,
      16, 99, 129, 138, 25, 32, 39, 59, 108, 46, 66, 74, 115, 82, 0, 92, 10, 99, 17, 48, 124, 130, 138, 46, 66, 25, 108,
      34, 74, 55, 115, 91, 82, 0, 11, 99, 124, 132, 140, 43, 63, 71, 19, 51, 90, 108, 116, 27, 35, 79, 0, 8, 98, 124,
      132, 139, 71, 43, 59, 17, 50, 87, 106, 114, 35, 66, 78, 24, 0, 145, 7, 94, 121, 130, 139, 58, 67, 42, 83, 103,
      112, 16, 26, 0, 92, 139, 121, 131, 51, 59, 67, 75, 36, 102, 10, 20, 0, 83, 112, 93, 121, 139, 130, 51, 125, 30,
      40, 83, 75, 30, 48, 57, 87, 118, 66, 102, 10, 48, 29, 111,
    ],
    yList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 6, 9, 10, 10, 10, 10, 10, 10, 0, 10,
      10, 8, 10, 10, 10, 10, 12, 11, 13, 13, 14, 14, 17, 18, 18, 18, 18, 18, 20, 20, 20, 21, 21, 21, 22, 22, 22, 22, 23,
      25, 28, 26, 29, 29, 30, 30, 31, 31, 32, 33, 33, 33, 33, 34, 19, 29, 30, 35, 31, 35, 35, 36, 39, 40, 40, 41, 41,
      41, 42, 42, 43, 44, 44, 45, 46, 46, 44, 46, 47, 47, 50, 51, 52, 52, 52, 53, 53, 55, 55, 55, 55, 55, 56, 57, 57,
      58, 60, 63, 58, 63, 63, 63, 23, 64, 64, 64, 67, 67, 68, 65, 68, 67, 68, 68, 68, 70, 73, 73, 73, 74, 74, 74, 77,
      77, 77, 78, 78, 78, 78, 78, 80, 80, 80, 83, 83, 83, 84, 87, 87, 89, 90, 90, 91, 91, 91, 91, 91, 93, 90, 93, 95,
      96, 41, 96, 96, 99, 100, 100, 103, 103, 104, 104, 104, 104, 108, 108, 109, 109, 112, 113, 113, 116, 116, 116, 116,
      117, 117, 118, 121, 122, 122, 119, 122, 125, 125, 126, 104, 17, 128, 128, 117, 128, 21, 129, 129, 19, 3, 129, 130,
      131, 132, 95, 132,
    ],
    widthList: [
      2, 7, 7, 7, 7, 8, 7, 7, 7, 7, 7, 3, 4, 3, 3, 6, 5, 5, 9, 5, 7, 7, 9, 7, 12, 7, 7, 7, 7, 7, 6, 7, 7, 3, 5, 7, 3,
      11, 7, 7, 7, 7, 6, 6, 6, 7, 7, 9, 7, 7, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 9, 7, 7, 7, 7, 7, 7, 7, 7, 8,
      7, 8, 7, 7, 4, 4, 4, 6, 3, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9, 7,
      7, 7, 7, 7, 8, 8, 8, 9, 9, 10, 7, 7, 9, 8, 5, 6, 8, 7, 9, 8, 9, 7, 9, 8, 8, 9, 8, 8, 11, 8, 9, 8, 8, 8, 8, 8, 8,
      8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 8, 8, 7, 7, 7, 7, 7, 7, 8, 7, 8, 7, 7, 5, 5, 5, 7, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
      9, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 9, 9, 9, 9, 9, 7, 5, 10, 8, 9, 8, 4, 9, 9, 3, 4,
      9, 9, 7, 7, 5, 5,
    ],
    heightList: [
      1, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 6, 8, 10, 10, 13, 13, 9, 3, 7, 12, 10, 13, 10, 8, 11, 8, 11, 8, 11,
      10, 11, 11, 13, 11, 11, 8, 8, 8, 10, 10, 8, 8, 10, 8, 8, 8, 8, 10, 8, 11, 11, 11, 11, 10, 11, 12, 12, 13, 13, 13,
      11, 11, 11, 12, 13, 13, 11, 11, 11, 11, 10, 11, 11, 11, 12, 13, 13, 11, 11, 11, 11, 13, 11, 11, 11, 11, 10, 11,
      11, 11, 12, 13, 13, 9, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10, 9, 11, 11, 11, 11, 11, 13, 13, 13, 13, 10, 11, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12, 10, 10, 10, 10, 10, 10, 10, 10, 10, 13, 13,
      13, 13, 12, 13, 13, 13, 13, 13, 15, 13, 13, 13, 13, 13, 15, 13, 13, 13, 13, 12, 13, 13, 13, 13, 13, 15, 13, 13,
      13, 13, 12, 13, 13, 13, 13, 12, 13, 13, 13, 13, 13, 15, 10, 13, 13, 13, 13, 12, 13, 13, 13, 13, 12, 11, 13, 13,
      13, 13, 13, 13, 13, 13, 13, 12, 12, 5, 11, 7, 5, 7, 10, 3, 10, 5, 4, 6, 5, 13, 13, 13, 13,
    ],
    offsetXList: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    offsetYList: [
      12, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 9, 9, 5, 3, 3, 2, 2, 4, 7, 2, 2, 3, 2, 3, 5, 2, 5, 2, 5, 2, 5, 2, 2, 2, 2, 2, 5,
      5, 5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 5, 2, 1, 1, 0, 0, 2, 2, 2, 2, 1, 0, 2, 2, 2, 2, 2, 5, 2, 2, 2,
      1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 1, 0, 2, 4, 2, 2, 2, 2, 4, 2, 2, 2, 2, 5, 4, 2, 2, 2, 2, 4, 2, 2,
      2, 2, 5, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3,
      0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 2, 2, 3, 5, 6, 5, 5, 12, 3, 2, 2, 3, 6, 2, 2, 2, 2,
    ],
    isUpperCase: false,
    letterSpacing: 2,
  },
};

export class Font {
  private static family: IFontFamily;
  private static savedFamily: IFontFamily;
  private static mappingFont: IMappingFont;

  static init() {
    this.mappingFont = {} as any;

    getKeys(fonts).forEach((key) => {
      const { chars, xList, yList, widthList, heightList, offsetXList, offsetYList, letterSpacing, isUpperCase } =
        fonts[key];
      const length = chars.length;
      const mappingChar = {} as IMappingChar;

      for (let i = 0; i < length; i += 1) {
        mappingChar[chars[i]] = {
          x: xList[i] * FONT_SCALE,
          y: yList[i] * FONT_SCALE,
          width: widthList[i] * FONT_SCALE,
          height: heightList[i] * FONT_SCALE,
          offsetX: offsetXList[i] * FONT_SCALE,
          offsetY: offsetYList[i] * FONT_SCALE,
        };
      }

      this.mappingFont[key] = {
        mappingChar,
        letterSpacing,
        isUpperCase,
      };
    });

    this.reset();
  }

  static reset() {
    this.family = this.savedFamily = "CAP_WHITE";
  }

  static save() {
    this.savedFamily = this.family;
  }

  static restore() {
    this.family = this.savedFamily;
  }

  static setFamily(family: IFontFamily) {
    this.family = family;
  }

  static draw({ text, x, y }: { text: string; x?: number; y?: number }) {
    const { mappingChar, letterSpacing, isUpperCase } = this.mappingFont[this.family];
    const texture = fontTextures[this.family];

    x = x || SCREEN_WIDTH_HALF;
    y = y || BOARD_CENTER;

    const chars: IFontChar[] = [];
    let width = 0;

    for (let i = 0; i < text.length; i += 1) {
      let c = text.charAt(i);
      if (isUpperCase) c = c.toUpperCase();
      const char = mappingChar[c];

      if (!char) continue;

      chars.push(char);
      width += char.width + letterSpacing;
    }

    x = x - Math.floor(width / 2);
    y = y - 12;
    let startX = x;
    let startY = y;

    chars.map(({ x, y, width, height, offsetX, offsetY }) => {
      base.context.drawImage(texture, x, y, width, height, startX + offsetX, startY + offsetY, width, height);
      startX += width + letterSpacing;
    });
  }
}
