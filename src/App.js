import './App.css';
import Canvas from './Canvas.js'
import CanvasNew from './CanvasNew.js'
import React, {useState, useRef} from 'react'
import UniformGrid from './UniformGrid.js'
import DisplayGrid from './DisplayGrid.js'

export const CVS_WIDTH = 700;
export const CVS_HEIGHT = 700;
const CVS_DIMENSIONS = [CVS_HEIGHT, CVS_WIDTH];

export const scaleBy = (v, factor) => {
  let newV = Array.from(v);
  for (let i=0; i<v.length; i++) {
    newV[i] = (v[i] * factor);
  }

  return newV;
}

export const calcMag = (v) => {
  let mag = 0;
  for (let i=0; i<v.length; i++) {
    mag += (v[i]*v[i]);
  }

  mag = Math.sqrt(mag);

  return mag;
}

export const dotProduct = (v1, v2) => {
  let prod = 0;

  for (let i=0; i<v1.length; i++) {
    prod += (v1[i]*v2[i])
  }

  return prod;
}

export const addVector = (v1, v2) => {
  let v_sum = new Array(v1.length);

  for (let i=0; i<v1.length; i++) {
    v_sum[i] = v1[i] + v2[i];
  }

  return v_sum;
}

export const solveQuadratic = (a,b,c) => {
  const discrim = b*b - 4*a*c;

  let t = new Array(2);

  const center = -b/(2*a);
  const add = Math.sqrt(discrim)/(2*a);

  if (discrim < 0) {
    return null;
  } else {
    t[0] = center - add;
    t[1] = center + add;
    return t;
  }

}

export const linearInterpolateWithWall = (pos1) => {
  //const pos1 = posArr[i1];
  const v_x = pos1.vx;
  const v_y = pos1.vy;

  const r_1 = pos1.radius;

  let t = 0;

  if (pos1.x-pos1.radius < 0) {
    console.log("LEFT WALL");
    t = Math.max(t, (pos1.x - r_1) / (v_x));
  }

  if (pos1.x+pos1.radius > CVS_WIDTH) {
    console.log("RIGHT WALL");
    t = Math.max(t, (r_1 + pos1.x - CVS_WIDTH) / (v_x));
  }

  if (pos1.y-pos1.radius < 0) {
    console.log("TOP WALL");
    t = Math.max(t, (pos1.y - r_1) / (v_y));
  }

  if (pos1.y+pos1.radius > CVS_HEIGHT) {
    console.log("BOTTOM WALL");
    t = Math.max(t, (r_1 + pos1.y - CVS_HEIGHT) / (v_y));
  }

  console.log("t=", t);
  pos1.x = -v_x*t + pos1.x;
  pos1.y = -v_y*t + pos1.y;


}

//linearInterpolate creates a parameterization for 2 objects colliding (which is different than for object and wall colliding)
export const linearInterpolate = (pos1, pos2) => {
  
  /*
  Shift frame of reference velocity by [-v_2_x, -v_2_y]

  From here on, v_x and v_y represent the transformed velocity of object 1
  Parameterization for object 1
  x = -v_x * t + x_1
  y = -v_y * t + y_1

  Parameterization for object 2
  x = x_2
  y = y_2

  dist between object 1 and object 2 centers = dist = sqrt((-v_x * t + x_1 - x_2)^2 + (-v_y * t + y_1 - y_2)^2)
  r_t = r_1 + r_2
  At t=0, dist is the distance NOW. If the two objects are detected as colliding in this frame, then dist at t=0 should be <= r_t
  
  v^2 = v_x^2 + v_y^2
  p_diff = dist at t=0 = sqrt((x_1-x_2)^2 + (y_1-y_2)^2)
  c = constant = v_x * (x_2 - x_1) + v_y * (y_2 - y_1)

  (v^2)*t^2 + 2*c*t + (p_diff)^2 - (r_t)^2 >= 0
  */

  //const pos1 = posArr[i1];
  //const pos2 = posArr[i2];

  const v_x = pos1.vx - pos2.vx;
  const v_y = pos1.vy - pos2.vy;
  const v = [v_x, v_y];
  const v_mag = calcMag(v);

  const p_diff_mag = calcMag([pos1.x-pos2.x, pos1.y-pos2.y]);
  const c = v_x*(pos2.x-pos1.x) + v_y*(pos2.y-pos1.y);

  const r_t = pos1.radius + pos2.radius;

  const t = (solveQuadratic(v_mag*v_mag, 2*c, p_diff_mag*p_diff_mag - r_t*r_t))[1];

  /*
  pos1.x = pos1.x + 100;
  pos1.y = pos1.y + 50;
  pos2.x = pos2.x + 150;
  pos2.y = pos2.y + 200;
  */

  if (t === null) {
    //throw error or return null or return false or return nothing

  } else {
    const t_use = t + 0.01;
    pos1.x = -pos1.vx*t_use + pos1.x;
    pos1.y = -pos1.vy*t_use + pos1.y;

    pos2.x = -pos2.vx*t_use + pos2.x;
    pos2.y = -pos2.vy*t_use + pos2.y;

    //updated positions
  }
  
}

