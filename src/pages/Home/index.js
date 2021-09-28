import React from "react";
import "./index.css"
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";
// 组件
import Index from "../Index/index";
import List from "../List/index";
import News from "../News/index";
import My from "../My/index";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.location.pathname,
    };
  }
  render() {
    return (
      <div className="home">
        <Route path="/home/index" component={Index}></Route>
        <Route path="/home/list" component={List}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/my" component={My}></Route>
          <TabBar
            tintColor="#21b97a"
            barTintColor="white"
            noRenderContent
          >
            <TabBar.Item
              title="首页"
              key="首页"
              icon={
                <i className="iconfont icon-ind" />
              }
              selectedIcon={
                <i className="iconfont icon-ind" />
              }
              selected={this.state.selectedTab === "/home/index"}
              onPress={() => {
                this.setState({
                  selectedTab: "/home/index",
                });
                this.props.history.push('/home/index')
              }}
              data-seed="logId"
            >
            </TabBar.Item>
            <TabBar.Item
              icon={
                <i className="iconfont icon-findHouse" />
              }
              selectedIcon={
                <i className="iconfont icon-findHouse" />
              }
              title="找房"
              key="找房"
              selected={this.state.selectedTab === "/home/list"}
              onPress={() => {
                this.setState({
                  selectedTab: '/home/list',
                });
                this.props.history.push('/home/list')
              }}
              data-seed="logId1"
            >
            </TabBar.Item>
            <TabBar.Item
              icon={
                <i className="iconfont icon-infom" />
              }
              selectedIcon={<i className="iconfont icon-infom" />}
              title="咨询"
              key="咨询"
              selected={this.state.selectedTab === "/home/news"}
              onPress={() => {
                this.setState({
                  selectedTab: "/home/news",
                });
                this.props.history.push('/home/news')
              }}
            >
            </TabBar.Item>
            <TabBar.Item
              icon={<i className="iconfont icon-my" />}
              selectedIcon={<i className="iconfont icon-my" />}
              title="我的"
              key="我的"
              selected={this.state.selectedTab === "/home/my"}
              onPress={() => {
                this.setState({
                  selectedTab: "/home/my",
                });
                this.props.history.push('/home/my')
              }}
            >
            </TabBar.Item>
          </TabBar>
        </div>
    );
  }
}
export default Home;
