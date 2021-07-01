import React from 'react'
import UniformGrid from './UniformGrid';

export default class Unit {
    constructor(grid, x, y) {
        this.x = x;
        this.y = y;
        this.prev = null;
        this.next = null;

        this.grid = grid; //type UniformGrid
        this.grid.add(this);
    }

    toString() {
        return ""+this.x+" "+this.y;
    }
}