import { BrowserRouter as Router, Route, Link,Redirect} from "react-router-dom";
import Home from "./pages/Home";
import CityList from "./pages/CityList";
function App() {
  return (
    <Router>
      <div className="App">
        {/* 默认路由，实现路由的重定向 */}
        <Route exact path="/" render={ ()=> <Redirect to="/home"/>}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </Router>
  );
}

export default App;
