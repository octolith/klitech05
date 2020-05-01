import { TileState } from "./tile";
export interface SaveData {
    playerOne: PlayerInfo;
    playerTwo: PlayerInfo;
    current: 'player-one' | 'player-two';
    x: number;
    y: number;
    tileStates: TileState[][];
}
export interface PlayerInfo {
    name: string;
    id: number;
    gamesWon: number;
}
