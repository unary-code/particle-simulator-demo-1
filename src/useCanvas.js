import { useRef, useEffect, useState } from 'react'

const useCanvas = (props) => {
  
    const key = props.key;

    const draw = props.draw;
    const updateDraw = props.updateDraw;

    const [clickMode, setClickMode] = useState(false);
    //let clickMode = false;
    const [restart, setRestart] = useState(false);

    let frameCount = 0
    const [fc, setFc] = useState(frameCount)

    const clickFunction = () => {
      console.log("clickFunction() run");
      console.log("clickMode before=", clickMode);
      setClickMode(!clickMode);
      console.log("clickMode after=", clickMode);

    }

    useEffect(() => {
      console.log("clickMode after in useEffect=", clickMode);
      console.log("restart before in useEffect= ", restart);
      if (!clickMode) {
        console.log("restart is changed thru setRestart");
        setRestart(!restart);
      }
      console.log("restart after = ", restart);
    }, clickMode);

    /*
    useEffect(() => {
      console.log("IN useCanvas IN useEffect new clickMode=", clickMode);
    });
    */

    //const clickAction = props.clickAction;
    //const clickFlag = props.clickFlag;

  const canvasRef = useRef(null)

  /*
  useEffect(() => {
    clickMode = false;
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //let frameCount = 0
    //frameCount = fc;
    let animationFrameId
    
    const render = () => {
      console.log("INSIDE render()");
      console.log("frameCount=", frameCount);

      frameCount++;
      //setFc(fc+1);
      draw(context, frameCount)
      updateDraw(frameCount)
      //animationFrameId = window.requestAnimationFrame(render);
      
      //setTimeout(() => {console.log("setTimeout LOG");}, 10000);
      //animationFrameId = window.requestAnimationFrame(render);

      //console.log("key=" + props.key + " clickMode=" + props.clickMode);
      if (clickMode) {
        console.log("useCanvas render method RETURN");
        setFc(frameCount);
        console.log("fc after setFc=", fc);
        return;
        //setTimeout(render, 1000);
      } else {
        animationFrameId = window.requestAnimationFrame(render);
      }
      //console.log("INSIDE render after window.requestAnimationFrame call");

    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw, updateDraw, clickMode])
  */

  /*
  useEffect(() => {
    console.log("INSIDE USECANVAS, CLICKED, canvasRef=", canvasRef);

    if (canvasRef !== null && canvasRef !== undefined) {
    const canvas = canvasRef.current
    console.log("canvas=", canvas);
    if (canvas !== null && canvas !== undefined) {
    const context = canvas.getContext('2d')
    console.log("context=", context);
    if (context !== null && context !== undefined) {
    clickAction(context, 0);
    }
    }
    }
  }, [clickFlag])
  */

  return {canvasRef, clickFunction}
}

export default useCanvas