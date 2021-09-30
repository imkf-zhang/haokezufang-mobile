import React from "react";
import { Carousel } from "antd-mobile";
import axios from "axios";


class Index extends React.Component {
  state = {
    swipers: [],
  };
  async getSwipers() {
      const {data: res} = await axios.get("http://localhost:8080/home/swiper");
      console.log(res)
      this.setState(()=>{
          return {
            swipers: res.body
          }
      })
  }
  renderSwipers() {
      return this.state.swipers.map((item) => (
        <a
          key={item.id}
          href="http://www.alipay.com"
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
      ))
  }
  componentDidMount() {
    this.getSwipers()
  }
  render() {
    return (
      <Carousel autoplay={true} infinite autoplayInterval={2000}>
        {this.renderSwipers()}
      </Carousel>
    );
  }
}
export default Index;
