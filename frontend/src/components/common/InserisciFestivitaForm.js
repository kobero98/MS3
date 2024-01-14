import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Button} from "@mui/material";
import React, {useState} from "react";
import {toast} from "react-toastify";
import {HolidaysAPI} from "../../API/HolidaysAPI";
import {Calendar} from "react-multi-date-picker";

const monthNum = {
  1 : "Gennaio",
  2 : "Febbraio",
  3 : "Marzo",
  4 : "Aprile",
  5 : "Maggio",
  6 : "Giugno",
  7 : "Luglio",
  8 : "Agosto",
  9 : "Settembre",
  10 : "Ottobre",
  11 : "Novembre",
  12 : "Dicembre"
}

function checkDataIsCorrect(holiday) {

  if(holiday.recurrent) {
    if(holiday.endMonth < holiday.startMonth) {
      toast("La festività deve cominciare prima della sua fine!", {
        position : "top-center",
        autoClose: 1500,
        style : {background : "red", color : "white"}
      }) ;
      return false ;
    }
    if(holiday.endMonth === holiday.startMonth) {
      if(holiday.startDay > holiday.endDay) {
        toast("La festività deve cominciare prima della sua fine!", {
          position : "top-center",
          autoClose: 1500,
          style : {background : "red", color : "white"}
        }) ;
        return false ;
      }
    }
  }

  if(holiday.name === '') {
    toast("Inserire un nome per la festività!", {
      position : "top-center",
      autoClose: 1500,
      style : {background : "red", color : "white"}
    }) ;
    return false ;
  }

  if(holiday.kind === '') {
    toast("Inserire la tipologia di festività!", {
      position : "top-center",
      autoClose: 1500,
      style : {background : "red", color : "white"}
    }) ;
    return false ;
  }

  return true ;
}

function DayMonthPicker({labelText, pickerState, childrenState, parentState}) {

  const [day, setDay] = [pickerState.day, pickerState.setDay] ;
  let days = prepareDaysArray(pickerState.month) ;
  const [month, setMonth] = [pickerState.month, pickerState.setMonth] ;

  function extractDaysFrom(days) {
    return (
      days.map((day) => {
        return <MenuItem value={day}>{day}</MenuItem>
      })
    )
  }

  function extractMonths() {
    let i = 1 ;
    if(parentState !== undefined) {
      i = parentState.month ;
    }
    let retVal = []
    for (i ; i <= 12 ; i++) {
      retVal.push(<MenuItem value={i}>{monthNum[i]}</MenuItem>) ;
    }
    return retVal ;
  }

  function changeChildren(newMonth, newDay) {
    if(childrenState !== undefined) {
      if(childrenState.month < newMonth || (childrenState.month === newMonth && childrenState.day < newDay)) {
        childrenState.setDay(newDay) ;
        childrenState.setMonth(newMonth) ;
      }
    }
  }

  function changeDay(event) {
    setDay(event.target.value) ;
    changeChildren(month, event.target.value) ;
  }

  function prepareDaysArray(monthName) {
    let i = 1 ;
    if(parentState !== undefined && parentState.month === monthName) {
      i = parentState.day ;
    }
    let newDays = [] ;
    switch (monthName) {
      case 1 :
      case 3 :
      case 5 :
      case 7 :
      case 8 :
      case 10 :
      case 12 :
        newDays = [] ;
        for (i; i <= 31 ; i++) {
          newDays.push(i) ;
        }
        return newDays ;
      case 4 :
      case 6 :
      case 9 :
      case 11 :
        newDays = [] ;
        for (i; i <= 30 ; i++) {
          newDays.push(i) ;
        }
        return newDays ;
      case 2 :
        newDays = [] ;
        for (i; i <= 29 ; i++) {
          newDays.push(i) ;
        }
        return newDays ;
    }
  }

  function changeMonth(event) {
    setMonth(event.target.value);

    if(parentState !== undefined) {
      if(day < parentState.day && event.target.value === parentState.month) {
        setDay(parentState.day) ;
        return;
      }
    }

    switch (event.target.value) {
      case 1 :
      case 3 :
      case 5 :
      case 7 :
      case 8 :
      case 10 :
      case 12 :
        break ;
      case 4 :
      case 6 :
      case 9 :
      case 11 :
        if(day > 30) {
          setDay(30) ;
          changeChildren(event.target.value, 30) ;
          return ;
        }
        break ;
      case 2 :
        if(day > 29) {
          setDay(29) ;
          changeChildren(event.target.value, 29) ;
          return ;
        }
        break ;
    }

    changeChildren(event.target.value, day) ;
  }

  return (
    <div style={{display : "flex", width : 250, paddingBottom : 5, paddingTop : 5, flexDirection : "column"}}>
      <div style={{fontSize : 12, color : "gray"}}>{labelText}</div>
      <div style={{display : "flex", flexDirection : "row"}}>
        <Select
          value={day}
          onChange={changeDay}
          fullWidth
        >
          {extractDaysFrom(days)}
        </Select>
        <Select
          value={month}
          onChange={changeMonth}
          fullWidth
        >
          {extractMonths()}
        </Select>
      </div>
    </div>
  )
}

