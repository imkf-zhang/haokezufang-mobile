import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";

import { Link } from "react-router-dom";
import { withFormik, Form, Field,ErrorMessage } from "formik";
import * as yup from "yup";

import API from "../../utils/api";

import NavHeader from "../../components/NavHeader";

import styles from "./index.module.css";
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;
class Login extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />
        {/* 登录表单 */}
        <WingBlank>
          {/* FIXME:两个input框使用的是一个onChange函数，就是因为有了name属性的原因，name属性必须提供并且和values对象的属性一样（受控组件） */}
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              ></Field>
            </div>
            <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>
            <div className={styles.formItem}>
            <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              ></Field>
            </div>
            <ErrorMessage className={styles.error} name="password" component="div"></ErrorMessage>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}

// 使用withFormik高阶组件包装login组件
Login = withFormik({
  // 提供状态
  mapPropsToValues: () => ({ username: "", password: "" }),
  // validate: values => {
  //    const errors = {};
  //    if (!values.name) {
  //      errors.name = 'Required';
  //    }
  //    return errors;
  //  },
  // 表单验证
  validationSchema: yup.object().shape({
    username: yup
      .string()
      .required("账号为必填项")
      .matches(REG_UNAME, "长度为5到8位，只能出现数字、字母、下划线"),
    password: yup
      .string()
      .required("密码为必填项")
      .matches(REG_PWD, "长度为5到8位，只能出现数字、字母、下划线"),
  }),
  // 表单的提交事件
  handleSubmit: async (values, { props }) => {
    console.log("values", values);
    const {
      data: { body, description, status },
    } = await API.post("/user/login", {
      username: values.username,
      password: values.password,
    });
    if (status === 200) {
      localStorage.setItem("hkzf_token", body.token);
      // 注意：无法在该方法中，通过this来获取到路由信息
      // 所以通过第二个对象参数中获取到props来使用props（参数props指的就是被包裹组件的props）
      // this.props.history.go(-1);
      props.history.go(-1);
    } else {
      Toast.info(description, 2, null, false);
    }
  },
})(Login);

export default Login;
