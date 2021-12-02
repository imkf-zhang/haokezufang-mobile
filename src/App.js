import { BrowserRouter as Router, Route,Redirect} from "react-router-dom";
import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Map from "./pages/Map"
import HouseDetail from "./pages/HouseDetail";
import Login from "./pages/Login";
// 导入房源发布页面
import Rent from "./pages/Rent";
import RentAdd from "./pages/Rent/Add/index"
import RentSearch from "./pages/Rent/Search/index"
import AuthRoute from "./components/AuthRoute";
function App() {
  return (
    <Router>
      <div className="App">
        {/* 默认路由，实现路由的重定向 */}
        <Route exact path="/" render={ ()=> <Redirect to="/home"/>}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        {/* <AuthRoute path="/map" component={Map}></AuthRoute> */}
        <Route path="/map" component={Map}></Route>
        <Route path="/detail/:id" component={HouseDetail}></Route>
        <Route path="/login" component={Login}></Route>
        {/* 配置登陆后才能访问的页面 */}
        <AuthRoute exact path="/rent" component={Rent}></AuthRoute>
        <AuthRoute path="/rent/add" component={RentAdd}></AuthRoute>
        <AuthRoute path="/rent/search" component={RentSearch}></AuthRoute>
      </div>
    </Router>
  );
}

export default App;
