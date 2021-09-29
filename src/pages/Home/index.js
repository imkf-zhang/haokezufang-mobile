import React from "react";
import "./index.css";
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";
// 组件
import Index from "../Index/index";
import List from "../List/index";
import News from "../News/index";
import My from "../My/index";

// 导航栏数据
const tabItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/list",
  },
  {
    title: "咨询",
    icon: "icon-infom",
    path: "/home/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/my",
  },
];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.location.pathname,
    };
  }
  renderTabItem = () => {
    return tabItems.map((item) => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={"iconfont " + item.icon} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          });
          this.props.history.push(item.path);
        }}
      ></TabBar.Item>
    ));
  };

  render() {
    return (
      <div className="home">
        {/* 当路由是/home时，匹配到了home组件，home组件里又匹配到了下面的路由，故展示 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={List}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/my" component={My}></Route>
        <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent>
          {this.renderTabItem()}
        </TabBar>
      </div>
    );
  }
}
export default Home;
