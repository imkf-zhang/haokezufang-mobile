import React, { Component } from "react";
import { Spring, animated } from "react-spring";
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import { default as styles1 } from "./index.module.css"; // 跟动画的react-spring的styles冲突了,因此命名为styles1
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
    this.htmlBody = document.body;
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
  };
  onTitleClick = (type) => {
    this.htmlBody.classList.add("body-fixed");
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
    this.htmlBody.classList.remove("body-fixed");
    const { titleSelectedStatus, selectedValue } = this.state;
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
    this.htmlBody.classList.remove("body-fixed");
    console.log(type, value);
    const { titleSelectedStatus } = this.state;
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
    const newSelectedValue = {
      ...this.state.selectedValue,
      // 只更新当前type对应的值
      [type]: value,
    };
    const { area, mode, price, more } = newSelectedValue;
    // 筛选条件数据
    const filters = {};
    // 区域
    const areaKey = area[0];
    let areaValue = "null";
    if (area.length == 3) {
      areaValue = area[2] !== "null" ? area[2] : area[1];
    }
    filters[areaKey] = areaValue;
    // 方式和租金
    filters.mode = mode[0];
    filters.price = price[0];
    // 更多筛选项
    filters.more = more.join(",");
    // 把值传递给父组件
    this.props.onFilter(filters);
    // console.log(filters)
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
    return (
      <FilterMore
        data={data}
        type={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        defaultValue={defaultValue}
      />
    );
  };
  /**
   * 渲染遮罩层div
   */
  renderMask = () => {
    const { openType } = this.state;
    const isHiden = (openType === 'more' || openType === '');
      return (
        <Spring
        from={{ opacity: 0}}
        to={{ opacity: isHiden ? 0 : 1}}
      >
        {(styles) => {
          console.log('styles', styles.opacity)
          if(styles.opacity.animation.to === 0) {
            return null
          }
          return (<animated.div
            style={styles}
            className={styles1.mask}
            onClick={() => {
              this.onCancel(openType);
            }}
          ></animated.div>)
        }}
      </Spring>
      )
    // if(openType == "area" || openType == "mode" || openType == "price") {
    //   return (
    //     <Spring
    //     from={{ opacity: 0, color: "red" }}
    //     to={[
    //       { opacity: 1, color: "#ffaaee" },
    //       { opacity: 1, color: "rgb(14,26,19)" },
    //     ]}
    //   >
    //     {(styles) => {
    //       console.log('styles',styles)
    //       return (<animated.div
    //         style={styles}
    //         className={styles1.mask}
    //         onClick={() => {
    //           this.onCancel(openType);
    //         }}
    //       ></animated.div>)
    //     }}
    //   </Spring>
    //   )
    // }else {
    //   return null
    // }
    // <div className={styles.mask} onClick={()=> {this.onCancel(openType)}} />
  };
  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles1.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}
        <div className={styles1.content}>
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
