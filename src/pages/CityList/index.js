import React from "react";
import axios from "axios";
import { getCurrentCity } from "../../utils/index"
import {  NavBar } from "antd-mobile";
import "./index.css";

/**
 * 数据格式化方法
 * @param { Array } list 
 * @returns { Object } 处理好的数据格式对象
 */
const formatCityData = (list) => {
  const cityList = {};
  list.forEach( item => {
    const first =  item.short.slice(0,1)
    if (cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item];
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

class CityList extends React.Component {
  state = {

  };
  async getCityList() {
    const { data: res } = await axios.get("http://localhost:8080/area/city",{
      params: {
        level: 1
      }
    })
    const {cityList,cityIndex} =  formatCityData(res.body);
    // 获取热门城市数据
    const { data: hot } = await axios.get("http://localhost:8080/area/hot");
    cityList['hot'] = hot.body;
    cityIndex.unshift('hot');
    // 获取当前定位城市
    const curCity = await getCurrentCity();
    cityList['#'] = [curCity];
    cityIndex.unshift('#');
    console.log(cityList,cityIndex)
  };
  componentDidMount() {
    this.getCityList();
  };
  render() {
    return (
      <div className='citylist'>
        <NavBar
          mode="light"
          icon={<i className='iconfont icon-back' />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
      </div>
    );
  };
}
export default CityList;
