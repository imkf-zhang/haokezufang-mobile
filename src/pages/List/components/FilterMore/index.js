import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    selectedValues: [],
  };

  /**
   * 渲染标签
   * @param { Array } data
   * @returns jsx
   */
  renderFilters(data) {
    const { selectedValues } = this.state;
    // 高亮类名： styles.tagActive
    return data.map((item) => {
      const isSelected = selectedValues.indexOf(item.value) > -1 ? true : false;
      return (
        <span
          onClick={()=> {this.onTagClick(item.value)}}
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")}
        >
          {item.label}
        </span>
      );
    });
  }
  /**
   * 点击标签
   * @param { String } value
   * @returns
   */
  onTagClick = (value) => {
    const { selectedValues } = this.state;
    const newSelectedValues = [...selectedValues];
    if (selectedValues.indexOf("value") <= -1) {
      newSelectedValues.push(value);
    } else {
      const index = newSelectedValues.findIndex((item) => item === value);
      newSelectedValues.splice(index, 1);
    }
    this.setState(() => {
      return { selectedValues: newSelectedValues };
    });
  };
  /**
   * 点击取消按钮
   * @returns 
   */
   onCancel = () => {
     this.setState(() => {
       return {
        selectedValues: []
       }
     })
   }
   /**
    * 点击确定按钮
    * @returns
    */
  onOk = () => {
    // 将父组件传递过来的值结构出来
    const { type, onSave } = this.props
    onSave( type, this.state.selectedValues)
  }
  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
    } = this.props;
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
            {/* 底部按钮 */}
            <FilterFooter className={styles.footer } 
            cancelText={'清除'} 
            onCancel={this.onCancel}
            onOk={this.onOk} />
          </dl>
        </div>
      </div>
    );
  }
}
