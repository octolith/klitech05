import * as $ from "jquery";
import { Tile, TileState } from "./tile";
import { Player } from './player';
import { SaveData } from "./save-data";
export class GameBoard {
    readonly x = 10;
    readonly y = 10;
    board: Tile[][];
    playerOne = new Player('Player one', 1);
    playerTwo = new Player('Player two', 2);
    currentPlayer: Player;
    winner: Player;
    steps: number;
    constructor(public tableElement: JQuery) {
        this.startGame();
    }
    initializeBoard(tableElement: JQuery, board: Tile[][]) {
        tableElement.children().remove();
        let tBody = $("<tbody></tbody>");
        tableElement.append(tBody);
        console.log(tableElement.children());
        for (let i = 0; i < this.y; i++) {
            var rowTiles: Tile[] = [];
            let row = $("<tr></tr>");
            tBody.append(row);
            for (let j = 0; j < this.x; j++) {
                let column = $("<td></td>");
                row.append(column);
                rowTiles.push(new Tile(column));
            }
            this.board.push(rowTiles);
        }
    }
    loadState() {
        let data = <SaveData>JSON.parse(localStorage.getItem("amoeba-table"));
        if (!data)
            return false;
        if (this.x !== data.x || this.y !== data.y) {
            localStorage.removeItem("amoeba-table");
            return false;
        }
        this.initializeBoard(this.tableElement, this.board = []);
        for (let i = 0; i < data.x; i++) {
            for (let j = 0; j < data.y; j++) {
                this.board[i][j].setState(data.tileStates[i][j]);
            }
        }
        this.playerOne = data.playerOne;
        this.playerTwo = data.playerTwo;
        this.currentPlayer =
            (data.current === 'player-one') ? this.playerOne : this.playerTwo;
        this.steps = data.steps;
        $(".player-one-name").text(this.playerOne.name);
        $(".player-two-name").text(this.playerTwo.name);
        $(".player-one-won-rounds").text(this.playerOne.gamesWon);
        $(".player-two-won-rounds").text(this.playerTwo.gamesWon);
        $(".step-number").text(this.steps);
        return true;
    }
    saveState() {
        localStorage.setItem("amoeba-table", JSON.stringify(<SaveData>{
            playerOne: this.playerOne,
            playerTwo: this.playerTwo,
            current: (this.currentPlayer === this.playerOne) ? 'player-one' : 'player-two',
            x: this.x,
            y: this.y,
            steps: this.steps,
            tileStates: this.board.map(row => row.map(tile => tile.state))
        }));
    }
    startGame() {
        if (!this.loadState()) {
            this.initializeBoard(this.tableElement, this.board = []);
            this.currentPlayer =
                this.winner === this.playerOne ? this.playerTwo : this.playerOne;
            this.steps = 0;
            $(".player-one-name").text(this.playerOne.name);
            $(".player-two-name").text(this.playerTwo.name);
            $(".player-one-won-rounds").text(this.playerOne.gamesWon);
            $(".player-two-won-rounds").text(this.playerTwo.gamesWon);
            $(".step-number").text(this.steps);
        }
        this.registerHandlers(this.board);
    }
    onTileClicked(tile: Tile) {
        if (tile.state === TileState.Empty && this.winner === undefined) {
            if (this.currentPlayer === this.playerOne) {
                tile.setState(TileState.X);
                this.currentPlayer = this.playerTwo;
            } else if (this.currentPlayer === this.playerTwo) {
                tile.setState(TileState.O);
                this.currentPlayer = this.playerOne;
            }
            this.checkWinner();
            this.steps++;
            $(".step-number").text(this.steps);
            this.saveState();
        }
    }
    checkWinner() {
        var points = 0;
        for (let fun of [
            (i: number, j: number) => this.board[i][j],
            (i: number, j: number) => this.board[j][i]
        ]) {
            for (let i = 0; i < this.x; i++) {
                let state = TileState.Empty;
                points = 1;
                for (let j = 0; j < this.y; j++) {
                    let tile = fun(i, j);
                    console.log(`${i}, ${j}, ${tile.state}, ${state}, ${points}`);
                    if (tile.state !== TileState.Empty && tile.state == state) {
                        if (++points >= 5) {
                            this.won(tile.state === TileState.X ?
                                this.playerOne : this.playerTwo);
                        }
                    } else {
                        points = 1;
                    }
                    state = tile.state;
                }
            }
        }
    }
    won(player: Player) {
        alert("Player " + player.id + " won! Congrats, " + player.name + "!");
        player.gamesWon++;
        var continueButton = $(".continue-game");
        var restartButton = $(".restart-current-game");
        restartButton.attr("disabled", "disabled");
        continueButton.removeAttr("disabled").click(() => {
            continueButton.attr("disabled", "disabled");
            this.winner = undefined;
            restartButton.removeAttr("disabled");
            this.onRestartButtonClicked();
        });
        this.winner = player;
    }
    registerHandlers(board: Tile[][]) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let tile = board[i][j];
                tile.element.click(() => this.onTileClicked(tile));
            }
        }
        var restartButton = $(".restart-current-game");
        restartButton.click(() => this.onRestartButtonClicked());
        var clearButton = $(".clear-results");
        clearButton.click(() => this.onClearButtonClicked());
        var playerOneField = $(".player-one-name");
        playerOneField.dblclick(() => this.onPlayerDoubleClicked(this.playerOne));
        var playerTwoField = $(".player-two-name");
        playerTwoField.dblclick(() => this.onPlayerDoubleClicked(this.playerTwo));
    }    
    onRestartButtonClicked() {
        this.initializeBoard(this.tableElement, this.board = []);
        this.currentPlayer =
            this.winner === this.playerOne ? this.playerTwo : this.playerOne;
        this.winner = undefined;
        this.steps = 0;
        this.registerHandlers(this.board);
        this.saveState();
        this.startGame();
    }
    onClearButtonClicked() {
        this.initializeBoard(this.tableElement, this.board = []);
        this.playerOne.gamesWon = 0;
        this.playerTwo.gamesWon = 0;
        this.currentPlayer = this.playerOne;
        this.winner = undefined;
        this.steps = 0;
        this.registerHandlers(this.board);
        this.saveState();
        this.startGame();
    }
    onPlayerDoubleClicked(player: Player) {
        player.name = "Sikerült";
        if(player === this.playerOne) {
            var playerOneInfo = $(".player-one-info");
            playerOneInfo.children("player-one-name").remove();
            playerOneInfo.add("form").addClass("player-one-form");
            var playerOneForm = $(".player-one-form");
            playerOneForm.add("input[type='text']").addClass("player-one-input");
            var playerOneInput = $(".player-one-input");
            playerOneForm.add("input[type='submit']")
            var playerOneSubmit = $(".player-one-input");
            playerOneSubmit.click(() => this.onSubmitClick(player));
            
            //var playerOneField = $(".player-one-name");
            //playerOneField.text(player.name);
        }
        else if(player === this.playerTwo) {
            var playerTwoField = $(".player-two-name");
            playerTwoField.text(player.name);
        }
        this.saveState();
    }
    onSubmitClick(player: Player) {
        if(player === this.playerOne) {
            var playerOneInfo = $(".player-one-info");
            var playerName = $(".player-one-input").text();
            playerOneInfo.children("player-one-form").remove();
            player.name = playerName;
            playerOneInfo.add("b").addClass("player-name").addClass("player-one-name").text(playerName);
            this.saveState();
            this.registerHandlers(this.board);
        }
    }
}
