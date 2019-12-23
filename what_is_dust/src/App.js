import React,{Component} from 'react';
import {HashRouter,Route} from "react-router-dom";
import ScrollToTop from './ScrollToTop';
import Home from './home';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
        <HashRouter basename = {process.env.PUBLIC_URL}>
          <ScrollToTop>
            <div className = "App">
                <Route exact path = "/" component={Home} />
            </div>
          </ScrollToTop>
        </HashRouter>
      );
    }
}


export default App;
