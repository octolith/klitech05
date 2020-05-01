import { GameBoard } from './game-board';
import * as $ from 'jquery';
var board: GameBoard;
$(() => {
    board = new GameBoard($(".game-board-table"));
});
