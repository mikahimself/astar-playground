function Cell(x, y, type) {
    this.x = x || 0;
    this.y = y || 0;
    this.neighbors = [];
    this.f = 0;
    this.g = 0; // cost of path from start node to n
    this.h = 0; // heuristic that estimates the cost of cheapest path from n to the goal
    this.previous = undefined;
    this.type = type || 0;
    this.wall = this.type == 1;
    this.cellCost = [1, Infinity, 8, 1, 1.5, 0.25]
    this.cost = this.cellCost[this.type] || 1;

    this.getRandomIntInclusive = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
      }

    // Checks equality with other Cells
    this.equals = function(other) {
        return other.x == this.x && other.y == this.y;
    }

    this.getSimpleNeighbors = function (grid) {
        var cols = grid[0].length;
        var rows = grid.length;
        this.neighbors = [];
        this.previous = undefined;
        
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

    this.getNeighbors = function (grid) {
        var cols = grid[0].length;
        var rows = grid.length;
        this.neighbors = [];
        this.previous = undefined;
        
        if (this.x + 1 <= cols - 1) {
            this.neighbors.push(grid[this.y][this.x + 1]);
            if (this.y + 1 <= rows - 1) {
                this.neighbors.push(grid[this.y + 1][x + 1])
            }
            if (this.y > 0) {
                this.neighbors.push(grid[this.y - 1][x + 1])
            }
        }
        if (this.x > 0) {
            this.neighbors.push(grid[this.y][this.x - 1]);
            if (this.y + 1 <= rows - 1) {
                this.neighbors.push(grid[this.y + 1][x - 1])
            }
            if (this.y > 0) {
                this.neighbors.push(grid[this.y - 1][x - 1])
            }
        }
        if (this.y + 1 <= rows - 1) {
            this.neighbors.push(grid[this.y + 1][this.x]);
        }
        if (this.y > 0) {
            this.neighbors.push(grid[this.y - 1][this.x]);
        }
    }

    /**
     * Draws a cell onto the grid using an offset that prevents canvas blurriness
     * 
     * @param {context} ctx Canvas context
     * @param {string} borderColor Border color as a HEX string
     * @param {sting} fillColor Fill color as a HEX string
     * @param {number} width Width of the cell
     * @param {number} height Height of the cell
     */
    this.show = function(ctx, borderColor, fillColor, width, height) {
        ctx.fillStyle = fillColor;
        var drawX = this.x * width  + 1.5;
        var drawY = this.y * height + 1.5;

        ctx.fillRect(drawX, drawY, width - 2, height - 2);
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(drawX, drawY, width - 2, height - 2);
    }

    this.showBold = function(ctx, borderColor, fillColor, width, height) {
        ctx.fillStyle = fillColor;
        var drawX = this.x * width;
        var drawY = this.y * height;

        ctx.fillRect(drawX, drawY, width, height);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, drawY, width, height);
        ctx.lineWidth = 1;
    }

    this.matchLocation = function (otherX, otherY) {
        return this.x == otherX && this.y == otherY;
    }

    this.getCoords = function() {
        return `X: ${this.x}, y: ${this.y}`;
    }
}