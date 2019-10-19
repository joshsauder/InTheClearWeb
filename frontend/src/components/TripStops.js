import React, {Component} from 'react';
import {Modal, Button} from "react-bootstrap"
import '../style/TripStops.css'
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import dragImg from '../images/align-justify-solid.svg';
import trashImg from '../images/trash-alt-solid.svg';

const DragHandle = sortableHandle(() => <span className="spanText"><img className="dragImage" src={dragImg}></img></span>);
const TrashHandle = ({onRemove, index}) => <button className="col-auto mr-2" onClick={() => onRemove(index)}><img src={trashImg} className="dragImage" /></button>
const SortableItem = sortableElement(({value, index, onRemove}) => <div className="boxedItem row sortItem mb-2"><DragHandle /><span className="col-4 mr-auto spanText">{value}</span><TrashHandle onRemove={onRemove} index={index}/></div>);

const SortableList = sortableContainer(({items, onRemove}) => {
  return(
      <div>
        {items.map((value, index) => 
            <SortableItem 
                key={index}
                index={index}
                value={value.name}
                onRemove={onRemove}
            />
        )}
      </div>
  );
});

class TripStops extends Component {

    constructor(props){
        super(props)

        this.state = {
            stops: []
        }
        this.handlePlacesStopSelect = this.handlePlacesStopSelect.bind(this)
        this.handlePlacesRemove = this.handlePlacesRemove.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidUpdate(prevProps, prevState){

        if(this.props.show == true){
            this.stopInput = document.getElementById('stopLocation');

            this.autocompleteStop = new window.google.maps.places.Autocomplete(this.stopInput);

            window.google.maps.event.addListener(this.autocompleteStop, 'place_changed', this.handlePlacesStopSelect)
        }
    }

    handlePlacesStopSelect(){

        var placeStop = this.autocompleteStop.getPlace();

        var data = {lat: placeStop.geometry.location.lat(), lng: placeStop.geometry.location.lng(), name: placeStop.name}
        this.setState(prevState => ({
            stops: [...prevState.stops, data]
        }))

        this.stopInput.value = ""
    }

    handlePlacesRemove(index){
        this.setState(function(prevState){
            prevState.stops.splice(index, 1)
            console.log(prevState.stops)
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

    onSubmit(){
        return this.props.callback(this.state.stops)
    }


    render(){
        return(
            <Modal className="modalPurple" show = {this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Stops</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <h3>Current Route</h3>
                        <div className="row boxedItem mb-2">
                            <span className="spanText">{this.props.start}</span>
                        </div>
                        <SortableList
                            items={this.state.stops}
                            onSortEnd={this.onSortEnd}
                            onRemove={this.handlePlacesRemove}
                            useDragHandle
                        />
                        <div className="row boxedItem mb-2">
                            <span className="spanText">{this.props.end}</span>
                        </div>
                        <h3>Add Trip Stop</h3>
                        <input className="form-control" id="stopLocation" type="text" size="50" placeholder="Stop Location" autoComplete="on" runat="server" />
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