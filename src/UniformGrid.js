import React from 'react'
import Unit from './Unit'
import {calcMag, dotProduct, scaleBy, addVector, linearInterpolate, isCollisionWithWall, linearInterpolateWithWall, handleCollisionWithWall} from './App'

export default class UniformGrid {
    constructor(posArr, CVS_WIDTH, CVS_HEIGHT, NUM_CELLS) {
        this.NUM_CELLS = NUM_CELLS;
        this.cells = this.makeArray(this.NUM_CELLS, this.NUM_CELLS);
        this.posArr = posArr;
        this.CVS_DIMENSIONS = [CVS_HEIGHT, CVS_WIDTH]
        this.initializeCells(posArr);
        this.done = false;
        this.testFc = 0;
        this.maxFc = 100;
        //this.maxFc = 870;
        //this.maxFc = 28;
        //this.maxFc = 32;
        
        this.nRUC = 0;
    }

    //Initialize the cells array with points from posArrTest
    //Only call this function when cells is uninitialized (only call in constructor method or if posArr was not provided in constructor method, then only call the first time posArr is provided)
    initializeCells(posArrTest) {

        for (let ind=0; ind<posArrTest.length; ind++) {
            const curPos = posArrTest[ind]
            this.addPos(curPos, ind);
            //const curUnit = new Unit(this, ind, curPos)
            
            //this.add(curUnit);

            /*
            const curCellInds = new Array(2)
            for (let i=0; i<2; i++) {
                curCellInds[i] = Math.floor(curPos[i]*this.NUM_CELLS/this.CVS_DIMENSIONS[i])
            }
            this.cells[curCellInds[0]][curCellInds[1]]++;
            console.log("this.cells[" + curCellInds[0] + "][" + curCellInds[1] + "] = " + this.cells[curCellInds[0]][curCellInds[1]]);
            */
        }

        console.log("done=", this.done);
    }

    makeArray(d1, d2) {
        var arr = [];
        for(let i = 0; i < d1; i++) {
            arr.push(new Array(d2));
            arr[i] = arr[i].fill(null);
        }
        return arr;
    }

    getCells() {
        return this.cells;
    }

    addPos(pos, posInd) {
        //unit is type Unit
        if (this.nRUC >= 1) {
            //return;
        }
        // Determine which grid cell it's in.
        console.log("pos=", pos)

        const cellX = Math.floor(pos.x * this.NUM_CELLS / this.CVS_DIMENSIONS[1]);
        const cellY = Math.floor(pos.y * this.NUM_CELLS / this.CVS_DIMENSIONS[0]);

        // Add to the front of list for the cell it's in.
        this.posArr[posInd].prev = null;
        console.log("posInd=" + posInd + " cellX=" + cellX + " cellY=" + cellY);
        if (cellY < 0) {
            this.testFc = this.maxFc + 1;
            return;
        }
        console.log("BEFORE this.posArr[posInd].next is set, this.cells[cellY][cellX]=", this.cells[cellY][cellX])
        this.posArr[posInd].next = this.cells[cellY][cellX];
        
        this.cells[cellY][cellX] = posInd;

        if (this.posArr[posInd].next != null)
        {
            console.log("the prev of posInd's next is updated")
            this.posArr[this.posArr[posInd].next].prev = posInd;
        }

        /*
        if (this.nRUC < 1) {
            //this.posArr[0].next = 1;
            this.printGrid();
            console.log("after print grid in addPos()");
        }
        */
    }

    add(unit) {
        //unit is type Unit
        
        // Determine which grid cell it's in.
        console.log("unit=" + unit.toString())
        const cellX = Math.floor(unit.pos.x * this.NUM_CELLS / this.CVS_DIMENSIONS[1]);
        const cellY = Math.floor(unit.pos.y * this.NUM_CELLS / this.CVS_DIMENSIONS[0]);

        // Add to the front of list for the cell it's in.
        unit.prev = null;
        console.log("cellX=" + cellX + " cellY=" + cellY);
        unit.next = this.cells[cellY][cellX];
        
        this.cells[cellY][cellX] = unit;

        if (unit.next != null)
        {
            unit.next.prev = unit;
        }
    }

