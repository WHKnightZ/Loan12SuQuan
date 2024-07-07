import { IGame, ISelectItemsGameState } from "@/types";
import { GameState } from "./gameState";
import { BOARD_SIZE, base } from "@/configs/consts";
import { selectItemsFrameTexture } from "@/textures";

/**
 * State chọn vật phẩm, kỹ năng
 */
export class SelectItemsGameState extends GameState implements ISelectItemsGameState {
  constructor(game: IGame) {
    super("SELECT_ITEMS", game);
  }

  render() {
    base.context.drawImage(
      selectItemsFrameTexture,
      (BOARD_SIZE - selectItemsFrameTexture.width) / 2,
      (BOARD_SIZE - selectItemsFrameTexture.height) / 2 - 2
    );
  }

  update() {}
}
