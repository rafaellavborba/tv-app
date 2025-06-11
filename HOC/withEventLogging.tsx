import React from 'react';

function withEventLogging(WrappedComponent) {
  return function(props) {
    // Cria um novo objeto de props com handlers "logados"
    const loggedProps = {};

    Object.keys(props).forEach(key => {
      const prop = props[key];

      // Verifica se a prop é uma função e começa com "on" (evento)
      if (typeof prop === 'function' && key.startsWith('on')) {
        loggedProps[key] = (...args) => {
          console.log(`[LOG] Evento ${key} chamado com argumentos:`, args);
          return prop(...args); // chama o handler original
        };
      } else {
        loggedProps[key] = prop;
      }
    });

    return <WrappedComponent {...loggedProps} />;
  };
}

export default withEventLogging;
