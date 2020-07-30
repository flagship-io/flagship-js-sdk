import flagship from '@flagship.io/js-sdk';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EventEmitter } from 'events';
import React from 'react';
import App from './App';

Enzyme.configure({ adapter: new Adapter() });

flagship.start = jest.fn().mockImplementation(() => ({
    newVisitor: () => {
        const self = new EventEmitter();
        return self;
    }
}));

describe('Flagship - React SDK', () => {
    let wrapper;
    const setFsVisitor = jest.fn();
    const useStateSpy: jest.SpyInstance = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((fsVisitor) => [fsVisitor, setFsVisitor]);

    beforeEach(() => {
        wrapper = Enzyme.mount(<App />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        // console.log(wrapper.debug());
        expect(flagship.start).toBeCalledTimes(1);
        expect(setFsVisitor).toHaveBeenCalledTimes(1);
        expect(wrapper.find('Alert').length).toBe(10);
    });
});
