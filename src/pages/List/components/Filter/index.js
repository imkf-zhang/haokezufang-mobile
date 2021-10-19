import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import styles from './index.module.css'
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    zhang: '111'
  };
  onTitleClick = (type) => {
    console.log(this,type)
    this.setState((prevState) => {
      return {
        titleSelectedStatus: {
          ...prevState.titleSelectedStatus,
          [type]: true
        }
      }
    })
  }
  render() {
    const { titleSelectedStatus } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} 
          onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
