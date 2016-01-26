/* eslint-env node, mocha */
import { expect } from 'chai';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import Controls from '../../src/components/Controls';
import { INITIAL_STATE } from '../../src/constants';

const shallowRenderer = createRenderer();

describe('Controls', () => {

  it('renders Controls with default values', () => {
    let component;

    try {
      shallowRenderer.render(<Controls />);
      component = shallowRenderer.getRenderOutput();
    }
    catch (ex) {
      expect(ex).to.not.exist();
    }

    expect(component).to.exist();
  });

  it('renders Controls with valid values', () => {
    let component;

    const props = {
      teams: [],
      background: {
        size: {
          current: {
            width: 1000,
            height: 1000,
            padding: {
              top: 500,
              bottom: 0,
              right: 200,
              left: 200,
            },
          },
        },
      },
    };

    shallowRenderer.render(<Controls />);
    component = shallowRenderer.getRenderOutput();

    expect(component).to.exist();
  });
});
