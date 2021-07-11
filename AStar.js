function AStar(heuristicType) {
    this.openSet = []
    this.closedSet = []
    this.start;
    this.end;
    this.useDiagonals = false;
    this.heuristicType = heuristicType || "euclidean";

    this.resetValues = function () {
        this.closedSet = [];
        this.openSet = [];
    }

    this.setHeuristicType = function(type) {
        this.heuristicType = type;
    }

    this.setNeighbourType = function(useDiagonals) {
        this.useDiagonals = useDiagonals;
    }

    this.findPath = function(pointFrom) {
        path = [];
        path.push(pointFrom)
        var temp = pointFrom;
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
        return path;
    }

    this.getHeuristic = function(a, b) {
        if (this.heuristicType == "euclidean") {
            return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y))); // Euclidean distance
        } else {
            return Math.abs(b.x - a.x) + Math.abs(b.y - a.y); // Manhattan distance
        }
    }

    this.findRoute = function(start, end) {
        this.resetValues()
        this.openSet.push(start);
        var current;

        // Loop while there are items to investigate
        while (this.openSet.length > 0) {
            // Find the item with the lowest f
            var indexOfLowestF = 0;

            this.openSet.map((item, index) => {
                if (item.f < this.openSet[indexOfLowestF].f) {
                    indexOfLowestF = index;
                }
            });

            // Set the Cell with the lowest f as the current item
            current = this.openSet[indexOfLowestF];
            // Then move it from the openSet to the closedSet
            this.openSet = this.openSet.filter((item) => !(item.equals(current)));
            this.closedSet.push(current);

            // If the item with the lowest f is the goal, we're done.
            if (current.equals(end)) {
                var path = this.findPath(current);
                return [path, this.openSet, this.closedSet];
            }

            // check the current item's neighbors
            for (let neighbor of current.neighbors) {
                // process only items that have not been processed
                if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
                    // assign temporary g score. Since this is a neighbor, 
                    // it's cost is the current item's g score, plus 1.
                    var tempG = current.g + neighbor.cost;
                    // Check if we've already been here with a lower g.
                    // If not, update g score
                    if (this.openSet.includes(neighbor)) {
                        if  (tempG < neighbor.g) {
                            neighbor.g = tempG;
                        }
                    // otherwise, add g score and add neighbor to open set.
                    } else {
                        neighbor.g = tempG;
                        // Here, calculate the heuristic, that is, an educated
                        // guess about the distance to the end from the neighbor.
                        // Currently just the euclidean distance
                        neighbor.h = this.getHeuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        // Keep track of the cell that we came from
                        neighbor.previous = current;
                        this.openSet.push(neighbor)
                    }
                }
            }
        }
        return false;
    }



}