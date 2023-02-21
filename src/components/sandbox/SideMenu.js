import React, { useEffect, useState } from "react";
import {
  HomeOutlined,
  SolutionOutlined,
  UserOutlined,
  UnlockOutlined,
  TeamOutlined,
  KeyOutlined,
  MailOutlined,
  FormOutlined,
  AlignLeftOutlined,
  RadarChartOutlined,
  AuditOutlined,
  HighlightOutlined,
  OrderedListOutlined,
  ExclamationCircleOutlined,
  SnippetsOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import "./index.css";
import { withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import axios from "axios";
import { connect } from "react-redux";
const { Sider } = Layout;
const { SubMenu } = Menu;
//图标
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <SolutionOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UnlockOutlined />,
  "/right-manage/role/list": <TeamOutlined />,
  "/right-manage/right/list": <KeyOutlined />,
  "/news-manage": <MailOutlined />,
  "/news-manage/add": <FormOutlined />,
  "/news-manage/draft": <AlignLeftOutlined />,
  "/news-manage/category": <RadarChartOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/audit-manage/audit": <HighlightOutlined />,
  "/audit-manage/list": <OrderedListOutlined />,
  "/publish-manage": <SnippetsOutlined />,
  "/publish-manage/unpublished": <ExclamationCircleOutlined />,
  "/publish-manage/published": <CheckCircleOutlined />,
  "/publish-manage/sunset": <StopOutlined />,
};

function SideMenu(props) {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      // console.log(res.data);
      setMenu(res.data);
    });
  }, []);

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key);
  };
  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        checkPagePermission(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => {
              props.history.push(item.key);
            }}
          >
            {item.title}
          </Menu.Item>
        )
      );
    });
  };

  const selectKeys = [props.location.pathname];
  const openKeys = ["/" + props.location.pathname.split("/")[1]];
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
  isCollapsed,
});

export default connect(mapStateToProps)(withRouter(SideMenu));
