import React from "react";
import axios from "axios";
import { getCurrentCity } from "../../utils/index";
import { NavBar } from "antd-mobile";
import { AutoSizer, List } from "react-virtualized";
import "./index.css";

/**
 * 数据格式化方法
 * @param { Array } list
 * @returns { Object } 处理好的数据格式对象
 */
const formatCityData = (list) => {
  const cityList = {};
  list.forEach((item) => {
    const first = item.short.slice(0, 1);
    if (cityList[first]) {
      cityList[first].push(item);
    } else {
      cityList[first] = [item];
    }
  });
  const cityIndex = Object.keys(cityList).sort();
  return {
    cityList,
    cityIndex,
  };
};
/**
 * 处理城市索引
 * @param { String } item
 * @returns { String} 处理好的索引值
 */
const formatCityIndex = (item) => {
  if(item === "#") {
    return "当前定位"
  } else if(item === "hot") {
    return "热门城市"
  } else {
    return item
  }
}
class CityList extends React.Component {
  state = {
    cityList: {},
    cityIndex: []
  };
  /**
 * 渲染每行数据的方法
 * @param {*} param0
 * @returns jsx
 */
 rowRenderer = ({
  key, // Unique key within array of rows key值，唯一值
  index, // Index of row within collection 索引
  isScrolling, // The List is currently being scrolled 当前项是否在滚动中
  isVisible, // This row is visible within the List (eg it is not an overscanned row) 当前项是list中是否可见
  style, // 重点属性，一定要给每一行数据添加样式，作用，指定每一行位置。
  // Style object to be applied to row (to position it)
}) => {
  
  return (
    <div key={key} style={style} className="city">
      <div className="title">{formatCityIndex(this.state.cityIndex[index])}</div>
      {/* {this.state.cityList[this.state.cityIndex[index]].map( item => (<div className="name">{item.label}</div>) )} */}
    </div>
  );
}
  async getCityList() {
    const { data: res } = await axios.get("http://localhost:8080/area/city", {
      params: {
        level: 1,
      },
    });
    const { cityList, cityIndex } = formatCityData(res.body);
    // 获取热门城市数据
    const { data: hot } = await axios.get("http://localhost:8080/area/hot");
    cityList["hot"] = hot.body;
    cityIndex.unshift("hot");
    // 获取当前定位城市
    const curCity = await getCurrentCity();
    cityList["#"] = [curCity];
    cityIndex.unshift("#");
    this.setState( () => {
      return {
        cityList: cityList,
        cityIndex: cityIndex
      }
    } )
  }
  componentDidMount() {
    this.getCityList();
  }
  render() {
    return (
      <div className="citylist">
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={100}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
export default CityList;
