import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'
import API from '../../utils/api'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: "",
    password: ""
  }
  /**
   * 使用受控组件，使状态和form组件的value双向绑定
   */
  getUserName = (e) => {
    this.setState( ()=> {
      return {
        username: e.target.value
      }
    })
  }
  /**
   * 使用受控组件，使状态和form组件的value双向绑定
   */
  getPassword = e => {
    this.setState( ()=> {
      return {
        password: e.target.value
      }
    })
  }
  /**
   * 表单的提交事件的处理事件
   */
  handleSubmit = async (e) => {
    // 表单的默认提交事件会刷新页面->需要阻止其默认行为
    e.preventDefault();
    const { username,password } = this.state;
    const { data: { body,description,status}} = await API.post('/user/login',{username,password});
    if (status === 200) {
      localStorage.setItem('hkzf_token',body.token);
      this.props.history.go(-1);
    }else {
      Toast.info(description, 2 , null,false);
    }
  }
  render() {
    const { username,password } = this.state;
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit = {this.handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={username}
                onChange={this.getUserName}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={password}
                onChange={this.getPassword}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
