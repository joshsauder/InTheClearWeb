import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import TripStopsModal from '../components/TripStops/TripStopsModal';
import RouteDataView from '../components/TripStops/RouteDataView'
import 'jest-enzyme'
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('Test Trip Stops', () => {

    const startCoordinates = {
        lat: 37.3317,
        lng: -122.0306,
        name: "Apple HQ"
    }
    const endCoordinates = {
        lat: 37.3317,
        lng: -122.0306,
        name: "Apple HQ"
    }

    test("Test Modal Render", () => {
        const tripStopsComponent = shallow(<TripStopsModal show={true} />)

        expect(tripStopsComponent.exists()).toBe(true);

    })

    test("Test Submit Button", () => {

        const mockFn = jest.fn()
        const tripStopsComponent = shallow(<TripStopsModal show={true} submit={mockFn}/>)

        tripStopsComponent.find("Button").simulate("Click")

        expect(mockFn).toHaveBeenCalled();

    })

    test("Test Route View Render", () => {
        const date = [new Date()]
        const tripStopsComponent = shallow(<RouteDataView start={startCoordinates} end={endCoordinates} date={date} minDate={[]} />)
        expect(tripStopsComponent.exists()).toBe(true);
    })

    test("Test Initial State", () => {
        const date = [new Date()]
        const tripStopsComponent = shallow(<RouteDataView show={true} start={startCoordinates} end={endCoordinates} date={date} minDate={[]}/>)

        //Destination should not render until min dates are determined
        expect(tripStopsComponent.find('.boxedItem').length).toEqual(1)
    })

    test("Test When Min Date is Determined", () => {
        const date = [new Date()]
        const tripStopsComponent = shallow(<RouteDataView show={true} start={startCoordinates} end={endCoordinates} date={date} minDate={date}/>)

        //both start and end should render
        expect(tripStopsComponent.find('.boxedItem').length).toEqual(2)
    })

    test("Test When Stop is Given", () => {
        const date = [new Date(), new Date()]
        const tripStopsComponent = mount(<RouteDataView show={true} start={startCoordinates} end={endCoordinates} date={date} minDate={date} stops={[startCoordinates]}/>)

        //both start and end should render
        expect(tripStopsComponent.find('.boxedItem').length).toEqual(3)
    })
})