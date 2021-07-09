import React, {Component} from 'react'
import {useEffect} from 'react'

class DisplayGrid extends Component  {
    constructor(props) {
        super(props)

        console.log("DisplayGrid cells=", this.props.cells);
        this.state = {
            count: 1,
            cells: this.props.cells
        }
    }

    /*
    useEffect(() => {
        console.log("UPDATE cellsTest=", cellsTest);
        cells = cellsTest;
    }, [cellsTest])

      //Return array of units based on the unit which is the front of the list
  const getUnitList = (unit) => {
    let curU = unit;

    let uList = []

    while (!(curU == null)) {
      uList.push(curU);
      curU = posArr[curU.next];
    }

    return uList;
  }

  const getDisplay = () => {
      cells = Array.from(cellsTest);
      console.log("getDisplay() run cells=", cells);
    return cells.map((row) =>
    <>
    {row.map((ele) => 
    (getUnitList(posArr[ele]).map((unit) => <span>{"id=" + unit.id + " x=" + unit.x + " y=" + unit.y + " |"}</span>))
    )}
    <br />
  
    </>
    )
  }
  */

  increment() {
      const newCells = this.state.cells;
      newCells[0][0] = 3;
    this.setState({
        count: this.state.count + 1,
        cells: newCells
    })
  }

  render() {
    return (
        <div>
        <p>This.state.count = {this.state.count}</p>
        <p>This.state.cells[0][0] = {this.state.cells[0][0]}</p>

        <button onClick={() => this.increment()}>CLICK ME TO INCREASE THE COUNT PROP OF THIS.STATE</button>
      </div>
    )
  }
}

export default DisplayGrid
