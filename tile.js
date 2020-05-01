"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileState;
(function (TileState) {
    TileState[TileState["Empty"] = 0] = "Empty";
    TileState[TileState["X"] = 1] = "X";
    TileState[TileState["O"] = 2] = "O";
})(TileState = exports.TileState || (exports.TileState = {}));
var Tile = (function () {
    function Tile(element) {
        this.element = element;
        this.state = TileState.Empty;
    }
    Tile.prototype.setState = function (state) {
        if (this.state === TileState.Empty && state !== TileState.Empty) {
            this.state = state;
            if (state === TileState.X) {
                this.element.addClass("mark mark-x");
                this.element.append($("<i class='glyphicon glyphicon-record'></i>"));
            }
            else if (state === TileState.O) {
                this.element.addClass("mark mark-o");
                this.element.append($("<i class='glyphicon glyphicon-remove'></i>"));
            }
        }
    };
    return Tile;
}());
exports.Tile = Tile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFZLFNBQXFDO0FBQWpELFdBQVksU0FBUztJQUFHLDJDQUFTLENBQUE7SUFBRSxtQ0FBSyxDQUFBO0lBQUUsbUNBQUssQ0FBQTtBQUFDLENBQUMsRUFBckMsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFBNEI7QUFDakQ7SUFFSSxjQUFtQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQURsQyxVQUFLLEdBQWMsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUNHLENBQUM7SUFDdkMsdUJBQVEsR0FBUixVQUFTLEtBQWdCO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQ2YsQ0FBQyxDQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUNmLENBQUMsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFqQkQsSUFpQkM7QUFqQlksb0JBQUkifQ==