export const handleCollisionWithWall = (pos1, dir) => {
  //CVS_WIDTH and CVS_HEIGHT

  for (let i=0; i<dir.length; i++) {
    //0 reps vert on top
    if (!dir[i].collide) {
      continue;
    }

    //console.log("in for loop in handleCollisionWithWall, i=", i);
    const needDir = 1 - (Math.floor(i/2)*2);
    //i=0,1 needDir = 1
    //i=2,3 needDir = -1

    if (i % 2 === 0) {
      pos1.vy = needDir*Math.abs(pos1.vy);
    }

    if (i % 2 === 1) {
      pos1.vx = needDir*Math.abs(pos1.vx);
    }

    //console.log("pos1.x= " + pos1.x + " | pos1.y= " + pos1.y + " | pos1.vx= " + pos1.vx + " | pos1.vy=" + pos1.vy)
  }
  
}

export const isCollisionWithWall = (pos1) => {
  //const pos1 = posArr[i1];
  //CVS_WIDTH and CVS_HEIGHT

  let dir = [{collide: false}, {collide: false}, {collide: false}, {collide: false}];
  /*
  console.log("BEFORE UPDATE dir=", dir);
  dir = dir.fill({collide: '2'})
  */
  //console.log("BEFORE UPDATE dir=", dir);

  let foundCollision = false;

  if (pos1.x-pos1.radius < 0) {
    //handle collision with vertical wall
    //flip the horizontal component of velocity

    //console.log("i=1");
    dir[1].collide = true;
    foundCollision = true;
  }
  
  console.log("In isCollisionWithWall function, CVS_DIMENSIONS=", CVS_DIMENSIONS);

  if (pos1.x+pos1.radius > CVS_DIMENSIONS[1]) {
    //console.log("i=3");

    dir[3].collide = true;
    foundCollision = true;

  }

  //if ball collides with both vertical and horizontal wall (in corner), then flip both components of the ball's velocity
  if (pos1.y-pos1.radius < 0) {
    //handle collision with horizontal wall
    //flip the vertical component of velocity

    //console.log("i=0");

    dir[0].collide = true;
    foundCollision = true;

  }
  
  if (pos1.y+pos1.radius > CVS_DIMENSIONS[0]) {
    //console.log("i=2");

    dir[2].collide = true;
    foundCollision = true;

  }

  //console.log(foundCollision);
  //console.log("dir=", dir);
  return {foundCollision: foundCollision, pos1: pos1, dir: dir};
}