    updateCells(curInd, curI, curJ, newI, newJ) {
        //curInd is the ind in this.posArr of the current particle
        //Assume this.posArr[curInd] falls physically in the cell boundaries of newI, newJ (Assume this.posArr[curInd] has already been updated)
        
        if (curInd == 1) {
            //    return;
        }

        console.log("updateCells(curInd=" + curInd + ", curI=" + curI + ", curJ=" + curJ + ", newI=" + newI + " newJ="+ newJ + ")");
        console.log("this.posArr[curInd]=", this.posArr[curInd]);
        console.log("this.posArr[curInd].prev=", this.posArr[curInd].prev);
        console.log("this.posArr[curInd].next=", this.posArr[curInd].next);

        //Update cell[curI][curJ]'s list

        if (this.posArr[curInd].prev !== null) {
            console.log("testing prev !=null");
            this.posArr[this.posArr[curInd].prev].next = this.posArr[curInd].next;
        }

        if (this.posArr[curInd].next !== null) {
            console.log("testing next !=null");
            this.posArr[this.posArr[curInd].next].prev = this.posArr[curInd].prev;
        }

        if (this.cells[curI][curJ] === curInd) {
            //Another way to write the if statement is this.posArr[curInd].prev == null
            //this.cells[curI][curJ] = this.posArr[curInd].next;
            if (this.cells[curI][curJ].next == null || this.cells[curI][curJ].next == undefined) {
                this.cells[curI][curJ] = null;
            } else {
                this.cells[curI][curJ] = this.cells[curI][curJ].next;
            }
            console.log("CHANGE curInd=" + curInd + " cells[curI=" + curI + "][curJ=" + curJ + "] cells[curI][curJ].next=" + this.cells[curI][curJ]);
        }

        //Update cell[newI][newJ]'s list

        console.log("this.posArr[curInd]=", this.posArr[curInd]);
        this.addPos(this.posArr[curInd], curInd);

        /*
        if (this.nRUC < 1) {
        this.printGrid();
        }
        */

        this.printGrid();
        this.nRUC++;
    }

    updateDraw(timeRate) {

        if (this.testFc > this.maxFc) {
            console.log("updateDraw() returned since this.testFc was > than " + this.maxFc);
            if (this.testFc < this.maxFc + 2) {
                this.printGrid();
            }
            this.testFc++;
            return this.posArr;
        }

        this.handleCollisions();

        for (let i=0; i<this.NUM_CELLS; i++) {
            for (let j=0; j<this.NUM_CELLS; j++) {
                let curInd = this.cells[i][j];
                if (curInd === null) continue;
                console.log("i,j = " + i + "," + j + " curInd=" + curInd);
                const curUnitCopy = this.posArr[curInd];
                let curUnit = this.posArr[curInd];
                const curI = i;
                const curJ = j;
                while (curInd != null) {
                    const tempUnit = {...curUnit};
                    /*
                    console.log("INSIDE updateDraw() INSIDE while (curInd != null) loop");
                    console.log("BEFORE UPDATE curUnit.x, curUnit.y");
                    console.log("curInd=", curInd);
                    console.log("curUnit=" + curUnit + " curUnit.x=", curUnit.x + "curUnit.y=" + curUnit.y + " curUnit.vx=" + curUnit.vx + " curUnit.vy=" + curUnit.vy);
                    */
                    curUnit.x += timeRate*curUnit.vx;
                    curUnit.y += timeRate*curUnit.vy;
                    
                    console.log("AFTER UPDATE curUnit.x, curUnit.y");
                    console.log("curInd=", curInd);
                    console.log("curUnit=" + curUnit + " curUnit.x=", curUnit.x + "curUnit.y=" + curUnit.y + " curUnit.vx=" + curUnit.vx + " curUnit.vy=" + curUnit.vy);
                    console.log("curI=" + curI + " curJ=" + curJ);
                    
                    const curDir = isCollisionWithWall(curUnit);
                    //console.log("curDir=" + curDir + " curDir.pos1.x=", curDir.pos1.x);
                    if (curDir.foundCollision) {
                        //console.log("Before linIntWithWall");
                        //console.log("unit pos=", curUnit);
                        linearInterpolateWithWall(curUnit);
                        //console.log("After linIntWithWall");
                        //console.log("unit pos=", curUnit);

                        handleCollisionWithWall(curUnit, curDir.dir);
                    }

                    const newI = Math.floor(curUnit.y * this.NUM_CELLS / this.CVS_DIMENSIONS[0]);
                    const newJ = Math.floor(curUnit.x * this.NUM_CELLS / this.CVS_DIMENSIONS[1]);
                    if (newI != curI || newJ != curJ) {
                        this.updateCells(curInd, curI, curJ, newI, newJ)
                    }
                    
                   
                    curInd = tempUnit.next;
                    if (curInd == null) break;
                    curUnit = this.posArr[curInd];
                }
            }
        }
        
        /*
        let posArrCopy = Array.from(this.posArr);
        for (let i=0; i<this.posArr.length; i++) {
        const v = {x: (posArrCopy[i].vx), y: (posArrCopy[i].vy)};

        posArrCopy[i].x+= v.x;
        posArrCopy[i].y+= v.y;
        
        }
        

        //console.log(posArr);
        return (this.posArr = posArrCopy);
        */

        this.testFc++;
        console.log("this.posArr=", this.posArr);
        return this.posArr;
    }

