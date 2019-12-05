import React, {Component} from 'react';
import 'flatpickr/dist/themes/material_green.css'
import '../../style/TripStops.css'
import Flatpickr from 'react-flatpickr'
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import dragImg from '../../images/align-justify-solid.svg';
import trashImg from '../../images/trash-alt-solid.svg';

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

class RouteDataView extends Component {

    constructor(props){
        super(props)
    }

    render(){
        var options = { weekday: 'short', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'}
        var minTime = this.props.minDate[this.props.minDate.length-1] ? this.props.minDate[this.props.minDate.length-1].toLocaleDateString('en-US', options) : ""
        return (
            <div className="container">
                <h4 className="row">Current Route</h4>
                <div className="row boxedItem mb-2">
                    <span className="spanText mr-2">{this.props.start.name}</span>
                    <span className="spanText mr-2">Departure Time:</span>
                    <Flatpickr data-enable-time
                    value={this.props.date[0]}
                    onChange={date => {this.handleDate(date)}} />
                </div>
                <SortableList
                    items={this.props.stops}
                    onSortEnd={this.props.onSortEnd}
                    onRemove={this.props.handlePlacesRemove}
                    date={this.props.date}
                    minTimes={this.props.minDate}
                    handleDate={this.props.handleDate}
                    useDragHandle
                />
                {minTime !== "" &&
                <div className="row boxedItem mb-2">
                    <span className="spanText mr-2">{this.props.end.name}</span>
                    <span className="spanText">Arrival Time: {minTime}</span>                          
                </div>
                }
                <div className="row mt-5">
                    <input className="form-control" id="stopLocation" type="text" size="50" placeholder="Add Trip Stop" autoComplete="on" runat="server" />
                </div>
            </div>
        )
    }
}

export default RouteDataView;