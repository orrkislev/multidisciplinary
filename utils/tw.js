import React from 'react';

export function tw(strings, ...values) {
  // Combine the template strings and values
  const className = strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '').trim();

  // Create a component that will render with these classes
  return React.forwardRef(({ children, className: additionalClasses = '', ...props }, ref) => {
    return React.createElement(
      'div', // default element is div
      {
        className: `${className} ${additionalClasses}`.trim(),
        ref,
        ...props
      },
      children
    );
  });
}

// Enhanced version that allows element type specification
export function createStyledElement(elementType) {
  return (strings, ...values) => {
    const className = strings.reduce((acc, str, i) => {
      return acc + str + (values[i] || '');
    }, '').trim();

    return React.forwardRef(({ children, className: additionalClasses = '', ...props }, ref) => {
      return React.createElement(
        elementType,
        {
          className: `${className} ${additionalClasses}`.trim(),
          ref,
          ...props
        },
        children
      );
    });
  };
}

// Create commonly used element creators
export const styled = {
  div: createStyledElement('div'),
  span: createStyledElement('span'),
  button: createStyledElement('button'),
  a: createStyledElement('a'),
  p: createStyledElement('p'),
  section: createStyledElement('section'),
  article: createStyledElement('article'),
  // Add more as needed
};