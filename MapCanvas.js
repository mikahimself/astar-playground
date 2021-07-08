function MapCanvas(aStar) {
    this.canvas;
    this.ctx;
    this.baseMap;
    this.mapData;
    this.startPos;
    this.endPos;
    this.tileH;
    this.tileW;
    this.path = [];
    this.drawnOpen = [];
    this.drawnClosed = [];
    this.aStar = aStar;
    this.prevSquare = new Cell();
    this.currentSquare = new Cell();
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
    this.TARGET = "#f00d";


    this.getData = async function() {
        var mapData = await fetch("http://localhost:3000/api/map", {
            method: "GET"
        })
        .then(res => res.json());
        this.setupMap(mapData.map)
    }

    this.setupCanvas = function() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.getCanvasClick.bind(this));
        this.canvas.addEventListener("mousemove", this.drawPointerSquare.bind(this));
    }

    this.setMeasurements = function(data) {
        this.tileH = (this.canvas.height - 1) / data.length;
        this.tileW = (this.canvas.width - 1) / data[0].length;
    }

    this.setupMap = async function(data) {
        this.baseMap = data;
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
        this.mapData.map(subMap => subMap.map(item => item.getNeighbors(this.mapData)));

        this.startPos = this.mapData[1][1];
        this.drawMap(data)
        this.prevSquare.width = this.tileW;
        this.prevSquare.height = this.tileH;
        this.currentSquare.width = this.tileW;
        this.currentSquare.height = this.tileH;
        this.drawScenery();
    }

    this.getCanvasPosition = function(e) {
        let gridX = Math.floor(e.offsetX / this.tileW);
        let gridY = Math.floor(e.offsetY / this.tileH);
        gridX = Math.min(Math.max(gridX, 0), this.mapData[0].length - 1);
        gridY = Math.min(Math.max(gridY, 0), this.mapData.length - 1);

        return [gridX, gridY];
    }

    this.getCanvasClick = function(e) {
        var [ gridX, gridY ] = this.getCanvasPosition(e);

        if (this.mapData[gridY][gridX].wall) {
            return;    
        }
        
        this.drawMap(this.baseMap);
        
        this.endPos = this.mapData[gridY][gridX];
        this.startPos = this.mapData[1][1];
        this.path = this.aStar.findRoute(this.startPos, this.endPos);
        if (this.path) {
            this.drawSetSquares(this.path[1], this.path[2]);
            for (let cell of this.path[0]) {
                cell.show(this.ctx, "#000", "#FFC107")
            }
        }
        this.drawScenery();
    }

    this.drawPointerSquare = function(e) {
        var [ gridX, gridY ] = this.getCanvasPosition(e);

        this.prevSquare.x = this.currentSquare.x;
        this.prevSquare.y = this.currentSquare.y;
        this.currentSquare.x = gridX;
        this.currentSquare.y = gridY;

        if (this.path) {
            this.drawSetSquares(this.path[1], this.path[2]);
        }

        let tempPath = this.aStar.findRoute(this.startPos, this.mapData[gridY][gridX]);
        if (tempPath) {
            this.path = tempPath;
        }
        this.drawMap(this.baseMap);
        this.drawScenery();
        this.drawSetSquares(this.path[1], this.path[2]);
        this.drawPath();
        this.currentSquare.showBold(this.ctx, "#000", "#43c76f");
        this.startPos.showBold(this.ctx, "#fff", "#fff")
    }

    this.drawPath = function() {
        if (this.path.length > 0) {
            for (let cell of this.path[0]) {
                cell.show(this.ctx, this.PATHBORDER, this.PATH);
            }
        }
    }

    this.drawMap = function(map) {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0,0, 400, 400);
        this.ctx.strokeStyle = "#595758";
        this.ctx.globalAlpha = 1;

        for (let y = 0; y <= map.length; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0.5, y * this.tileH + 0.5);
            this.ctx.lineTo(400.5, y * this.tileH + 0.5);
            this.ctx.moveTo(y * this.tileW + 0.5, 0.5);
            this.ctx.lineTo(y * this.tileW + 0.5, 400.5);
            this.ctx.stroke();
        }
    }
    this.drawSetSquares = function(openSet, closedSet) {
        if (closedSet && closedSet.length > 0) {
            let newToDraw = closedSet.filter(item => !this.drawnClosed.includes(item))
            this.drawnClosed.push(...newToDraw)
            closedSet.map(item => item.show(this.ctx, "#00000022", "#00000022"))
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
}