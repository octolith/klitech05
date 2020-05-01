"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var tile_1 = require("./tile");
var player_1 = require("./player");
var GameBoard = (function () {
    function GameBoard(tableElement) {
        this.tableElement = tableElement;
        this.x = 10;
        this.y = 10;
        this.playerOne = new player_1.Player('Player one', 1);
        this.playerTwo = new player_1.Player('Player two', 2);
        this.startGame();
    }
    GameBoard.prototype.initializeBoard = function (tableElement, board) {
        tableElement.children().remove();
        var tBody = $("<tbody></tbody>");
        tableElement.append(tBody);
        console.log(tableElement.children());
        for (var i = 0; i < this.y; i++) {
            var rowTiles = [];
            var row = $("<tr></tr>");
            tBody.append(row);
            for (var j = 0; j < this.x; j++) {
                var column = $("<td></td>");
                row.append(column);
                rowTiles.push(new tile_1.Tile(column));
            }
            this.board.push(rowTiles);
        }
    };
    GameBoard.prototype.loadState = function () {
        var data = JSON.parse(localStorage.getItem("amoeba-table"));
        if (!data)
            return false;
        if (this.x !== data.x || this.y !== data.y) {
            localStorage.removeItem("amoeba-table");
            return false;
        }
        this.initializeBoard(this.tableElement, this.board = []);
        for (var i = 0; i < data.x; i++) {
            for (var j = 0; j < data.y; j++) {
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
    };
    GameBoard.prototype.saveState = function () {
        localStorage.setItem("amoeba-table", JSON.stringify({
            playerOne: this.playerOne,
            playerTwo: this.playerTwo,
            current: (this.currentPlayer === this.playerOne) ? 'player-one' : 'player-two',
            x: this.x,
            y: this.y,
            steps: this.steps,
            tileStates: this.board.map(function (row) { return row.map(function (tile) { return tile.state; }); })
        }));
    };
    GameBoard.prototype.startGame = function () {
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
    };
    GameBoard.prototype.onTileClicked = function (tile) {
        if (tile.state === tile_1.TileState.Empty && this.winner === undefined) {
            if (this.currentPlayer === this.playerOne) {
                tile.setState(tile_1.TileState.X);
                this.currentPlayer = this.playerTwo;
            }
            else if (this.currentPlayer === this.playerTwo) {
                tile.setState(tile_1.TileState.O);
                this.currentPlayer = this.playerOne;
            }
            this.checkWinner();
            this.steps++;
            $(".step-number").text(this.steps);
            this.saveState();
        }
    };
    GameBoard.prototype.checkWinner = function () {
        var _this = this;
        var points = 0;
        for (var _i = 0, _a = [
            function (i, j) { return _this.board[i][j]; },
            function (i, j) { return _this.board[j][i]; }
        ]; _i < _a.length; _i++) {
            var fun = _a[_i];
            for (var i = 0; i < this.x; i++) {
                var state = tile_1.TileState.Empty;
                points = 1;
                for (var j = 0; j < this.y; j++) {
                    var tile = fun(i, j);
                    console.log(i + ", " + j + ", " + tile.state + ", " + state + ", " + points);
                    if (tile.state !== tile_1.TileState.Empty && tile.state == state) {
                        if (++points >= 5) {
                            this.won(tile.state === tile_1.TileState.X ?
                                this.playerOne : this.playerTwo);
                        }
                    }
                    else {
                        points = 1;
                    }
                    state = tile.state;
                }
            }
        }
    };
    GameBoard.prototype.won = function (player) {
        var _this = this;
        alert("Player " + player.id + " won! Congrats, " + player.name + "!");
        player.gamesWon++;
        var continueButton = $(".continue-game");
        var restartButton = $(".restart-current-game");
        restartButton.attr("disabled", "disabled");
        continueButton.removeAttr("disabled").click(function () {
            continueButton.attr("disabled", "disabled");
            _this.winner = undefined;
            restartButton.removeAttr("disabled");
            _this.onRestartButtonClicked();
        });
        this.winner = player;
    };
    GameBoard.prototype.registerHandlers = function (board) {
        var _this = this;
        for (var i = 0; i < board.length; i++) {
            var _loop_1 = function (j) {
                var tile = board[i][j];
                tile.element.click(function () { return _this.onTileClicked(tile); });
            };
            for (var j = 0; j < board[i].length; j++) {
                _loop_1(j);
            }
        }
        var restartButton = $(".restart-current-game");
        restartButton.click(function () { return _this.onRestartButtonClicked(); });
        var clearButton = $(".clear-results");
        clearButton.click(function () { return _this.onClearButtonClicked(); });
        var playerOneField = $(".player-one-name");
        playerOneField.dblclick(function () { return _this.onPlayerDoubleClicked(_this.playerOne); });
        var playerTwoField = $(".player-two-name");
        playerTwoField.dblclick(function () { return _this.onPlayerDoubleClicked(_this.playerTwo); });
    };
    GameBoard.prototype.onRestartButtonClicked = function () {
        this.initializeBoard(this.tableElement, this.board = []);
        this.currentPlayer =
            this.winner === this.playerOne ? this.playerTwo : this.playerOne;
        this.winner = undefined;
        this.steps = 0;
        this.registerHandlers(this.board);
        this.saveState();
        this.startGame();
    };
    GameBoard.prototype.onClearButtonClicked = function () {
        this.initializeBoard(this.tableElement, this.board = []);
        this.playerOne.gamesWon = 0;
        this.playerTwo.gamesWon = 0;
        this.currentPlayer = this.playerOne;
        this.winner = undefined;
        this.steps = 0;
        this.registerHandlers(this.board);
        this.saveState();
        this.startGame();
    };
    GameBoard.prototype.onPlayerDoubleClicked = function (player) {
        if (player === this.playerOne) {
            var playerOneName = $(".player-one-name");
            var content = "<input type='text' class='form-control player-one-name-input' value='" + player.name + "' />" +
                "<button type='button' class='player-one-name-button btn btn-success'>OK</button>";
            playerOneName.html(content);
            var playerOneNameButton = $(".player-one-name-button");
            playerOneNameButton.click(function () {
                player.name = $(".player-one-name-input").val().toString();
                var newContent = "<b class='player-name player-one-name'>" + player.name + "</b>";
                playerOneName.html(newContent);
            });
        }
        else if (player === this.playerTwo) {
            var playerTwoName = $(".player-two-name");
            var content = "<input type='text' class='form-control player-two-name-input' value='" + player.name + "' />" +
                "<button type='button' class='player-two-name-button btn btn-success'>OK</button>";
            playerTwoName.html(content);
            var playerTwoNameButton = $(".player-two-name-button");
            playerTwoNameButton.click(function () {
                player.name = $(".player-two-name-input").val().toString();
                var newContent = "<b class='player-name player-two-name'>" + player.name + "</b>";
                playerTwoName.html(newContent);
            });
        }
        this.registerHandlers(this.board);
        this.saveState();
    };
    return GameBoard;
}());
exports.GameBoard = GameBoard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1ib2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdhbWUtYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQkFBNEI7QUFDNUIsK0JBQXlDO0FBQ3pDLG1DQUFrQztBQUVsQztJQVNJLG1CQUFtQixZQUFvQjtRQUFwQixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQVI5QixNQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1AsTUFBQyxHQUFHLEVBQUUsQ0FBQztRQUVoQixjQUFTLEdBQUcsSUFBSSxlQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLGNBQVMsR0FBRyxJQUFJLGVBQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFLcEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxtQ0FBZSxHQUFmLFVBQWdCLFlBQW9CLEVBQUUsS0FBZTtRQUNqRCxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDakMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlCLElBQUksUUFBUSxHQUFXLEVBQUUsQ0FBQztZQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElB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