    calcDist(pos1, pos2) {
        const dist = Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y));
        return dist;
    }

    handleCollisionWithObject(pos1, pos2) {
        console.log("IN UniformGrid.js, handleCollisionWithObject(pos1=" + pos1 + ", pos2=" + pos2 + ");");
        //To represent vectors, use arrays not properties of x and y
    
    const m = [pos1.mass, pos2.mass]

    //p_diff = position vector to get from center of object 1 to center of object 2
    const p_diff = [pos2.x-pos1.x, pos2.y-pos1.y]

    //v_bef = array of velocity vectors for initial velocities of object 1 and object 2
    const v_bef = [[pos1.vx, pos1.vy], [pos2.vx, pos2.vy]]

    const u_norm = scaleBy(p_diff, 1/(calcMag(p_diff)));
    const u_tan = [-u_norm[1], u_norm[0]]

    //v_bef_rot = transformed version of v_bef. this time v_bef_rot[i][0] reps the normal component and v_bef_rot[i][1] reps the tangent component
    const v_bef_rot = [[dotProduct(v_bef[0], u_norm), dotProduct(v_bef[0], u_tan)], [dotProduct(v_bef[1], u_norm), dotProduct(v_bef[1], u_tan)]]
  
    let v_aft_rot = [[0,v_bef_rot[0][1]],[0,v_bef_rot[1][1]]]

    //fill in the normal components for the 2 object's final velocities
    v_aft_rot[0][0] = (v_bef_rot[0][0])*(m[0]-m[1]) + 2*m[1]*(v_bef_rot[1][0])
    v_aft_rot[1][0] = (v_bef_rot[1][0])*(m[1]-m[0]) + 2*m[0]*(v_bef_rot[0][0])

    v_aft_rot[0][0] = v_aft_rot[0][0] * 1/(m[0]+m[1])
    v_aft_rot[1][0] = v_aft_rot[1][0] * 1/(m[0]+m[1])

    let v_aft = [[0,0],[0,0]]
    for (let i=0; i<v_aft.length; i++) {
      v_aft[i] = addVector(v_aft[i], scaleBy(u_norm, v_aft_rot[i][0]))
      v_aft[i] = addVector(v_aft[i], scaleBy(u_tan, v_aft_rot[i][1]))
    }

    /*
    console.log("p_diff" + p_diff);
    console.log("v_bef" + v_bef);
    console.log("u_norm" + u_norm);
    console.log("u_tan" + u_tan);
    console.log("v_bef_rot" + v_bef_rot);
    console.log("v_aft_rot" + v_aft_rot);
    console.log("v_aft" + v_aft);
    */

    return v_aft;
        /*
    const m = [unit.mass, other.mass]

    //p_diff = position vector to get from center of object 1 to center of object 2
    const p_diff = [other.x-unit.x, other.y-unit.y]

    //v_bef = array of velocity vectors for initial velocities of object 1 and object 2
    const v_bef = [[unit.vx, unit.vy], [other.vx, other.vy]]

    const u_norm = scaleBy(p_diff, 1/(calcMag(p_diff)));
    const u_tan = [-u_norm[1], u_norm[0]]

    //v_bef_rot = transformed version of v_bef. this time v_bef_rot[i][0] reps the normal component and v_bef_rot[i][1] reps the tangent component
    const v_bef_rot = [[dotProduct(v_bef[0], u_norm), dotProduct(v_bef[0], u_tan)], [dotProduct(v_bef[1], u_norm), dotProduct(v_bef[1], u_tan)]]
  
    let v_aft_rot = [[0,v_bef_rot[0][1]],[0,v_bef_rot[1][1]]]

    //fill in the normal components for the 2 object's final velocities
    v_aft_rot[0][0] = (v_bef_rot[0][0])*(m[0]-m[1]) + 2*m[1]*(v_bef_rot[1][0])
    v_aft_rot[1][0] = (v_bef_rot[1][0])*(m[1]-m[0]) + 2*m[0]*(v_bef_rot[0][0])

    v_aft_rot[0][0] = v_aft_rot[0][0] * 1/(m[0]+m[1])
    v_aft_rot[1][0] = v_aft_rot[1][0] * 1/(m[0]+m[1])

    let v_aft = [[0,0],[0,0]]
    for (let i=0; i<v_aft.length; i++) {
      v_aft[i] = addVector(v_aft[i], scaleBy(u_norm, v_aft_rot[i][0]))
      v_aft[i] = addVector(v_aft[i], scaleBy(u_tan, v_aft_rot[i][1]))
    }

    v_aft = [[0, 0], [0, 0]]

    unit.vx = v_aft[0][0];
    unit.vy = v_aft[0][1];
    other.vx = v_aft[1][0];
    other.vy = v_aft[1][1];
    return v_aft;
    */

    }

    //handleCellInteraction checks any collisions between unit (1 particle) and all particles in the list represented by other
    handleCellInteraction(unit, other) {
        while (other != null)
        {
          
          const curDist = this.calcDist(this.posArr[unit], this.posArr[other]);
          //console.log("curDist=" + curDist + " btwn unit and other where other=" + this.posArr[other]);
          
          if (curDist < this.posArr[unit].radius+this.posArr[other].radius)
          {
            //console.log("IN UniformGrid.js, handleCollisionWithObject(pos1=" + unit + ", pos2=" + other + ");");
            //unit.pos.vx = 0;
            //console.log("unit and other before linearInterpolate");
            //console.log("unit pos=", this.posArr[unit]);
            //console.log("other pos=", this.posArr[other]);

            linearInterpolate(this.posArr[unit], this.posArr[other]);
            
            /*
            console.log("unit and other after linearInterpolate");
            console.log("unit pos=", this.posArr[unit]);
            console.log("other pos=", this.posArr[other]);
            console.log("curDist btwn new updated pos of unit and other= calcDist = ", this.calcDist(this.posArr[unit], this.posArr[other]));
            */

            const v_aft = this.handleCollisionWithObject(this.posArr[unit], this.posArr[other]);
            console.log("v_aft = ", v_aft);
            
            this.posArr[unit].vx = v_aft[0][0];
            this.posArr[unit].vy = v_aft[0][1];
            this.posArr[other].vx = v_aft[1][0];
            this.posArr[other].vy = v_aft[1][1];
            
            /*
            this.done = true;
            this.posArr[unit].done = true;
            this.posArr[other].done = true;
            */
          }
          other = other.next;
        }
    }

    handleCell(i, j) {
        let unit = this.cells[i][j];
        while (unit != null)
        {
            //Handle collision with wall for particle unit

            //Technically, since we know the cell that unit resides in, we only have to check at most 2 walls
            //But since 1) we could already use the information of the unit's position to determine what cell it would reside in even if we didn't use a UniformGrid
            //and 2) reducing the if statements from 4 to 2 or 1 depending on the cell is not a big reduction
            //I will not choose to reduce the number of walls we check

            /*
            const curDir = isCollisionWithWall(this.posArr[unit]);
            console.log("curDir=", curDir);
            if (curDir.foundCollision) {
                console.log("Before linIntWithWall");
                console.log("unit pos=", this.posArr[unit]);
                linearInterpolateWithWall(this.posArr[unit]);
                console.log("After linIntWithWall");
                console.log("unit pos=", this.posArr[unit]);

                handleCollisionWithWall(this.posArr[unit], curDir.dir);
            }
            */

            let other = this.posArr[unit].next;
            //console.log("cell[" + i + "][" + j + "], unit=" + unit);
            this.handleCellInteraction(unit, other);
        
            if (i > 0 && j > 0) this.handleCellInteraction(unit, this.cells[i - 1][j - 1]);
            if (i > 0) this.handleCellInteraction(unit, this.cells[i - 1][j]);
            if (j > 0) this.handleCellInteraction(unit, this.cells[i][j - 1]);
            if (i > 0 && j < this.NUM_CELLS - 1)
            {
                this.handleCellInteraction(unit, this.cells[i - 1][j + 1]);
            }

            unit = this.posArr[unit].next;
        }
    }

    handleCollisions() {
        //Handle 1 frame is the following runtime
        //curUnits = # of Units in Cell[i][j]
        //O(NUM_CELLS*NUM_CELLS*(curUnits across all i,j)^2)

        //if (this.done) return;

        //if (this.testFc > this.maxFc) return;

        //console.log("INSIDE UniformGrid handleCollisions() run");
        
        for (let x = 0; x < this.NUM_CELLS; x++) {
            for (let y = 0; y < this.NUM_CELLS; y++) {
                if (this.cells[x][y] === null) continue;
                //console.log("x,y=" + x + "," + y);
                //console.log("unit.pos=", this.posArr[this.cells[x][y]])
                this.handleCell(x, y);
            }
        }

    }

    printGrid() {
        console.log("PRINTGRID()");
        for (let i=0; i<this.cells.length; i++) {
            for (let j=0; j<this.cells[i].length; j++) {
                if (this.cells[i][j] == null) continue;
                let curEle = this.posArr[this.cells[i][j]];
                const curType = typeof(curEle);
                console.log("cells[" + i + "][" + j + "] = ");
                if (curType === 'number') {
                    console.log(curEle);
                } else {
                    while (true) {
                    console.log(curEle);
                    if (curEle.next == null) break;
                    if (curEle.posInd == curEle.next) break;
                    curEle = this.posArr[curEle.next];
                    }
                }
            }
        }
    }

}