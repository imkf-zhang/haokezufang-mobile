import React from "react";
import { Flex } from "antd-mobile";
import SearchHeader from "../../components/SearchHeader";
import Filter from "./components/Filter/index";
import styles from "../List/index.module.css";
import API from "../../utils/api";
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import { BASE_URL } from "../../utils/url";

const { label } = JSON.parse(localStorage.getItem("hkzf_city"));

class News extends React.Component {
  state = {
    list: [],
    count: 0,
  };
  filters = {};
  componentDidMount() {
    this.searchHouseList();
  }
  /**
   * 接受Fillter组件中中的筛选数据
   * @param { Object}
   */
  onFilter = (filters) => {
    this.filters = filters;
    this.searchHouseList();
  };
  /**
   * 发送请求，获取房屋筛选数据
   * @returns
   */
  searchHouseList = async () => {
    // 获取城市id
    const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    const {
      data: {
        body: { list, count },
      },
    } = await API.get("/houses", {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    });
    this.setState(() => {
      return {
        list,
        count,
      };
    });
    console.log("获取房屋筛选数据", list, count);
  };
  /**
   * 渲染房屋详情列表
   * @returns
   */
  renderHouseList = ({
    key, // Unique key within array of rows key值，唯一值
    index, // Index of row within collection 索引
    style, // 重点属性，一定要给每一行数据添加样式，作用，指定每一行位置。
  }) => {
    const { list } = this.state;
    const house = list[index];
    console.log(house);
    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    );
  };
  /**
   * 判断列表中的每一行是否加载完成
   * @param { Number }  index
   * @returns { Boolean } 是否加载完成
   */
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  };
  /**
   * 用来获取更多房屋列表数据
   * @param { Number Number }  startIndex stopIndex
   * @returns { Promise } 在数据完成加载时调用resolve
   */
  loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(startIndex, stopIndex)
    return new Promise( resolve => {
      //数据加载完成时调用resolve这个方法即可 
    })
  };
  render() {
    return (
      <div className={styles.root}>
        <Flex className={styles.header}>
          <i
            className="iconfont"
            onClick={() => {
              this.props.history.go(-1);
            }}
          ></i>
          <SearchHeader
            curCityName={label}
            className={styles.seachHeader}
          ></SearchHeader>
        </Flex>
        <Filter onFilter={this.onFilter}></Filter>
        <div className={styles.houseItems}>
          {/* list自身有滚动条这个并不是想要的，想要其跟随页面滚动 */}
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.count}
            minimumBatchSize={20}
          >
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        autoHeight
                        width={width}
                        height={height}
                        rowCount={this.state.count}
                        rowHeight={120}
                        rowRenderer={this.renderHouseList}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    );
  }
}
export default News;
