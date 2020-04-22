import React from 'react'
import CanvasReact from './i'
import io from 'socket.io-client';



class App extends React.Component { 

    state = { data:"",eraser:false,socket:null};

    componentDidMount(){
        const socket = io('http://192.168.0.105:9876/');
        socket.on('connect',()=>{
           console.log('connected at client side');
           this.setState({socket});
        })

        socket.on('data_recvd',(data)=>{
            console.log("here i recieved some data from socket");
            this.saveAbleCanvas.loadSaveData(data);
        })
    }

    onClear=()=>{
        this.saveAbleCanvas.clear();
       // this.setState({data:null})
    }

    onGetData=()=>{
        if(!this.saveAbleCanvas) return "";
        let data = this.saveAbleCanvas.getSaveData();
        return data;
    }

    enableEraser= ()=>{
        this.setState((x)=>{
            return {
                data:x.data,
                eraser:true
            }
        })
    }

    onChange =(e)=>{
       const data=this.saveAbleCanvas.getSaveData();
       if(!e.loadedAfterSocketResponse) console.log("undefined get");
       else console.log("not undefined");
       //console.log(e)
      // console.log(data);
       if(this.state.socket&&!e.loadedAfterSocketResponse) this.state.socket.emit('send_data',data);
    }

    getData=()=>{
        if(this.state.data==null) return  ""
        return this.state.data;
    }

    render(){
       // console.log("my datata is",this.state)
        return(
            <div>
                <button  onClick={this.onGetData} >Get Saved Data</button>
                <button  onClick={this.onClear} >Clear</button>
                <button  onClick={this.enableEraser} >Enable eraser</button>
                <CanvasReact immediateLoading={true} saveData={this.state.data}   erase={this.state.eraser} onChange={this.onChange}  canvasWidth={window.innerWidth} canvasHeight={2000}  ref={(CanvasReact)=>this.saveAbleCanvas=CanvasReact}   ></CanvasReact>
            </div>
        )
    }
}


export default App;