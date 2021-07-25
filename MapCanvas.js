import * as color from "./Colors.js";

class MapCanvas {
    constructor(aStar, loader) {
        this.loader = loader;
        this.aStar = aStar;
        this.startPos = new Cell();
        this.endPos = new Cell();
        this.canvas;
        this.ctx;
        this.mapData;
    
        this.tileH;
        this.tileW;
        this.closedSet = [];
        this.drawnClosed = [];
        this.scenery = [];
        // Dragging
        this.dragStart = false;
        this.dragEnd = false;
        this.gridOffset = 0.5;
    }

    setupMapCanvas() {
        this.setupCanvas();
        this.setupMap();
    }

    setupCanvas() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("mousedown", this.getCanvasClick.bind(this));
        this.canvas.addEventListener("mouseup", this.getDragEnd.bind(this));
        this.canvas.addEventListener("mousemove", this.dragSquare.bind(this));
    }

    setMeasurements(yLength, xLength) {
        this.tileH = (this.canvas.height - 1) / yLength;
        this.tileW = (this.canvas.width - 1) / xLength;
    }

    async setupMap() {
        let data = await this.loader.loadMap();
        this.mapData = new Array(data.length);
        this.setMeasurements(data.length, data[0].length);

        for (let y = 0; y < data.length; y++) {
             this.mapData[y] = new Array(data[y].length)
        }
        for (let y = 0; y < data.length; y++) {
             for (let x = 0; x < data[y].length; x++) {
                this.mapData[y][x] = new Cell(x, y, data[y][x]);
                if (this.mapData[y][x].type != 0) {
                    this.scenery.push(this.mapData[y][x])
                 }
             }
        }
        this.startPos = this.mapData[1][1];
        this.endPos = this.mapData[9][9];

        this.mapNeighbours();
        this.updateRoute();
    }

    mapNeighbours() {
        if (this.aStar.useDiagonals) {
            this.mapData.map(subMap => subMap.map(item => item.getNeighbors(this.mapData)));
        } else {
            this.mapData.map(subMap => subMap.map(item => item.getSimpleNeighbors(this.mapData)));
        }
    }

    updateRoute() {
        let routeData = this.aStar.findRoute(this.startPos, this.endPos);
        this.drawCanvasContents(routeData);
    }

    getCanvasPosition(e) {
        let gridX = Math.floor(e.offsetX / this.tileW);
        let gridY = Math.floor(e.offsetY / this.tileH);
        gridX = Math.min(Math.max(gridX, 0), this.mapData[0].length - 1);
        gridY = Math.min(Math.max(gridY, 0), this.mapData.length - 1);

        return [gridX, gridY];
    }

    dragSquare(e) {
        let [dragX, dragY] = this.getCanvasPosition(e);
        
        if (this.dragStart) {
            if (!this.mapData[dragY][dragX].wall) {
                if (!this.startPos.matchLocation(dragX, dragY)) {
                    this.startPos = this.mapData[dragY][dragX];
                    this.mapNeighbours();
                    this.updateRoute();
                }
            }
        } else if (this.dragEnd) {
            if (!this.mapData[dragY][dragX].wall) {
                if (!this.endPos.matchLocation(dragX, dragY)) {
                    this.endPos = this.mapData[dragY][dragX];
                    this.updateRoute();
                }
            }
        }
    }

    getDragEnd() {
        this.dragStart = false;
        this.dragEnd = false;
    }

    getCanvasClick(e) {
        var [ gridX, gridY ] = this.getCanvasPosition(e);
        if (this.startPos.matchLocation(gridX, gridY)) {
            this.dragStart = true;
        } else if (this.endPos.matchLocation(gridX, gridY)) {
            this.dragEnd = true;
        }
    }

    drawPath(path) {
        if (path.length > 0) {
            for (let cell of path) {
                cell.show(this.ctx, color.PATHBORDER, color.PATH, this.tileW, this.tileH);
            }
            this.endPos.showBold(this.ctx, color.BLACK, color.TARGET, this.tileW, this.tileH);
            this.startPos.showBold(this.ctx, color.BLACK, color.WHITE, this.tileW, this.tileH)
        }
    }

    drawGrid() {
        this.ctx.fillStyle = color.BLACK;
        this.ctx.fillRect(0,0, 400, 400);
        this.ctx.strokeStyle = color.GRIDLINE;
        this.ctx.globalAlpha = 1;

        for (let y = 0; y <= this.mapData.length; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.gridOffset, y * this.tileH + this.gridOffset);
            this.ctx.lineTo(400 + this.gridOffset, y * this.tileH + this.gridOffset);
            this.ctx.moveTo(y * this.tileW + this.gridOffset, this.gridOffset);
            this.ctx.lineTo(y * this.tileW + this.gridOffset, 400 + this.gridOffset);
            this.ctx.stroke();
        }
    }

    drawSetSquares(closedSet) {
        if (closedSet.length > 0) {
            closedSet.map(item => item.show(this.ctx, color.CLOSEDSET, color.CLOSEDSET, this.tileW, this.tileH))
        }
    }

    drawScenery() {
        for (let tile of this.scenery) {
            switch (tile.type) {
                case 1:
                    tile.show(this.ctx, color.WALLBORDER, color.WALLFILL, this.tileW, this.tileH);
                    break;
                case 2:
                    tile.show(this.ctx, color.WATER, color.WATER, this.tileW, this.tileH);
                    break;
                case 3:
                    tile.show(this.ctx, color.FLOOR, color.FLOOR, this.tileW, this.tileH);
                    break;
                case 4:
                    tile.show(this.ctx, color.GRASS, color.GRASS, this.tileW, this.tileH);
                    break;
                case 5:
                    tile.show(this.ctx, color.ROAD, color.ROAD, this.tileW, this.tileH);
                    break;
            }
        }
    }

    drawCanvasContents(pathData) {
        this.drawGrid();
        this.drawScenery();
        this.drawSetSquares(pathData[2]);
        this.drawPath(pathData[0]);
    }
}

export { MapCanvas };