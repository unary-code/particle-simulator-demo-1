import React, { useRef, useEffect, useState } from 'react'
import useCanvas from './useCanvas'
import resizeCanvas from './resizeCanvas'

const Canvas = (props) => {
  
    const {draw, updateDraw, clickAction, posArr, CVS_WIDTH, CVS_HEIGHT, NUM_CELLS, ...rest} = props;

    // CLICKFLAG IS UNUSED (DELETE IT)
    const [clickFlag, setClickFlag] = useState(false);

    //let clickMode = false;

    let key = 'test';

    const [clickMode, setClickMode] = useState(false);

    //const [isRunOut, setIsRunOut] = useState(false);

    const [testRunOut, setTestRunOut] = useState(props.isRunOut);

    const updatePause = (isPausedNew) => {
      console.log("IN CANVAS props.isRunOut=", props.isRunOut);
      if (props.isRunOut) {
        return;
      }
      //setClickMode(!clickMode);
      setClickMode(isPausedNew);
      console.log("In CANVAS, updatePause RUN clickMode=", clickMode)
    }

    /*
    const updateRunOut = (isRunOutNew) => {
      setIsRunOut(isRunOutNew);
      setClickMode(true);
      console.log("In CANVAS, updatePause RUN isRunOutNew=", isRunOutNew)
    }
    */

    // const draw = props.draw;
    // const updateDraw = props.updateDraw;
    
    //console.log("draw=", draw);
    //console.log("updateDraw=", updateDraw);
  const {canvasRef, clickFunction} = useCanvas({key, draw, updateDraw, updatePause})

  //call resizeCanvas function everytime Canvas is updated
    //resizeCanvas function sets the CSS attributes width and height equal to the practical JS clientRect width and height
  
  /*
    useEffect(() => {
      resizeCanvas(canvasRef.current);
  })
*/

  useEffect(() => {
    console.log("canvasRef=", canvasRef);
    //clickAction(canvasRef.current.getContext('2d'))
  }, clickFlag)

  const increaseSize = () => {
    canvasRef.current.width+=100;

        
    const { width, height } = canvasRef.current.getBoundingClientRect()
    console.log("canvasRef.current.width" + canvasRef.current.width + " width=" + width);
  }

  //  <button onClick={() => {console.log("CLICK ME BUTTON CLICKED BEFORE CLICK clickFlag=", clickFlag); clickFlag = !clickFlag; console.log("AFTER CLICK, clickFlag=", clickFlag);}}>CLICK ME</button>
  // <button onClick={() => { const canv = canvasRef.current; console.log("canvasRef.current=", canv); clickAction(canv.getContext('2d')); }}>CLICK ME</button>
    // <button onClick={() => {console.log("clickMode before", clickMode); key = key+'d'; clickMode = !clickMode; console.log("clickMode after", clickMode);}}>TEST</button>
     
    /*
    const updatePause = (isPausedNew) => {
      setClickMode(isPausedNew);
    }
    */

    useEffect(() => {
      console.log("In CANVAS, useEffect clickMode=", clickMode);
    }, [clickMode]);

    useEffect(() => {
      console.log("In CANVAS, useEffect isPaused=", props.isPaused);
    }, [props.isPaused]);

    useEffect(() => {
      console.log("In CANVAS, useEffect isRunOut=", props.isRunOut);
    }, props.isRunOut);

    useEffect(() => {
      console.log("In CANVAS, useEffect testRunOut=", testRunOut);
    }, testRunOut);

  return <React.Fragment>
    <canvas ref={canvasRef} style={{border: '3px solid black'}} {...props} onClick={increaseSize}/>
    <button onClick={clickFunction}>
      {props.isRunOut?("CLICK WON'T RESUME THE SIMULATION BECAUSE MAXIMUM TIME REACHED."):("CLICK TO " + ((clickMode)?"RESUME":"PAUSE"))
    }</button>
    {/*
    <div>ug.var1= {ug.var1}</div>
    */}
    </React.Fragment>
}

export default Canvas