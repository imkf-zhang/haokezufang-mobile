import React, { Component } from "react";
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import styles from "./index.module.css";
import API from "../../../../utils/api";
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
// 默认选中值  其实规定的默认值也不是瞎规定的，是有根据的
const selectedValue = {
  area: ['area',null],
  mode: ['null'],
  price: ['null'],
  more: []
};
const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制FilterPicker或FilterMore组件的展示或隐藏
    openType: "",
    // 所有筛选条件数据
    filterData: {},
    // 筛选条件的选中值
    selectedValue
  };
  componentDidMount() {
    this.getFiltersDate();
  }
  // 封装获取所有筛选条件的数据
  getFiltersDate = async () => {
    const {
      data: { body },
    } = await API.get("/houses/condition", {
      params: {
        id: value,
      },
    });
    this.setState(() => {
      return {
        filterData: body,
      };
    });
    console.log(body);
  };
  onTitleClick = (type) => {
    console.log(this, type);
    this.setState((prevState) => {
      return {
        titleSelectedStatus: {
          ...prevState.titleSelectedStatus,
          [type]: true,
        },
        openType: type,
      };
    });
  };
  onCancel = () => {
    this.setState(() => {
      return {
        openType: "",
      };
    });
  };
  onSave = (type,value) => {
    console.log(type,value)
    this.setState(() => {
      return {
        openType: "",
        selectedValue: {
          ...this.state.selectedValue,
          [type]: value
        }
      };
    });
  };
  renderFilterPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      selectedValue
    } = this.state;
    let data = [], cols =3, defaultValue =selectedValue[openType] ;
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        cols = 1;
        break;
      case "price":
        data = price;
        cols = 1;
        break;
      default:
        break;
    }
    return (
      <FilterPicker 
      type={openType} 
      onCancel={this.onCancel} 
      onSave={this.onSave} 
      data={data} 
      cols={cols}
      defaultValue={defaultValue} />
    );
  };
  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType == "area" || openType == "mode" || openType == "price" ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}
          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    );
  }
}
