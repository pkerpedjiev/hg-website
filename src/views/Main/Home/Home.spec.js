import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import Home from './Home';
import styles from './styles.module.css'

describe('<Home />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Home />);
    });

    it('can hit the server and retrieve a respone', () => {

    });
});
