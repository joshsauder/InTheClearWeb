import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import App from '../components/login';
import 'jest-enzyme'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe("Login Component", () => {

    test("Renders", () => {
        const render = shallow(<App />)

        expect(render.exists()).toBe(true);

        render.unmount()
    })
    
    test('Render on init', () => {

        const render = shallow(<App />)
        const login = <label htmlFor="username">Username</label>
    
        expect(render).toContainReact(login);

        render.unmount()
    })

    test("User text is inputted", () => {
        const render = shallow(<App />)

        render.find("input").at(0).simulate("change", {
            target: {name: "username", value: "test"}
        });

        render.find("input").at(1).simulate("change", {
            target: {name: "password", value: "test"}
        });

        expect(render.find("input").at(0).props().value).toEqual("test")
        expect(render.find("input").at(1).props().value).toEqual("test")

        render.unmount()
    })

    test("Change to sign-up", () => {
        const render = shallow(<App />)
        render.find('Button').at(1).simulate("click", {preventDefault: () => {}})

        expect(render.find("input").length).toEqual(4)

        render.unmount()
    })
})