import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { App } from '../components/App';

test('<App /> has a div', (t) => {
  const wrapper = shallow(<App hamsters={{}} username="" />);
  t.equal(wrapper.is('div'), true);
  t.end();
});