function RecurrentResult({recurrent, pickerState, datesState}) {

  const startPickerState = {} ;

  startPickerState.day = pickerState.startDay ;
  startPickerState.setDay = pickerState.setStartDay ;
  startPickerState.month = pickerState.startMonth ;
  startPickerState.setMonth = pickerState.setStartMonth ;

  const endPickerState = {} ;

  endPickerState.day = pickerState.endDay ;
  endPickerState.setDay = pickerState.setEndDay ;
  endPickerState.month = pickerState.endMonth ;
  endPickerState.setMonth = pickerState.setEndMonth ;

  function updateDates(values) {
    datesState.setDates(values.map((value) => {
      return value.toDate() ;
    }))
  }

  if(recurrent) {
    return (
      <div style={{paddingTop : 42}}>
        <DayMonthPicker labelText={"Inizio festività"} pickerState={startPickerState} childrenState={endPickerState}/>
        <DayMonthPicker labelText={"Fine festività"} pickerState={endPickerState} parentState={startPickerState}/>
      </div>
    )
  } else {
    return (<Calendar
      minDate={new Date()}
      range
      value={datesState.dates}
      onChange={updateDates}
    />)
  }
}

function CalendarOrPicker({recurrent, setRecurrent, pickerState, datesState}) {

  return (
    <div style={{display: "flex", alignItems : "center", flexDirection : "column"}}>
      <div style={{display : "flex", flexDirection : "row", paddingBottom : 10}}>
        <div style={{paddingRight : 10}}>La festività è ricorrente</div>
        <input type={"checkbox"} name={"recurrent"}
               checked={recurrent} onChange={e => {
          setRecurrent(!recurrent)
          return !(e.target.checked)
        }}/>
      </div>
      <RecurrentResult recurrent={recurrent} pickerState={pickerState} datesState={datesState}/>
    </div>
  );
}

export default function InserisciFestivitaForm() {

  const [kind, setKind] = React.useState('');
  const [name, setName] = useState('') ;
  const [location, setLocation] = useState('') ;
  const [recurrent, setRecurrent] = useState(false) ;

  //Recurrent state
  const [startMonth, setStartMonth] = useState(1) ;
  const [startDay, setStartDay] = useState(1) ;
  const [endMonth, setEndMonth] = useState(1) ;
  const [endDay, setEndDay] = useState(1) ;

  //Non-recurrent state
  const [dates, setDates] = useState([]) ;

  const pickerState = {} ;
  pickerState.startDay = startDay ;
  pickerState.setStartDay = setStartDay ;
  pickerState.startMonth = startMonth ;
  pickerState.setStartMonth = setStartMonth ;

  pickerState.endDay = endDay ;
  pickerState.setEndDay = setEndDay ;
  pickerState.endMonth = endMonth ;
  pickerState.setEndMonth = setEndMonth ;

  const datesState = {} ;
  datesState.dates = dates ;
  datesState.setDates = setDates ;

  async function onSaveClick() {
    const holiday = {} ;

    holiday.name = name ;
    holiday.location = location ;
    holiday.kind = kind ;
    holiday.recurrent = recurrent ;

    if(recurrent) {
      holiday.startMonth = startMonth ;
      holiday.startDay = startDay ;
      holiday.endMonth = endMonth ;
      holiday.endDay = endDay ;
    }
    else {
      if(dates.length > 2 || dates.length <= 0) {
        toast("Inserisci le date nel calendario!", {
          position : "top-center",
          autoClose: 1500,
          style : {background : "red", color : "white"}
        }) ;
        return ;
      }
      holiday.startEpochDay = dates[0].getTime() / 86400000 ;
      if(dates.length === 1) {
        holiday.endEpochDay = dates[0].getTime() / 86400000 ;
      } else {
        holiday.endEpochDay = dates[dates.length -1] / 86400000 ;
      }

    }

    if(checkDataIsCorrect(holiday)) {
      const code = await ((new HolidaysAPI()).saveCustomHoliday(holiday)) ;

      if(code !== 200) {
        toast("Errore nel salvataggio della festività", {
          position : "top-center",
          autoClose: 1500,
          style : {background : "red", color : "white"}
        })
      }
      else {
        toast("Festività salvata con successo!", {
          position : "top-center",
          autoClose: 1500,
          style : {background : "green", color : "white"}
        })
      }
    }
  }

  const handleChange = (event) => {
    setKind(event.target.value);
  };

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        overflowX: "scroll",
        paddingTop: 20
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          paddingRight: "7px"
        }}>
          <CalendarOrPicker recurrent={recurrent} setRecurrent={setRecurrent}
                            pickerState={pickerState} datesState={datesState}/>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 300,
          paddingLeft: "7px",
          paddingTop: 30
        }}>
          <div style={{
            paddingBottom: "20px",
            minWidth: 300,
            maxWidth: 300
          }}>
            <TextField
              label="Inserisci il nome della festività"
              fullWidth
              onChange={(event) => {
                setName(event.target.value)
              }}
            />
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              fontSize: 12,
              color: "gray"
            }}>Obbligatorio
            </div>
          </div>
          <div style={{
            paddingBottom: "20px",
            minWidth: 300,
            maxWidth: 300
          }}>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              fontSize: 12,
              color: "gray"
            }}>Scegli la tipologia
            </div>
            <Select
              value={kind}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value={"Religious"}>Religiosa</MenuItem>
              <MenuItem value={"Secular"}>Laica</MenuItem>
              <MenuItem value={"Civil"}>Civile</MenuItem>
              <MenuItem value={"National"}>Nazionale</MenuItem>
              <MenuItem value={"Corporate"}>Aziendale</MenuItem>
            </Select>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              fontSize: 12,
              color: "gray"
            }}>Obbligatorio
            </div>
          </div>
          <div style={{paddingBottom: "20px", minWidth: 300, maxWidth: 300}}>
            <TextField
              id="fullWidth"
              label="Inserisci la località della festa"
              fullWidth
              onChange={(event) => {
                setLocation(event.target.value)
              }}
            />
          </div>
          <div style={{paddingBottom: "20px", minWidth: 300, maxWidth: 300}}>
            <Button onClick={onSaveClick}>
              Salva
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
