import React from 'react'
import Unit from './Unit'

export default class UniformGrid {
    constructor(posArr, CVS_WIDTH, CVS_HEIGHT) {
        this.NUM_CELLS = 2;
        this.cells = this.makeArray(this.NUM_CELLS, this.NUM_CELLS);
        this.posArr = posArr;
        this.CVS_DIMENSIONS = [CVS_HEIGHT, CVS_WIDTH]
        this.initializeCells(posArr);

    }

    //Initialize the cells array with points from posArrTest
    //Only call this function when cells is uninitialized (only call in constructor method or if posArr was not provided in constructor method, then only call the first time posArr is provided)
    initializeCells(posArrTest) {

        for (let ind=0; ind<posArrTest.length; ind++) {
            const curPos = [posArrTest[ind].y, posArrTest[ind].x]
            const curUnit = new Unit(this, curPos[1], curPos[0])

            /*
            const curCellInds = new Array(2)
            for (let i=0; i<2; i++) {
                curCellInds[i] = Math.floor(curPos[i]*this.NUM_CELLS/this.CVS_DIMENSIONS[i])
            }
            this.cells[curCellInds[0]][curCellInds[1]]++;
            console.log("this.cells[" + curCellInds[0] + "][" + curCellInds[1] + "] = " + this.cells[curCellInds[0]][curCellInds[1]]);
            */
        }
    }

    makeArray(d1, d2) {
        var arr = [];
        for(let i = 0; i < d2; i++) {
            arr.push(new Array(d1));
            arr[i] = arr[i].fill(null);
        }
        return arr;
    }

    getCells() {
        return this.cells;
    }

    add(unit) {
        //unit is type Unit
        
        // Determine which grid cell it's in.
        console.log("unit=" + unit.toString())
        const cellX = Math.floor(unit.x * this.NUM_CELLS / this.CVS_DIMENSIONS[1]);
        const cellY = Math.floor(unit.y * this.NUM_CELLS / this.CVS_DIMENSIONS[0]);

        // Add to the front of list for the cell it's in.
        unit.prev = null;
        console.log("cellX=" + cellX + " cellY=" + cellY);
        unit.next = this.cells[cellX][cellY];
        
        this.cells[cellX][cellY] = unit;

        if (unit.next != null)
        {
            unit.next.prev = unit;
        }
    }

    calcDist(unit, other) {
        const dist = Math.sqrt((unit.x-other.x)*(unit.x-other.x) + (unit.y-other.y)*(unit.y-other.y));
        return dist;
    }

    handleCollisionWithObject(unit, other) {
        console.log("IN UniformGrid.js, handleCollisionWithObject(unit=" + unit + ", other=" + other + ");");
    }

    handleCell(unit) {
        while (unit != null)
        {
          let other = unit.next;
          while (other != null)
          {
            
            if (this.calcDist(unit, other) < 100)
            {
              this.handleCollisionWithObject(unit, other);
            }
            other = other.next;
          }
      
          unit = unit.next;
        }
    }

    handleCollisions() {
        //Handle 1 frame is the following runtime
        //curUnits = # of Units in Cell[i][j]
        //O(NUM_CELLS*NUM_CELLS*(curUnits across all i,j)^2)
        for (let x = 0; x < this.NUM_CELLS; x++) {
            for (let y = 0; y < this.NUM_CELLS; y++) {
                this.handleCell(this.cells[x][y]);
            }
        }

    }

    printGrid() {
        
        for (let i=0; i<this.cells.length; i++) {
            for (let j=0; j<this.cells[i].length; j++) {
                const curEle = this.cells[i][j];
                const curType = typeof(curEle);
                console.log("cells[" + i + "][" + j + "] = ");
                if (curType === 'number') {
                    console.log(curEle);
                }
                if (curEle instanceof Unit) {
                    console.log(curEle.toString());
                }
            }
        }
    }

}