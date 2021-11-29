import React from "react";
import { Flex } from "antd-mobile";
import SearchHeader from "../../components/SearchHeader";
import NoHouse from "../../components/NoHouse"
import Filter from "./components/Filter/index";
import styles from "../List/index.module.css";
import { Toast } from "antd-mobile";
import API from "../../utils/api";
import { getCurrentCity } from "../../utils";
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import Sticky from "../../components/Sticky";
import { BASE_URL } from "../../utils/url";


class News extends React.Component {
  state = {
    list: [],
    count: 0,
    isLoading: false
  };
  label = "";
  value = "";
  filters = {};
  async componentDidMount() {
    const { label,value} =  await getCurrentCity();
    this.label = label;
    this.value = value;
    this.searchHouseList();
  }
  /**
   * 接受Fillter组件中中的筛选数据
   * @param { Object}
   */
  onFilter = (filters) => {
    window.scrollTo(0,0)
    this.filters = filters;
    this.searchHouseList();
  };
  /**
   * 发送请求，获取房屋筛选数据
   * @returns
   */
  searchHouseList = async () => {
    this.setState(() => {
      return {isLoading: true}
    })
    Toast.loading("加载中...",0,null,false)
    const {
      data: {
        body: { list, count },
      },
    } = await API.get("/houses", {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    });
    Toast.hide()
    if(count !== 0) {
      Toast.info(`共找到${count}套房源`,2,null,false)
    }
    this.setState(() => {
      return {
        list,
        count,
        isLoading: false
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
    const house = list[index]; // 滚动的时候index可能会超出list的长度，所以house会出现undefind
    console.log(house);
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      );
    }
    return (
      <HouseItem
        onClick={ () => {
          this.props.history.push(`/detail/${house.houseCode}`)
        }}
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
    console.log(startIndex, stopIndex);
    return new Promise((resolve) => {
      //数据加载完成时调用resolve这个方法即可
      API.get("/houses", {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex,
        },
      }).then((res) => {
        console.log("res", res);
        this.setState(() => {
          return { list: [...this.state.list, ...res.data.body.list] };
        });
        resolve();
      });
    });
  };
  /**
   * 渲染房屋列表
   * @returns 
   */
  renderList = () => {
    const { count } = this.state;
    // 并不是一进来页面就进行一个count的判断，而是数据加载完毕之后再进行count的判断
    if(count===0 && !this.state.isLoading) {
      return (<NoHouse>没有找到房源,请您换个搜索条件吧~</NoHouse>)
    }
    return (
      <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.count}
          >
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        autoHeight
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        width={width}
                        height={height}
                        rowCount={this.state.count}
                        rowHeight={120}
                        rowRenderer={this.renderHouseList}
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
    )
  }
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
            curCityName={this.label}
            className={styles.seachHeader}
          ></SearchHeader>
        </Flex>
        <Sticky height={40}>
          <Filter onFilter={this.onFilter}></Filter>
        </Sticky>
        <div className={styles.houseItems}>
          {/* list自身有滚动条这个并不是想要的，想要其跟随页面滚动 */}
          {this.renderList()}
        </div>
      </div>
    );
  }
}
export default News;
