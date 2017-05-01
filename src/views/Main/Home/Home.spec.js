import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import Home from './Home';
import styles from './styles.module.css'

describe('<Home />', () => {
    let wrapper;
    let profile = {name: 'pkerpedjiev+test@gmail.com'};

    beforeEach(() => {
        wrapper = shallow(<Home profile={profile}/>);
    });

    it('can hit the server and retrieve a respone', () => {

    });
});
