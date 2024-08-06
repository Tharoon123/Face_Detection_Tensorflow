import React,{useRef} from 'react'
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/facemesh'
import Webcam from 'react-webcam'
import { drawMesh } from './Utilities'

export default function HomePage() {
    const webcamRef=useRef(null)
    const canvasRef=useRef(null)

    const runFacemesh= async () => {
        const net= await facemesh.load({
            inputResolution:{width:800,height:600}, scale:0.8
        });
        setInterval(()=>{
            detect(net)
        },100)
    }

    const detect = async (net) => {
        if(
            typeof webcamRef.current !== "undefined"&& webcamRef.current!==null &&
            webcamRef.current.video.readyState===4
        ){
            const video=webcamRef.current.video;
            const videoWidth=webcamRef.current.videoWidth;
            const videoHeight=webcamRef.current.videoHeight;

            webcamRef.current.videoWidth=videoWidth;
            webcamRef.current.videoHeight=videoHeight;

            canvasRef.current.videoWidth=videoWidth;
            canvasRef.current.videoHeight=videoHeight;


            const face=await net.estimateFaces(video);
            console.log(face)
            const ctx=canvasRef.current.getContext("2d")
            drawMesh(face,ctx)
        }
    }
    runFacemesh()
  return (
    <div className='App'>
        <header className='App-header'>
        <Webcam ref={webcamRef} style={{
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:0,
            right:0,
            textAlign:'center',
            zIndex:9,
            width: 640,
            height: 480,
        }}/>
        <canvas ref={canvasRef} style={{
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:0,
            right:0,
            textAlign:'center',
            zIndex:9,
            width: 640,
            height: 480,
        }}/>
        </header>
    </div>
  )
}
