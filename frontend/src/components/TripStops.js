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

const DragHandle = sortableHandle(() => <span className="spanText"><img className="dragImage" src={dragImg}></img></span>);
const TrashHandle = ({onRemove, index}) => <button className="col-auto mr-2" onClick={() => onRemove(index)}><img src={trashImg} className="dragImage" /></button>
const SortableItem = sortableElement(({value, index, onRemove, date, minTime, handleDate}) => {
    return(
        <div className="boxedItem row sortItem mb-2">
            <DragHandle />
            <span className="col-4 mr-auto spanText">{value}</span>
            <span>Arrival Time: {minTime}</span>
            <Flatpickr data-enable-time
            value={date}
            onChange={date => {handleDate(date)}} />
            <TrashHandle onRemove={onRemove} index={index}/>
        </div>
    )
});

const SortableList = sortableContainer(({items, onRemove, date, minTimes, handleDate}) => {
  return(
      <div>
        {items.map((value, index) => {
            const minTime = minTimes[index] ? minTimes[index].toTimeString() : ""
            return(
                <SortableItem 
                    key={index}
                    index={index}
                    value={value.name}
                    onRemove={onRemove}
                    date={date[index]}
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
            this.setInitialDateAndStops()

            //add listener to input
            this.stopInput = document.getElementById('stopLocation');
            this.autocompleteStop = new window.google.maps.places.Autocomplete(this.stopInput);
            window.google.maps.event.addListener(this.autocompleteStop, 'place_changed', this.handlePlacesStopSelect)

        }

        if(this.props.show && prevState.stops != this.state.stops){
            this.getTravelTimes()
        }

    }

    setInitialDateAndStops = () => {
        this.setState({
            date: [new Date()],
            stops: [this.props.start]
        })
    }

    getTravelTimes = () => {
        axios.post("/api/directions/tripTimes", [...this.state.stops, this.props.end])
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
        var arrivalTimes = this.state.date.map((date, index) => {
            if(index < this.state.travelTimes.length){
                var dateObj = new Date();
                console.log(new Date(dateObj.getTime() + (this.state.travelTimes[index]) * 1000))
                return new Date(dateObj.getTime() + (this.state.travelTimes[index] * 1000))
            }
        })
        this.setState({minDate: arrivalTimes})
    }

    handlePlacesStopSelect = () => {

        var placeStop = this.autocompleteStop.getPlace();

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
        return this.props.callback(this.state.stops, this.state.date)
    }

    handleDate = (dateItem, index) => {

        this.setState(({date}) => ({
            date: date.map((item, i) => {
                if(i === index){
                    return dateItem;
                }else {
                    return item;
                }
            })
        }))
    }


    render(){
        return(
            <Modal className="modalPurple" show = {this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Stops</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <h4 className="row">Current Route</h4>
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
                            <span className="spanText">{this.props.end.name}</span>
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