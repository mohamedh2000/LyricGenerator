import React from 'react';

class Clock extends React.Component { 
  constructor(props) { 
    super(props);
    let today = new Date() 
    this.state = {
       minute: today.getMinutes(),
       hour : today.getHours(),
    }
  }

  async componentDidMount(){

    setInterval(()=>{
      let time = new Date()
      this.setState({
       minute: time.getMinutes(),
       hour : time.getHours() 
      });
    },10)

  }

  render() {
    return (
      <div style={{textAlign: "center"}}>
        <p><b>{standartTime(this.state.hour,this.state.minute)}</b></p>
        </div>
    )
  }
}

function standartTime(hours,minutes) { 
  if (hours === 0 && minutes === 0) { 
    return "00:00 am";
  }
  if (hours <= 12) { 
    if (hours >= 10) {
    if (minutes < 10) {
      return hours + ":" + "0" + "minutes" + " am";
    }
    else {
      return hours + ":" + minutes + " am";
    }
   }
    else { 
      if (minutes < 10) {
        return "0" + hours + ":" + "0" + minutes + " am";
      }
      else {
        return "0" + hours + ":" + minutes + " am";
      }
  }
  }
  else { 
    if (minutes < 10) { 
      return (hours - 12) + ":" + "0" + minutes + " pm";
    }
    else { 
      return (hours - 12) + ":" + minutes + " pm";
    }
  }
}

export default Clock;
