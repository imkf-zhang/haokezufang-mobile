import React from "react";
import axios from "axios";
import { getCurrentCity } from "../../utils/index";
import { NavBar, Toast } from "antd-mobile";
import { AutoSizer, List } from "react-virtualized";
import NavHeader from "../../components/NavHeader";
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
  if (item === "#") {
    return "当前定位";
  } else if (item === "hot") {
    return "热门城市";
  } else {
    return item;
  }
};
// 每一行 title 高度
const TITLE_HEIGHT = 36;
const NAME_HEIGHT = 50;
const CITYS = ["北京", "上海", "广州", "深圳"];
class CityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    };
    // 创建ref对象
    this.cityListComponent = React.createRef();
  }

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
        <div className="title">
          {formatCityIndex(this.state.cityIndex[index])}
        </div>
        {this.state.cityList[this.state.cityIndex[index]].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => {
              this.changeCity(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  /**
   *
   * @param { String } item
   * @returns
   */
  changeCity = (item) => {
    const { label, value } = item;
    console.log(item, label);
    if (CITYS.indexOf(label) > -1) {
      localStorage.setItem("hkzf_city", JSON.stringify(item));
      this.props.history.go(-1);
    } else {
      Toast.info("该城市暂无房源数据", 1, null, false);
    }
  };
  /**
   * 获取每行高度
   * @param { Number} index
   * @returns {Number} 当前行的高度
   */
  getRowHeight = ({ index }) => {
    let height =
      TITLE_HEIGHT +
      this.state.cityList[this.state.cityIndex[index]].length * NAME_HEIGHT;
    return height;
  };
  /**
   * 渲染右侧索引
   */
  renderCityIndex = () => {
    return this.state.cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span
          className={this.state.activeIndex === index ? "index-active" : ""}
        >
          {item === "hot" ? "热" : item}
        </span>
      </li>
    ));
  };
  /**
   * 滚动list，右侧索引高亮
   */
  onRowsRendered = ({
    overscanStartIndex,
    overscanStopIndex,
    startIndex,
    stopIndex,
  }) => {
    // 只要滚动就会不停触发
    if (this.state.activeIndex !== startIndex) {
      this.setState(() => {
        return {
          activeIndex: startIndex,
        };
      });
    }
  };
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
    this.setState(() => {
      return {
        cityList: cityList,
        cityIndex: cityIndex,
      };
    });
  }
  async componentDidMount() {
    await this.getCityList();
    // 调用measureAllRows方法，提前计算list中的每一行高度也就相当于每一行都出现过了
    //  实现scrollToRow的精确跳转。 这个方法必须在获得list数据之后
    await this.cityListComponent.current.measureAllRows();
  }
  render() {
    return (
      <div className="citylist">
        <NavHeader>城市选择</NavHeader>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              scrollToAlignment={"start"}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
              onRowsRendered={this.onRowsRendered}
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
export default CityList;
