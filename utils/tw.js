import React from 'react';

export function tw(strings, ...values) {
  // Create a component that will render with these classes
  return React.forwardRef(({ children, className: additionalClasses = '', ...props }, ref) => {
    // Resolve dynamic values based on props
    const resolvedClassName = strings.reduce((acc, str, i) => {
      const value = values[i];
      const resolvedValue = typeof value === 'function' ? value(props) : value;
      return acc + str + (resolvedValue || '');
    }, '').trim();

    // trim any extra spaces between classnames
    const trimmedClassName = resolvedClassName.replace(/\s+/g, ' ');

    // Combine all classnames
    const finalClassName = [trimmedClassName, additionalClasses].filter(Boolean).join(' ');

    return React.createElement(
      'div', // default element is div
      {
        className: finalClassName.trim(),
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
  h1: createStyledElement('h1'),
  form: createStyledElement('form'),
  input: createStyledElement('input'),
  textarea: createStyledElement('textarea'),
  // Add more as needed
};