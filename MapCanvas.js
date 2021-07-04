function MapCanvas(aStar) {
    this.canvas;
    this.ctx;
    this.baseMap;
    this.mapData;
    this.startPos;
    this.endPos;
    this.tileH;
    this.tileW;
    this.path;
    this.drawnOpen = [];
    this.drawnClosed = [];
    this.aStar = aStar;
    this.prevSquare = new Cell(0,0,0,0);
    this.currentSquare = new Cell(0,0,0,0);

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

        // document.querySelectorAll("input[name='heuristic-type']").forEach((input) => {
        //     input.addEventListener("change", setHeuristicType);
        // });
        this.canvas.addEventListener("mousemove", this.drawPointerSquare.bind(this));
    }

    this.setMeasurements = function(data) {
        this.tileH = (this.canvas.height - 1) / data.length;
        this.tileW = (this.canvas.width - 1) / data[0].length;
    }

    this.setupMap = async function(data) {
        baseMap = data;
        this.mapData = new Array(data.length);
        this.setMeasurements(data);

        for (let y = 0; y < data.length; y++) {
             this.mapData[y] = new Array(data[y].length)
        }
        for (let y = 0; y < data.length; y++) {
             for (let x = 0; x < data[y].length; x++) {
                 this.mapData[y][x] = new Cell(x, y, this.tileW, this.tileH);
             }
        }
        // Map neighbors
        this.mapData.map(subMap => subMap.map(item => item.getNeighbors(this.mapData)));

        this.startPos = this.mapData[5][8];
        this.drawMap(data)
        this.prevSquare.width = this.tileW;
        this.prevSquare.height = this.tileH;
        this.currentSquare.width = this.tileW;
        this.currentSquare.height = this.tileH;
    }

    this.getCanvasPosition = function(e) {
        return [Math.floor(e.offsetX / this.tileW), Math.floor(e.offsetY / this.tileH)];
    }

    this.getCanvasClick = function(e) {
        var [ gridX, gridY ] = this.getCanvasPosition(e);
        this.drawMap(baseMap);

        this.endPos = this.mapData[gridY][gridX];
        this.startPos = this.mapData[5][8];
        this.path = this.aStar.findRoute(this.startPos, this.endPos);
        this.drawSetSquares(this.path[1], this.path[2]);
        for (let cell of this.path[0]) {
            cell.show(this.ctx, "#000", "#FFC107")
        }
    }

    this.drawPointerSquare = function(e) {
        var [ gridX, gridY ] = this.getCanvasPosition(e);
        if (gridX == this.currentSquare.x && gridY == this.currentSquare.y) {
            //;
        } else {
            this.prevSquare.x = this.currentSquare.x;
            this.prevSquare.y = this.currentSquare.y;
            this.currentSquare.x = gridX;
            this.currentSquare.y = gridY;
            this.prevSquare.show(this.ctx, "#fff", "#fff")
            if (this.path) {
                this.drawSetSquares(this.path[1], this.path[2]);
            }
            this.drawPath();
            this.currentSquare.show(this.ctx, "#000", "#0f0");
        }
    }

    this.drawPath = function() {
        if (typeof this.path != "undefined") {
            for (let cell of this.path[0]) {
                cell.show(this.ctx, "#000", "#FFC107")
            }
        }
    }

    this.drawMap = function(map) {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0,0, 400, 400);
        this.ctx.strokeStyle = "#111";
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
            closedSet.map(item => item.show(this.ctx, "#000", "#D81B60"))
        }
        if (typeof openSet != "undefined" && openSet.length > 0) {
            let newOpenToDraw = openSet.filter(item => !this.drawnOpen.includes(item) && !this.drawnClosed.includes(item));
            this.drawnOpen.push(...newOpenToDraw)
            openSet.map(item => item.show(this.ctx, "#000", "#1E88E5"));
        }
    }
}