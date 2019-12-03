import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import App from '../components/login';
import 'jest-enzyme'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe("Login Component", () => {

    test("Test Render", () => {
        const loginComponent = shallow(<App />)

        expect(loginComponent.exists()).toBe(true);

    })
    
    test('Render on init', () => {

        const loginComponent = shallow(<App />)
        const login = <label htmlFor="username">Username</label>
    
        expect(loginComponent).toContainReact(login);

    })

    test("User text is inputted", () => {
        const loginComponent = shallow(<App />)

        loginComponent.find("input").at(0).simulate("change", {
            target: {name: "username", value: "test"}
        });

        loginComponent.find("input").at(1).simulate("change", {
            target: {name: "password", value: "test"}
        });

        expect(loginComponent.find("input").at(0).props().value).toEqual("test")
        expect(loginComponent.find("input").at(1).props().value).toEqual("test")

    })

    test("Change to sign-up", () => {
        const loginComponent = shallow(<App />)
        loginComponent.find('Button').at(1).simulate("click", {preventDefault: () => {}})

        expect(loginComponent.find("input").length).toEqual(4)

    })
})