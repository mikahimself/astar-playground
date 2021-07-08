function Cell(x, y, width, height, type) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 10;
    this.height = height || 10;
    this.neighbors = [];
    this.f = 0;
    this.g = 0; // cost of path from start node to n
    this.h = 0; // heuristic that estimates the cost of cheapest path from n to the goal
    this.previous = undefined;
    this.type = type || 0;
    this.wall = this.type == 1;
    this.cellCost = [1, Infinity, 8, 1, 1.5, 0.25]
    this.cost = this.cellCost[this.type] || 1;
    this.waterS = false;
    this.waterD = false;

    this.getRandomIntInclusive = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
      }

    // Checks equality with other Cells
    this.equals = function(other) {
        return other.x == this.x && other.y == this.y;
    }

    this.getNeighbors = function (grid) {
        var cols = grid[0].length;
        var rows = grid.length;
        
        if (this.x + 1 <= cols - 1) {
            this.neighbors.push(grid[this.y][this.x + 1]);
        }
        if (this.x > 0) {
            this.neighbors.push(grid[this.y][this.x - 1]);
        }
        if (this.y + 1 <= rows - 1) {
            this.neighbors.push(grid[this.y + 1][this.x]);
        }
        if (this.y > 0) {
            this.neighbors.push(grid[this.y - 1][this.x]);
        }
    }

    // Draw Cell onto grid
    // 0.5 added to position axes because grid lines have a 0.5 pixel
    // offset to prevent blurriness.
    this.show = function(ctx, borderColor, fillColor) {
        ctx.fillStyle = fillColor;
        var drawX = this.x * this.width  + 1.5;
        var drawY = this.y * this.height + 1.5;

        ctx.fillRect(drawX, drawY, this.width - 2, this.height - 2);
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(drawX, drawY, this.width - 2, this.height - 2);
    }

    this.showBold = function(ctx, borderColor, fillColor) {
        ctx.fillStyle = fillColor;
        var drawX = this.x * this.width;
        var drawY = this.y * this.height;

        ctx.fillRect(drawX, drawY, this.width, this.height);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, drawY, this.width, this.height);
        ctx.lineWidth = 1;
    }
}