import React, {Component} from 'react';
import {Modal, Button} from "react-bootstrap"
import '../style/TripStops.css'
import 'flatpickr/dist/themes/material_green.css'
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Flatpickr from 'react-flatpickr'
import dragImg from '../images/align-justify-solid.svg';
import trashImg from '../images/trash-alt-solid.svg';
import axios from '../../../server/node_modules/axios';

const DragHandle = sortableHandle(() => <span className="col-1 mt-2"><img className="dragImage" src={dragImg}></img></span>);
const TrashHandle = ({onRemove, index}) => <button className="col-1 mr-1" onClick={() => onRemove(index)}><img src={trashImg} className="dragImage" /></button>
const SortableItem = sortableElement(({value, index, onRemove, date, minTime, handleDate}) => {
    return(
        <div className="boxedItem row sortItem mb-2">
            <DragHandle />
            <span className="col-3 mt-1">{value}</span>
            <div className="col-6 cellFontSize">
                <div className="row">
                <span className="col">Arrival Time: {minTime}</span>
                <div className="w-100"></div>
                <div className="col">
                <span className="d-inline-block">Departure Time:</span>
                <Flatpickr data-enable-time
                value={date}
                onChange={(date, index) => {handleDate(date, index++)}} />
                </div>
                </div>
            </div>
            <TrashHandle onRemove={onRemove} index={index}/>
        </div>
    )
});

const SortableList = sortableContainer(({items, onRemove, date, minTimes, handleDate}) => {
  return(
      <div>
        {items.map((value, index) => {
            var options = { weekday: 'short', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'}
            var minTime = minTimes[index] ? minTimes[index].toLocaleDateString('en-US', options) : ""
            console.log(minTimes)
            return(
                <SortableItem 
                    key={index}
                    index={index}
                    value={value.name}
                    onRemove={onRemove}
                    date={date[index+1]}
                    minTime={minTime}
                    handleDate={handleDate}
                />
            )
        }
        )}
      </div>
  );
});

class TripStops extends Component {

    constructor(props){
        super(props)

        this.state = {
            stops: [],
            date: [],
            minDate: [],
            travelTimes: []
        }

    }

    componentDidUpdate(prevProps, prevState){

        if(this.props.show == true && this.state.date.length === 0){
            //set initial state for date
            this.setInitialDate()

            //add listener to input
            this.stopInput = document.getElementById('stopLocation');
            this.autocompleteStop = new window.google.maps.places.Autocomplete(this.stopInput);
            window.google.maps.event.addListener(this.autocompleteStop, 'place_changed', this.handlePlacesStopSelect)
            //get inital travel times
            this.getTravelTimes()

        }

        if(this.props.show && prevState.stops != this.state.stops){
            //on remove or reorder get travel times
            this.getTravelTimes()
        }

    }

    setInitialDate = () => {
        this.setState({
            date: [new Date()]
        })
    }

    getTravelTimes = () => {
        //get travel times
        axios.post("/api/directions/tripTimes", [this.props.start, ...this.state.stops, this.props.end])
        .then(res => {
            const times = res.data.map(time => {
                return time.time
            });
            this.setState({travelTimes: times})
            this.determineTravelTimes()
        }).catch(err => {
            console.log(err)
        })
    }

    determineTravelTimes = () => {
        //for each travel time, determine exact arrival time
        var timeOffset = 0
        var arrivalTimes = this.state.date.map((date, index) => {
            if(index < this.state.travelTimes.length){
                timeOffset += this.state.travelTimes[index] * 1000
                var dateObj = new Date();
                return new Date(dateObj.getTime() + timeOffset)
            }
        })
        this.setState({minDate: arrivalTimes})
    }

    handlePlacesStopSelect = () => {

        var placeStop = this.autocompleteStop.getPlace();

        //format the stop and create new date object
        var data = {lat: placeStop.geometry.location.lat(), lng: placeStop.geometry.location.lng(), name: placeStop.name}
        var date = data ? new Date() : null
        
        this.setState(prevState => ({
            stops: [...prevState.stops, data],
            date: [...prevState.date, date]
        }))

        this.stopInput.value = ""
    }

    handlePlacesRemove = (index) => {
        this.setState(function(prevState){
            //remove single stop at index
            prevState.stops.splice(index, 1)
            return{
                stops: prevState.stops
            }
        })
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({stops}) => ({
          stops: arrayMove(stops, oldIndex, newIndex),
        }));
    };

    onSubmit = () => {
        return this.props.callback([this.props.start, ...this.state.stops, this.props.end], this.state.date)
    }

    handleDate = (dateItem, index) => {

        this.setState(({date}) => ({
            date: date.map((item, i) => {
                //if index == i, return inputted date, else return orig item
                if(i === index){
                    return dateItem;
                }else {
                    return item;
                }
            })
        }))
        //on date change get travel times
        this.getTravelTimes()
    }


    render(){
        var options = { weekday: 'short', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'}
        var minTime = this.state.minDate[this.state.minDate.length-1] ? this.state.minDate[this.state.minDate.length-1].toLocaleDateString('en-US', options) : ""
        console.log(this.state.minDate)
        return(
            <Modal className="modalPurple" show = {this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Stops</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <h4 className="row">Current Route</h4>
                        <div className="row boxedItem mb-2">
                            <span className="spanText mr-2">{this.props.start.name}</span>
                            <span className="spanText mr-2">Departure Time:</span>
                            <Flatpickr data-enable-time
                            value={this.state.date[0]}
                            onChange={date => {this.handleDate(date)}} />
                        </div>
                        <SortableList
                            items={this.state.stops}
                            onSortEnd={this.onSortEnd}
                            onRemove={this.handlePlacesRemove}
                            date={this.state.date}
                            minTimes={this.state.minDate}
                            handleDate={this.handleDate}
                            useDragHandle
                        />
                        <div className="row boxedItem mb-2">
                            <span className="spanText mr-2">{this.props.end.name}</span>
                            <span className="spanText">Departure Time: {minTime}</span>
                        </div>
                        <div className="row mt-5">
                            <input className="form-control" id="stopLocation" type="text" size="50" placeholder="Add Trip Stop" autoComplete="on" runat="server" />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit}>Set Stops</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default TripStops