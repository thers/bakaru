// import 'font-awesome/css/font-awesome.css';
// import 'styles/font.css';
// import 'styles/main.scss';

import socketIO from 'socket.io-client';

const io = socketIO(`http://127.0.0.1:${getQueryVariable('port')}`);

import React, {PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

const wcjs = window.require(getQueryVariable('wcjsPath'));

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <wrapper>
        <library>
          library
        </library>
        <entry>
          entry
        </entry>
        <player>
          player
        </player>
      </wrapper>
    );
  }
}

// ReactDom.render(
//   <Provider store={store}>
//     <div>
//       OLOLO
//     </div>
//   </Provider>,
//   document.getElementById('gui-mount')
// );

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}
