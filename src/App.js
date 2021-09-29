import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CityList from "./pages/CityList";
function App() {
  return (
    <Router>
      <div className="App">
        {/* <Link to="/home">首页</Link>
        <Link to="/citylist">城市选择</Link> */}
        <Route path="/" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </Router>
  );
}

export default App;
