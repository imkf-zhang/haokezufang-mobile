import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

// 之前的假数据
const province = [
  {
    label: '北京',
    value: '01',
    children: [
      {
        label: '东城区',
        value: '01-1'
      },
      {
        label: '西城区',
        value: '01-2'
      },
      {
        label: '崇文区',
        value: '01-3'
      },
      {
        label: '宣武区',
        value: '01-4'
      }
    ]
  },
  {
    label: '浙江',
    value: '02',
    children: [
      {
        label: '杭州',
        value: '02-1',
        children: [
          {
            label: '西湖区',
            value: '02-1-1'
          },
          {
            label: '上城区',
            value: '02-1-2'
          },
          {
            label: '江干区',
            value: '02-1-3'
          },
          {
            label: '下城区',
            value: '02-1-4'
          }
        ]
      },
      {
        label: '宁波',
        value: '02-2',
        children: [
          {
            label: 'xx区',
            value: '02-2-1'
          },
          {
            label: 'yy区',
            value: '02-2-2'
          }
        ]
      },
      {
        label: '温州',
        value: '02-3'
      },
      {
        label: '嘉兴',
        value: '02-4'
      },
      {
        label: '湖州',
        value: '02-5'
      },
      {
        label: '绍兴',
        value: '02-6'
      }
    ]
  }
]

export default class FilterPicker extends Component {
 constructor(props) {
  super(props)
  // console.log('picker创建了')
  this.state = {
    value: this.props.defaultValue,
  };
 }
  onChange = (value) => {
    this.setState({
      value,
    });
  }
  // 存在一个bug，只有当PickerView重建了，默认值才生效。
  // 没有重建只是来回的切换，默认值就不生效，不会执行state初始化，自然就拿不到最新的值
  render() {
    const { onCancel, onSave, data, cols,type } = this.props;
    return (
      <>
        {/* 选择器组件： */}
        <PickerView onChange={this.onChange} data={data} value={this.state.value} cols={cols} value={this.state.value} />

        {/* 底部按钮 */} 
        {/* 传递改变后的值可以理解，为什么要传递type？ 因为FilterPicker是前三个选项复用的 */}
        <FilterFooter onCancel={ () => onCancel(type)}  onOk= {() => onSave(type,this.state.value) }/>
      </>
    )
  }
}
