import React from "react";
import { Carousel, Flex } from "antd-mobile";

import axios from "axios";
import "./index.css"
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
const navs = [
  { nav: Nav1, title: "整租" },
  { nav: Nav2, title: "合租" },
  { nav: Nav3, title: "地图找房" },
  { nav: Nav4, title: "去出租" },
];
function renderNavs() {
    return navs.map((item) => {
        return (
          <Flex.Item key={item.nav}>
            <img src={item.nav} alt=""></img>
            <h2>{item.title}</h2>
          </Flex.Item>
        );
      });
}
class Index extends React.Component {
  state = {
    swipers: [],
  };
  async getSwipers() {
    const { data: res } = await axios.get("http://localhost:8080/home/swiper");
    console.log(res);
    this.setState(() => {
      return {
        swipers: res.body,
      };
    });
  }
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="#"
        style={{
          display: "inline-block",
          width: "100%",
          height: 212,
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
        />
      </a>
    ));
  }
  componentDidMount() {
    this.getSwipers();
  }
  render() {
    return (
      <div className="index">
        <Carousel autoplay={true} infinite autoplayInterval={2000}>
          {this.renderSwipers()}
        </Carousel>
        <Flex className='nav'>{renderNavs()}</Flex>
      </div>
    );
  }
}
export default Index;
