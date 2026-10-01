import React from 'react';
import { render } from '@testing-library/react';
import RadarInspection from './radar-inspection';

describe('RadarInspection Component', () => {
  it('se renderiza sin errores', () => {
    const { container } = render(<RadarInspection />);
    expect(container).toBeDefined();
  });
});