function App() {

  //const [isPaused, setIsPaused] = useState(false);

  const canvasRef = useRef(null)
  const uniformGridRef = useRef(null)

  let isRunOut = false;

  const BALL_RADIUS = 40;

  const NUM_CELLS = 4;

  let ug;

  //let testV = useRef({a1: 3, a2: 5})
  //state = {test: '111'}

  // ctx.beginPath();
  // ctx.moveTo(0, 0);
  // ctx.lineTo(300, 150);
  // ctx.stroke();

  //let posArr = [{x: 30, y:80, color: 'radfasdfadsf', vx: 5, vy: 3, radius: 20, mass: 10, done: false}, {x: 150, y: 100, vx: -1, vy: .5, radius: 20, mass: 10, done: false}]

  /*
  let posArr = [
    {x: 670, y:80, color: 'radfasdfadsf', vx: -1, vy: 0.5, radius: 70, mass: 10, done: false, id: 1},
    {       color: "#ff00ff", id: 2, mass: 10, radius: 30, vx: 0.05, vy: -0.05, x: 79, y: 116     },
    {color: "#ff00ff",     id: 3,     mass: 10,     radius: 30,     vx: 0.5,     vy: 0.5,     x: 70,     y: 20},
    {       color: "#ff00ff", id: 4, mass: 10, radius: 70, vx: -0.05, vy: -0.1, x: 635, y: 538     }
  ]
  */

  
  let posArr = [
    {x: 600, y:80, color: 'radfasdfadsf', vx: 0, vy: 0.1, radius: 10, mass: 10, done: false, id: 1},
    {       color: "#ff00ff", id: 2, mass: 10, radius: 10, vx: 0.025, vy: -0.025, x: 79, y: 116     },
    {color: "#ff00ff",     id: 3,     mass: 10,     radius: 30,     vx: 0.025,     vy: 0.05,     x: 90,     y: 31},
    {       color: "#ff00ff", id: 4, mass: 10, radius: 10, vx: 0, vy: 0, x: 600, y: 538     },
    {       color: "#ff00ff", id: 5, mass: 10, radius: 20, vx: 0, vy: 0, x: 300, y: 500     },
    {       color: "#ff00ff", id: 6, mass: 10, radius: 30, vx: -0.1, vy: -0.2, x: 100, y: 610     },
    {       color: "#ff00ff", id: 7, mass: 10, radius: 30, vx: -0.2, vy: 0.05, x: 40, y: 250     }

  ]


/*
let posArr = [
  {x: 600, y:80, color: 'radfasdfadsf', vx: 0, vy: 0.1, radius: 10, mass: 10, done: false, id: 1},
  {       color: "#ff00ff", id: 2, mass: 10, radius: 10, vx: 0, vy: 0, x: 600, y: 538     },
  {       color: "#ff00ff", id: 3, mass: 10, radius: 30, vx: -0.1, vy: -0.2, x: 100, y: 585     },
  {       color: "#ff00ff", id: 4, mass: 10, radius: 30, vx: -0.2, vy: 0.05, x: 40, y: 35     }

]
*/

  /*
  let posArr = [
    {x: 600, y: 150, color: 'radfasdfadsf', vx: 0, vy: 0.1, radius: 70, mass: 10, done: false, id: 1},
    {       color: "#ff00ff", id: 2, mass: 10, radius: 30, vx: 0, vy: 0, x: 79, y: 116     },
    {color: "#ff00ff",     id: 3,     mass: 10,     radius: 30,     vx: 0.7702,     vy: 0.449608,     x: 415.080165,     y: 196.355},
    {       color: "#ff00ff", id: 4, mass: 10, radius: 70, vx: 0, vy: 0, x: 600, y: 538     }
  ]
*/

/*
  let posArr = [
    {color: "#ff00ff",     id: 2,     mass: 10,     radius: 30,     vx: 1.5404/2,     vy: -0.899216/2,     x: 464.393,     y: 367.652},
    {x: 600, y: 322.599, color: 'radfasdfadsf', vx: 0, vy: 0.1, radius: 70, mass: 10, done: false, id: 1}
  ]
*/

  const generatePos = (N) => {

    for (let i=0; i<N; i++) {
      let randPos = {x: BALL_RADIUS+Math.random()*(CVS_WIDTH-2*BALL_RADIUS), y: BALL_RADIUS+Math.random()*(CVS_HEIGHT-2*BALL_RADIUS), vx: Math.random()*10/100, vy: Math.random()*10/100, radius: BALL_RADIUS, mass: 10}
      randPos.color = '#ff00ff'
      randPos.id = posArr.length+1;
      posArr.push(randPos)
    }
  }

  const speedUp = (factor) => {
    posArr = (posArr.map((ele) => {return {...ele, vx: ele.vx*factor, vy: ele.vy*factor}}));
  }

  const isValidColor = (strColor) => {
    var s = new Option().style;
    s.color = strColor;
    //console.log("s.color = " + s.color + " strColor = " + strColor);

    //s.color will be the rgb format 'rgb(255, 0, 0)'
    //test if given color strColor follows rgb format
    if (s.color == strColor) {
      return true;
    }

    //test if given color strColor follows hex code format '#ff0000'
    let numLength = strColor.length;
    //console.log("strColor.substr(1) = ", strColor.substr(1))
    let parsedNum = parseInt(strColor.substr(1), 16);
    //console.log("parsedNum=", parsedNum);

    if(parsedNum !== null && strColor.length == 7 && strColor.charAt(0) === '#'){
      return true;
    }

    return false;
  }

  const draw = (ctx, frameCount = 0) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.strokeStyle = 'green'
    for (let i=0; i<NUM_CELLS; i++) {
      ctx.beginPath()
      ctx.moveTo(0, CVS_HEIGHT*i/NUM_CELLS);
      ctx.lineTo(CVS_WIDTH, CVS_HEIGHT*i/NUM_CELLS);
      ctx.stroke()
    }
    for (let i=0; i<NUM_CELLS; i++) {
      ctx.beginPath()
      ctx.moveTo(CVS_WIDTH*i/NUM_CELLS, 0);
      ctx.lineTo(CVS_WIDTH*i/NUM_CELLS, CVS_HEIGHT);
      ctx.stroke()
    }
    
    //console.log("draw function");

    for (let i=0; i<posArr.length; i++) {
     
      //console.log("i=", i);
      let curColor = posArr[i].color;
      if (!curColor || !isValidColor(curColor)) {
        curColor = '#00ff00'
      }
    ctx.fillStyle = curColor

    let curId = posArr[i].id || 'Null';

    //console.log("ctx.fillStyle = curColor = ", curColor);
    
    //ctx.fillStyle = (posArr[i].color) || '#00ff00'
    ctx.beginPath()
    ctx.arc(posArr[i].x, posArr[i].y, posArr[i].radius, 0, 2*Math.PI)
    ctx.fill()
    ctx.moveTo(posArr[i].x, posArr[i].y)

    const v = [posArr[i].vx, posArr[i].vy]
    const u_v = scaleBy(v, 1/(calcMag(v)))

    ctx.lineTo(posArr[i].x+ 100*(u_v[0]), posArr[i].y + 100*(u_v[1]));
    ctx.stroke();

    ctx.fillStyle = '#000000'
    ctx.font = "20px Arial";
    ctx.fillText("ID=" + curId, posArr[i].x, posArr[i].y);
    }
    //console.log("frameCount=", frameCount);

    //console.log("posArr=", posArr);
  }

  // const drawParticles = (ctx, frameCount) => {

  // }

  const handleCollisionWithObject = (i1, i2) => {
    //To represent vectors, use arrays not properties of x and y
    
    const m = [posArr[i1].mass, posArr[i2].mass]

    //p_diff = position vector to get from center of object 1 to center of object 2
    const p_diff = [posArr[i2].x-posArr[i1].x, posArr[i2].y-posArr[i1].y]

    //v_bef = array of velocity vectors for initial velocities of object 1 and object 2
    const v_bef = [[posArr[i1].vx, posArr[i1].vy], [posArr[i2].vx, posArr[i2].vy]]

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
  }

  const isCollisionWithObject = (i1, i2) => {
    const pos1 = posArr[i1];
    const pos2 = posArr[i2];

    /*
    if ((pos1.x+pos1.radius)>(pos2.x-pos2.radius) && (pos1.x-pos1.radius)<(pos2.x+pos2.radius)) {
        if ((pos1.y+pos1.radius)>(pos2.y-pos2.radius) && (pos1.y-pos1.radius)<(pos2.y+pos2.radius)) {
            return true;
        }
    }*/

    const p_diff = [posArr[i2].x-posArr[i1].x, posArr[i2].y-posArr[i1].y]
    const p_diff_mag = calcMag(p_diff);
    if (p_diff_mag < posArr[i1].radius+posArr[i2].radius) {
      /*
      In order to return false after a collision has already updated the velocities,
      Check if p_diff_mag is going to increase or decrease
      If p_diff_mag is going to decrease, don't detect as collision
      
      Nvm, this method will return false even when there is a collision
      */

      return true;
    }

    return false;
  }

  const handleCollisions = () => {
    let collisionWithObject = [];
    let collisionWithWall = [];

    for (let i=0; i<posArr.length; i++) {
      let pos1 = posArr[i];

      //console.log("pos1 pos = [" + pos1.x + " , " + pos1.y + " ]");
      const curIsCollisionWithWall = isCollisionWithWall(posArr[i]);

      if (curIsCollisionWithWall.foundCollision) {
        
        collisionWithWall.push(curIsCollisionWithWall);
        
      }

      /*
      for (let j=i+1; j<posArr.length; j++) {
        const pos2 = posArr[j];
        const curIsCollisionWithObject = isCollisionWithObject(i, j);
        if (curIsCollisionWithObject) {
            collisionWithObject.push({i1: i, i2: j})
        }

      }
      */
    }

    for (let i=0; i<collisionWithWall.length; i++) {
      const curCollision = collisionWithWall[i];
      //const i1 = curCollision.i1;
      const pos1 = curCollision.pos1;
      const dir = curCollision.dir;

      linearInterpolateWithWall(pos1);
      handleCollisionWithWall(pos1, dir);
    }

    /*
    for (let i=0; i<collisionWithObject.length; i++) {
      const curCollision = collisionWithObject[i];
      const i1 = curCollision.i1;
      const i2 = curCollision.i2;
      //Do linear interpolation to set the position(s) of one or more of the object(s) such that
      //now the two objects don't overlap
      linearInterpolate(posArr[i1], posArr[i2]);

      //if (posArr[i1].done) continue;

      const v_arr = handleCollisionWithObject(i1, i2);
      posArr[i1].vx = v_arr[0][0];
      posArr[i1].vy = v_arr[0][1];
      posArr[i2].vx = v_arr[1][0];
      posArr[i2].vy = v_arr[1][1];
      posArr[i1].done = true;
      posArr[i2].done = true;
    }
    */
  }
  
  const getUnitList = (unit) => {
    let curU = unit;

    let uList = []

    while (!(curU == null)) {
      uList.push(curU);
      curU = posArr[curU.next];
    }

    return uList;
  }

  const DisplayG = ({stations}) => (
  <>
    {stations.map((station, ind) => (
      <span className="station" key={ind}>{station.x + " |"}</span>
    ))}
  </>
  );

  const updateDraw = (frameCount, timeRate) => {
  
    /*
    let posArrCopy = Array.from(posArr);
    for (let i=0; i<posArr.length; i++) {
      const v = {x: (posArrCopy[i].vx), y: (posArrCopy[i].vy)};

      posArrCopy[i].x+=v.x;
      posArrCopy[i].y+=v.y;

    }
  
    //console.log(posArr);
    posArr = posArrCopy;
    */

    // setPosArr(posArrCopy);

    //posArr = ug.updateDraw(timeRate);

    //console.log("IN App updateDraw, ug.cells=", ug.cells);
    //console.log("posArr=", posArr);

    uniformGridRef.current.updateDraw(timeRate);

    //uniformGridRef.current.incrementVar();
    //console.log("uniformGridRef.current.state = ", uniformGridRef.current.state);

    //this.refs.uniformgrid.incrementVar();

    //handleCollisions(posArr);
    //ug.handleCollisions();

      //testV.current = {a1: posArr[0].y, a2: testV.current.a2};
    
  }

  const updateFrame = () => {
    draw();
    updateDraw();
  }



  const updateRunOut = (isRunOutNew) => {
    console.log("IN APP.JS, updateRunOut RUN");

    console.log("uniformGridRef.current=", uniformGridRef.current);
    console.log("canvasRef.current=", canvasRef.current);

    //setIsPaused(isPausedNew);

    //canvasRef.current.updateRunOut(isRunOutNew);

    isRunOut = isRunOutNew;
    console.log("IN APP.JS, isRunOut=", isRunOut);
  }

  const setup = () => {

  generatePos(0);
  speedUp(20);
  console.log("after generatePos, posArr=", posArr);
  //ug = new UniformGrid(posArr, CVS_WIDTH, CVS_HEIGHT, NUM_CELLS);

  //ug.printGrid();
  
  //this.setState({test: '123'})
  }

  setup();
  
  /*

      cells.map((row) =>
    <>
    {row.map((ele) => 
    (getUnitList(posArr[ele]).map((unit) => <span>{"id=" + unit.id + " x=" + unit.x + " y=" + unit.y + " |"}</span>))
    )}
    <br />
  
    </>
    )

    [[0,3],[2,1]][0]

    ug.cells[0].map((ele, ind) => (<span key={ind}>{posArr[ele].x+" |"}</span>))
  
      <DisplayG stations={posArr} />
      
    */
  return (
    <div className="App">
      {/*
      <CanvasNew ref={canvasRef} clickMe={() => {console.log(canvasRef)}}
      isRunOut={isRunOut}
      draw={draw} updateDraw={updateDraw} clickAction={updateFrame} width={CVS_WIDTH} height={CVS_HEIGHT} posArr={posArr} CVS_WIDTH={CVS_WIDTH} CVS_HEIGHT={CVS_HEIGHT} NUM_CELLS={NUM_CELLS}
      />
      */}
      
      <Canvas
      ref={canvasRef}
      //key={isRunOut}
      isRunOut={isRunOut}
      draw={draw} updateDraw={updateDraw} clickAction={updateFrame} width={CVS_WIDTH} height={CVS_HEIGHT} posArr={posArr} CVS_WIDTH={CVS_WIDTH} CVS_HEIGHT={CVS_HEIGHT} NUM_CELLS={NUM_CELLS}
      //isPaused={isPaused}
      />
      
      <UniformGrid ref={uniformGridRef} posArr={posArr} CVS_WIDTH={CVS_WIDTH} CVS_HEIGHT={CVS_HEIGHT} NUM_CELLS={NUM_CELLS} updateRunOut={updateRunOut}/>
      
      {/*
      <DisplayGrid cells={ug.getCells()}/>
      */}
    </div>
  );
}

export default App;
