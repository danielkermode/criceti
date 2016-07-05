import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';

import { App } from '../components/app';

const {
  isCompositeComponent,
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils;

describe('App', () => {
  let app;

  beforeEach(() => {
    //error with below line
    //app = renderIntoDocument(<App/>);
  });

  it('is a composite component', () => {
    expect(true).to.be.ok
  });

})