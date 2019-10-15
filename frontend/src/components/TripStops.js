import React, {Component} from 'react';
import {Modal, Button} from "react-bootstrap"
import '../style/TripStops.css'
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import dragImg from '../images/align-justify-solid.svg'
const DragHandle = sortableHandle(() => <span><img className="dragImage" src={dragImg}></img></span>);

const SortableItem = sortableElement(({value}) => <p><DragHandle /> {value}</p>);

const SortableList = sortableContainer(({items}) => {
  return(
      <div className="boxedItem" >
        {items.map((value, index) => 
            <SortableItem 
                key={index}
                index={index}
                value={value.name}
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

        this.setState(prevState => ({
            stops: [...prevState.stops, placeStop]
        }))

        this.stopInput.value = ""
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({stops}) => ({
          stops: arrayMove(stops, oldIndex, newIndex),
        }));
      };


    render(){
        return(
            <Modal className="modalPurple" show = {this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Stops</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="boxedItem">
                        <p>{this.props.start}</p>
                    </div>
                        <SortableList
                            items={this.state.stops}
                            onSortEnd={this.onSortEnd}
                            useDragHandle
                         />
                    <div className="boxedItem">
                        <p>{this.props.end}</p>
                    </div>
                    <input className="form-control" id="stopLocation" type="text" size="50" placeholder="tripStop" autoComplete="on" runat="server" />
                </Modal.Body>
                <Modal.Footer>
                    <Button>Set Stops</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default TripStops