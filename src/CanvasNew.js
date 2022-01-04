import React, {Component} from 'react'
import useCanvas from './useCanvas'
//import resizeCanvas from './resizeCanvas'

const CanvasFunction = (props) => {

    const {key, draw, updateDraw, updatePause} = props;
    //const {canvasRef, clickFunction} = useCanvas({key, draw, updateDraw, updatePause})

    const {canvasRef, clickFunction} = {canvasRef: 1, clickFunction: 2};
    return {canvasRef, clickFunction};
}

class CanvasNew extends Component {
  
    constructor(props) {
        super(props)
        const {draw, updateDraw, clickAction, posArr, CVS_WIDTH, CVS_HEIGHT, NUM_CELLS, ...rest} = props;

        this.clickFunction = props.clickMe;
        
        this.draw = draw;
        this.updateDraw = updateDraw;
        this.clickAction = clickAction;
        this.posArr = posArr;
        this.CVS_WIDTH = CVS_WIDTH;
        this.CVS_HEIGHT = CVS_HEIGHT;
        this.NUM_CELLS = NUM_CELLS;

        const key = "test1";
        //const {canvasRef, clickFunction} = CanvasFunction(key, draw, updateDraw, this.updatePause);
        //this.canvasRef = canvasRef;
        //this.clickFunction = clickFunction;

        this.test = 3;

        //const {canvasRef, clickFunction} = useCanvas({key, draw, updateDraw, updatePause})
        //this.canvasRef = canvasRef;
        //this.clickFunction = clickFunction;
    }

    updatePause = (isPausedNew) => {
        // console.log("IN CANVASNEW props.isRunOut=", props.isRunOut);
        // if (props.isRunOut) {
        //   return;
        // }

        this.setState({...this.state, clickMode: isPausedNew})
        //setClickMode(!clickMode);
        //setClickMode(isPausedNew);
        console.log("In CANVASNEW, updatePause RUN clickMode=", this.state.clickMode)
    }

    render() {
        //return (<div onClick={() => this.clickFunction()}>Testing</div>)
        return <React.Fragment>
        <canvas ref={this.canvasRef} style={{border: '3px solid black'}} {...this.props}
        //onClick={increaseSize}
        />
        <button onClick={this.clickFunction}>
          {("CLICK TO " +"RESUME")
        }</button>
        {/*
        <div>ug.var1= {ug.var1}</div>
        */}
        </React.Fragment>
    }
}

export default CanvasNew