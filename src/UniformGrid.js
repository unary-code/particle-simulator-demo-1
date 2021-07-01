import React from 'react'
import Unit from './Unit'
import {calcMag, dotProduct, scaleBy, addVector} from './App'

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
            const curPos = posArrTest[ind]
            const curUnit = new Unit(this, ind, curPos)
            this.add(curUnit);

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
        for(let i = 0; i < d1; i++) {
            arr.push(new Array(d2));
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
        const cellX = Math.floor(unit.pos.x * this.NUM_CELLS / this.CVS_DIMENSIONS[1]);
        const cellY = Math.floor(unit.pos.y * this.NUM_CELLS / this.CVS_DIMENSIONS[0]);

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

    handleCell(unit) {
        while (unit != null)
        {
          let other = unit.next;
          while (other != null)
          {
            
            const curDist = this.calcDist(unit.pos, other.pos);
            console.log("curDist=" + curDist + " btwn unit and other where unit=" + unit + ", other=" + other);
            if (curDist < 40)
            {
              this.handleCollisionWithObject(unit.pos, other.pos);
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

        console.log("INSIDE UniformGrid handleCollisions() run");

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