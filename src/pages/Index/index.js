import React from "react";
import { Carousel, Flex } from "antd-mobile";

import axios from "axios";
import "./index.css";
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";

const navs = [
  { id: 1, path: "/home/list", nav: Nav1, title: "整租" },
  { id: 2, path: "/home/list", nav: Nav2, title: "合租" },
  { id: 3, path: "/home/dtzf", nav: Nav3, title: "地图找房" },
  { id: 4, path: "/home/qcz", nav: Nav4, title: "去出租" },
];
class Index extends React.Component {
  state = {
    swipers: [],
    isSwiperLoading: false,
  };
  async getSwipers() {
    const { data: res } = await axios.get("http://localhost:8080/home/swiper");
    console.log(res);
    this.setState(() => {
      return {
        swipers: res.body,
        isSwiperLoading: true,
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
  renderNavs = () => {
    return navs.map((item) => {
      return (
        <Flex.Item
          key={item.nav}
          onClick={() => this.props.history.push(item.path)}
        >
          <img src={item.nav} alt=""></img>
          <h2>{item.title}</h2>
        </Flex.Item>
      );
    });
  };
  componentDidMount() {
    this.getSwipers();
  }
  render() {
    return (
      <div className="index">
        <div className="swiper">
          {this.state.isSwiperLoading ? (
            <Carousel autoplay={true} infinite autoplayInterval={2000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}
        </div>
        <Flex className="nav">{this.renderNavs()}</Flex>
      </div>
    );
  }
}
export default Index;
