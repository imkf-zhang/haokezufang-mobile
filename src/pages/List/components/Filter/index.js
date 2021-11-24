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
  area: ["area", null],
  mode: ["null"],
  price: ["null"],
  more: [],
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
    selectedValue,
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
    // console.log(this, type);
    const { titleSelectedStatus, selectedValue } = this.state;
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    Object.keys(titleSelectedStatus).forEach((item) => {
      if (type === item) {
        newTitleSelectedStatus[type] = true;
        return;
      }
      const selectedVal = selectedValue[item];
      if (
        item === "area" &&
        (selectedVal.length !== 2 || selectedVal[0] !== "area")
      ) {
        // 高亮
        newTitleSelectedStatus[item] = true;
      } else if (item === "mode" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "more" && selectedVal.length !== 0) {
        newTitleSelectedStatus[item] = true;
      } else {
        newTitleSelectedStatus[item] = false;
      }
    });
    console.log(newTitleSelectedStatus);
    this.setState(() => {
      return {
        titleSelectedStatus: newTitleSelectedStatus,
        openType: type,
      };
    });
  };
  /**
   * 关闭弹出框
   */
  onCancel = (type) => {
    const { titleSelectedStatus,selectedValue} = this.state;
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    const selectedVal = selectedValue[type];
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    this.setState(() => {
      return {
        openType: "",
        titleSelectedStatus: newTitleSelectedStatus,
      };
    });
  };
  /**
   * 获取到选中的值,判断当前菜单是否高亮（当选中无效值的时候，肯定不让其高亮）
   * @param {*} type 
   * @param {*} value 
   */
  onSave = (type, value) => {
    console.log(type,value);
    const { titleSelectedStatus} = this.state;
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    const selectedVal = value;
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    this.setState(() => {
      return {
        openType: "",
        titleSelectedStatus: newTitleSelectedStatus,
        selectedValue: {
          ...this.state.selectedValue,
          // 只更新当前type对应的值
          [type]: value,
        },
      };
    });
  };
  /**
   * 渲染前三个Picker组件
   * @returns 
   */
  renderFilterPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      selectedValue,
    } = this.state;
    let data = [],
      cols = 3,
      defaultValue = selectedValue[openType];
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
        key={openType}
        type={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
      />
    );
  };
  /**
   * 渲染 FilterMore组件
   * @returns components
   */
  renderFilterMore = () => {
    const {
      openType,
      selectedValue,
      filterData: { roomType, oriented, floor, characteristic },
    } = this.state;
    const data = {
      roomType,
      oriented,
      floor,
      characteristic,
    };
    const defaultValue = selectedValue.more;
    if (openType !== "more") {
      return null;
    }
    return <FilterMore 
    data={data} 
    type={openType}
    onCancel={this.onCancel}
    onSave={this.onSave}
    defaultValue={defaultValue} />;
  };
  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType == "area" || openType == "mode" || openType == "price" ? (
          <div className={styles.mask} onClick={()=> {this.onCancel(openType)}} />
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
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
