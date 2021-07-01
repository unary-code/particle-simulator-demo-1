import React, { useRef, useEffect, useState } from 'react'
import useCanvas from './useCanvas'
import resizeCanvas from './resizeCanvas'

const Canvas = props => {
  
    const {draw, updateDraw, clickAction, ...rest} = props;

    const [clickFlag, setClickFlag] = useState(false);

    let clickMode = false;

    let key = 'shit'

    // const draw = props.draw;
    // const updateDraw = props.updateDraw;
    
    //console.log("draw=", draw);
    //console.log("updateDraw=", updateDraw);
  const {canvasRef, clickFunction} = useCanvas({key, draw, updateDraw})

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
     
  return <React.Fragment>
    <canvas ref={canvasRef} style={{border: '3px solid black'}} {...props} onClick={increaseSize}/>
    <button onClick={clickFunction}>TEST</button>
    </React.Fragment>
}

export default Canvas