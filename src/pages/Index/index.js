import React from "react";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";

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
// 获取地理位置信息
navigator.geolocation.getCurrentPosition(position => {
  console.log('当前地理位置', position)
})

class Index extends React.Component {
  state = {
    swipers: [],
    isSwiperLoading: false,
    // 租房小组数据
    groups: [],
    // 最新咨询
    news: [],
  };
  async getSwipers() {
    const { data: res } = await axios.get("http://localhost:8080/home/swiper");
    this.setState(() => {
      return {
        swipers: res.body,
        isSwiperLoading: true,
      };
    });
  }
  async getGroups() {
    const { data: res } = await axios.get("http://localhost:8080/home/groups", {
      params: {
        area: "AREA|88cff55c-aaa4-e2e0",
      },
    });
    this.setState(() => {
      return {
        groups: res.body,
      };
    });
  }
  async getSwipers() {
    const { data: res } = await axios.get("http://localhost:8080/home/swiper");
    this.setState(() => {
      return {
        swipers: res.body,
        isSwiperLoading: true,
      };
    });
  }
  async getNews() {
    const { data: res } = await axios.get("http://localhost:8080/home/news", {
      params: {
        area: "AREA|88cff55c-aaa4-e2e0",
      },
    });
    this.setState(() => {
      return {
        news: res.body,
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
  renderNews = () => {
    return this.state.news.map( item => (
      <div className='news-item' key={item.id}>
        <div className='imgwrap'>
          <img 
           className='img'
           src={`http://localhost:8080${item.imgSrc}`}
          />
        </div>
        <Flex className='content' direction='column' justify='between'>
          <h3 className='title'>{item.title}</h3>
          <Flex className='info' justify='between'>
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          {this.state.isSwiperLoading ? (
            <Carousel autoplay={false} infinite autoplayInterval={2000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}
          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className="name">上海</span>
                <i className="iconfont icon-arrow" />
              </div>

              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => this.props.history.push('/search')}
              >
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => this.props.history.push('/map')}
            />
          </Flex>
        </div>
        {/* 导航 */}
        <Flex className="nav">{this.renderNavs()}</Flex>
        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组<span className="more">更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 最新咨询 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
export default Index;
