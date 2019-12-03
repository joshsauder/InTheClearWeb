import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import TripStops from '../components/TripStops';
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

    test("Test Render", () => {
        const tripStopsComponent = shallow(<TripStops show={false} start={startCoordinates} end={endCoordinates} />)

        expect(tripStopsComponent.exists()).toBe(true);

    })

    test("Test Intial State", () => {
        const tripStopsComponent = shallow(<TripStops show={true} start={startCoordinates} end={endCoordinates} />)

        //assert one item... init state doesnt render destination
        expect(tripStopsComponent.find('.boxedItem').length).toEqual(1)
    })

    test("Test Submit Button", () => {

        const mockFn = jest.fn()
        const tripStopsComponent = shallow(<TripStops show={true} start={startCoordinates} end={endCoordinates} callback={mockFn}/>)

        tripStopsComponent.find("Button").simulate("Click")

        expect(mockFn).toHaveBeenCalled();


    })
})