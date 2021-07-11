function MapCanvas(aStar) {
    this.canvas;
    this.ctx;
    this.mapData;
    this.startPos = new Cell();
    this.endPos = new Cell();
    this.previousEndPos = new Cell();
    this.tileH;
    this.tileW;
    this.path = [];
    this.pathInvalid = false;
    this.openSet = [];
    this.closedSet = [];
    this.drawnOpen = [];
    this.drawnClosed = [];
    this.aStar = aStar;
    this.walls = [];
    this.forests = [];
    this.scenery = [];
    this.WALLFILL = "#333";
    this.WALLBORDER = "#111";
    this.FLOOR = "#C8AB83";
    this.GRASS =  "#7FD99D"
    this.WATER = "#399BDC";
    this.ROAD = "#FFE6A7";
    this.PATH = "#F04265";
    this.PATHBORDER = "#840B23";
    this.TARGET = "#43C76F";
    this.TARGET_INVALID = "#F00D";
    this.BLACK = "#000";
    this.WHITE = "#FFF"

    // Dragging
    this.dragStart = false;
    this.dragEnd = false;

    this.getData = async function() {
        var data = await fetch("http://localhost:3000/api/map", {
            method: "GET"
        })
        .then(res => res.json());
        this.setupMap(data.map)
    }

    this.setupCanvas = function() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        //this.canvas.addEventListener("click", this.getCanvasClick.bind(this));
        this.canvas.addEventListener("mousedown", this.getCanvasClick.bind(this));
        this.canvas.addEventListener("mouseup", this.getDragEnd.bind(this));
        // this.canvas.addEventListener("mousemove", this.drawPointerSquare.bind(this));
        this.canvas.addEventListener("mousemove", this.dragSquare.bind(this));
    }

    this.setMeasurements = function(data) {
        this.tileH = (this.canvas.height - 1) / data.length;
        this.tileW = (this.canvas.width - 1) / data[0].length;
    }

    this.setupMap = async function(data) {
        this.mapData = new Array(data.length);
        this.setMeasurements(data);

        for (let y = 0; y < data.length; y++) {
             this.mapData[y] = new Array(data[y].length)
        }
        for (let y = 0; y < data.length; y++) {
             for (let x = 0; x < data[y].length; x++) {
                this.mapData[y][x] = new Cell(x, y, this.tileW, this.tileH, data[y][x]);
                if (this.mapData[y][x].type != 0) {
                    this.scenery.push(this.mapData[y][x])
                 }
             }
        }
        // Map neighbors
        this.startPos = this.mapData[1][1];
        this.endPos = this.mapData[9][9];
        this.mapNeighbours();

        this.drawCanvasContents();
    }

    this.mapNeighbours = function() {
        if (this.aStar.useDiagonals) {
            this.mapData.map(subMap => subMap.map(item => item.getNeighbors(this.mapData)));
        } else {
            this.mapData.map(subMap => subMap.map(item => item.getSimpleNeighbors(this.mapData)));
        }
        let tempPath = this.aStar.findRoute(this.startPos, this.endPos);
        this.path = tempPath[0]
        this.openSet = tempPath[1]
        this.closedSet = tempPath[2]
        // [this.path, this.openSet, this.closedSet] = tempPath;
        this.drawCanvasContents();
    }

    this.getCanvasPosition = function(e) {
        let gridX = Math.floor(e.offsetX / this.tileW);
        let gridY = Math.floor(e.offsetY / this.tileH);
        gridX = Math.min(Math.max(gridX, 0), this.mapData[0].length - 1);
        gridY = Math.min(Math.max(gridY, 0), this.mapData.length - 1);

        return [gridX, gridY];
    }

    this.dragSquare = function(e) {
        let [dragX, dragY] = this.getCanvasPosition(e);
        if (this.dragStart) {
            if (!this.mapData[dragY][dragX].wall) {
                if (dragX != this.startPos.x || dragY != this.startPos.y) {
                    this.startPos = this.mapData[dragY][dragX];
                }
                
            }
        } else if (this.dragEnd) {
            if (!this.mapData[dragY][dragX].wall) {
                if (dragX != this.endPos.x || dragY != this.endPos.y) {
                    this.endPos = this.mapData[dragY][dragX];
                }
            }
        }
        if (this.dragStart || this.dragEnd) {
            this.mapNeighbours();
        }
    }

    this.getDragEnd = function(e) {
        if (this.dragStart) {
            this.dragStart = false;
        }
        if (this.dragEnd) {
            this.dragEnd = false;
        }
    }

    this.getCanvasClick = function(e) {
        var [ gridX, gridY ] = this.getCanvasPosition(e);
        if (this.startPos.x == gridX && this.startPos.y == gridY) {
            this.dragStart = true;
        } else if (this.endPos.x == gridX && this.endPos.y == gridY) {
            this.dragEnd = true;
        }

        if (this.mapData[gridY][gridX].wall) {
            return;    
        }
        
        // this.drawGrid();
        
        // this.endPos = this.mapData[gridY][gridX];
        // this.startPos = this.mapData[1][1];
        // [this.path, this.openSet, this.closedSet] = this.aStar.findRoute(this.startPos, this.endPos);
        // if (this.path) {
        //     this.drawSetSquares(this.path[1], this.path[2]);
        //     for (let cell of this.path[0]) {
        //         cell.show(this.ctx, this.BLACK, "#FFC107")
        //     }
        // }
        // this.drawScenery();
    }

    this.drawPointerSquare = function(e) {
        var [ gridX, gridY ] = this.getCanvasPosition(e);

        this.endPos = this.mapData[gridY][gridX];

        let tempPath = this.aStar.findRoute(this.startPos, this.endPos);
        if (tempPath) {
            [this.path, this.openSet, this.closedSet] = tempPath;
            this.pathInvalid = false;
            this.previousEndPos = this.endPos;
        } else {
            this.pathInvalid = true;
        }

        this.drawCanvasContents();
    }

    this.drawPath = function() {
        if (this.path.length > 0) {
            for (let cell of this.path) {
                cell.show(this.ctx, this.PATHBORDER, this.PATH);
            }
                this.endPos.showBold(this.ctx, this.BLACK, this.TARGET);
            this.startPos.showBold(this.ctx, "#fff", "#00f")
        }
    }

    this.drawGrid = function() {
        this.ctx.fillStyle = this.BLACK;
        this.ctx.fillRect(0,0, 400, 400);
        this.ctx.strokeStyle = "#595758";
        this.ctx.globalAlpha = 1;

        for (let y = 0; y <= this.mapData.length; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0.5, y * this.tileH + 0.5);
            this.ctx.lineTo(400.5, y * this.tileH + 0.5);
            this.ctx.moveTo(y * this.tileW + 0.5, 0.5);
            this.ctx.lineTo(y * this.tileW + 0.5, 400.5);
            this.ctx.stroke();
        }
    }
    this.drawSetSquares = function() {
        if (this.closedSet.length > 0) {
            let newToDraw = this.closedSet.filter(item => !this.drawnClosed.includes(item))
            this.drawnClosed.push(...newToDraw)
            this.closedSet.map(item => item.show(this.ctx, "#00000022", "#00000022"))
        }
        // if (typeof openSet != "undefined" && openSet.length > 0) {
        //     let newOpenToDraw = openSet.filter(item => !this.drawnOpen.includes(item) && !this.drawnClosed.includes(item));
        //     this.drawnOpen.push(...newOpenToDraw)
        //     openSet.map(item => item.show(this.ctx, "#000", "#1E88E533"));
        // }
    }

    this.drawScenery = function() {
        for (let tile of this.scenery) {
            switch (tile.type) {
                case 1:
                    tile.show(this.ctx, this.WALLBORDER, this.WALLFILL);
                    break;
                case 2:
                    tile.show(this.ctx, this.WATER, this.WATER);
                    break;
                case 3:
                    tile.show(this.ctx, this.FLOOR, this.FLOOR);
                    break;
                case 4:
                    tile.show(this.ctx, this.GRASS, this.GRASS);
                    break;
                case 5:
                    tile.show(this.ctx, this.ROAD, this.ROAD);
                    break;
            }
        }
    }

    this.drawCanvasContents = function() {
        this.drawGrid();
        this.drawScenery();
        this.drawSetSquares();
        this.drawPath();
    }
}