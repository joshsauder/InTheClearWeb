import React, {Component} from 'react';
import {Modal, Button} from "react-bootstrap"
import '../style/TripStops.css'
import 'flatpickr/dist/themes/material_green.css'
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Flatpickr from 'react-flatpickr'
import dragImg from '../images/align-justify-solid.svg';
import trashImg from '../images/trash-alt-solid.svg';

const DragHandle = sortableHandle(() => <span className="spanText"><img className="dragImage" src={dragImg}></img></span>);
const TrashHandle = ({onRemove, index}) => <button className="col-auto mr-2" onClick={() => onRemove(index)}><img src={trashImg} className="dragImage" /></button>
const SortableItem = sortableElement(({value, index, onRemove, date, handleDate}) => {
    return(
    <div className="boxedItem row sortItem mb-2">
        <DragHandle />
        <span className="col-4 mr-auto spanText">{value}</span>
        <Flatpickr data-enable-time
        value={date}
        onChange={date => {handleDate(date, index++)}} />
        <TrashHandle onRemove={onRemove} index={index}/>
    </div>
    )
});

const SortableList = sortableContainer(({items, onRemove, date, handleDate}) => {
  return(
      <div>
        {items.map((value, index) => 
            <SortableItem 
                key={index}
                index={index}
                value={value.name}
                onRemove={onRemove}
                date={date[index+1]}
                handleDate={handleDate}
            />
        )}
      </div>
  );
});

class TripStops extends Component {

    constructor(props){
        super(props)

        this.state = {
            stops: [],
            date: []
        }

    }

    componentDidUpdate(prevProps, prevState){

        if(this.props.show == true && this.state.date.length === 0){
            this.setInitialDate()
            this.stopInput = document.getElementById('stopLocation');
            this.autocompleteStop = new window.google.maps.places.Autocomplete(this.stopInput);
            window.google.maps.event.addListener(this.autocompleteStop, 'place_changed', this.handlePlacesStopSelect)

        }

    }

    setInitialDate = () => {
        this.setState({date: [new Date()]})
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
                        <div className="row boxedItem mb-2">
                            <span className="col-4 mr-auto spanText">{this.props.start}</span>
                            <Flatpickr data-enable-time
                            value={this.state.date[0]}
                            onChange={date => {this.handleDate(date, 0)}} />
                        </div>
                        <SortableList
                            items={this.state.stops}
                            onSortEnd={this.onSortEnd}
                            onRemove={this.handlePlacesRemove}
                            date={this.state.date}
                            handleDate={this.handleDate}
                            useDragHandle
                        />
                        <div className="row boxedItem mb-2">
                            <span className="spanText">{this.props.end}</span>
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