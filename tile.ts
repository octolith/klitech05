export enum TileState { Empty = 0, X = 1, O = 2 }
export class Tile {
    state: TileState = TileState.Empty;
    constructor(public element: JQuery) { }
    setState(state: TileState) {
        if (this.state === TileState.Empty && state !== TileState.Empty) {
            this.state = state;
            if (state === TileState.X) {
                this.element.addClass("mark mark-x");
                this.element.append(
                    $("<i class='glyphicon glyphicon-record'></i>"));
            } else if (state === TileState.O) {
                this.element.addClass("mark mark-o");
                this.element.append(
                    $("<i class='glyphicon glyphicon-remove'></i>"));
            }
        }
    }
}    