import React from 'react'
import UniformGrid from './UniformGrid';

export default class Unit {
    constructor(grid, ind, pos) {
        this.ind = ind;
        this.pos = pos;
        /*
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        */
       
        
        this.prev = null;
        this.next = null;
        
        this.grid = grid; //type UniformGrid
        this.grid.add(this);
    }

    toString() {
        return " ind:"+this.ind+" x:"+this.pos.x+" y:"+this.pos.y;
    }
}