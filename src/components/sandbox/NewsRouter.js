import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Spin } from "antd";
import { connect } from "react-redux";
import Home from "../../views/sandbox/home/Home";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import NoPermission from "../../views/sandbox/nopermission/Nopermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import axios from "axios";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/right/list": RightList,
  "/right-manage/role/list": RoleList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/update/:id": NewsUpdate, //点击更新按钮调整到的路由
  "/news-manage/preview/:id": NewsPreview, //点击草稿箱新闻标题跳转到的路由
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
};

function NewsRouter(props) {
  const [BackRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
      //   console.log("res", res);
      setBackRouteList([...res[0].data, ...res[1].data]);
      //   console.log("BackRouteList", BackRouteList);
    });
  }, []);

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  const checkRoute = (item) => {
    return (
      (LocalRouterMap[item.key] && item.pagepermisson) || item.routepermisson
    );
  };

  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };
  return (
    <Spin size="large" spinning={props.isLoading}>
      <Switch>
        {BackRouteList.map((item) => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                path={item.key}
                key={item.key}
                component={LocalRouterMap[item.key]}
                exact
              />
            );
          }
          return null;
        })}

        <Redirect from="/" to="/home" exact />
        {BackRouteList.length > 0 && (
          <Route path="*" component={NoPermission} />
        )}
      </Switch>
    </Spin>
  );
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({
  isLoading,
});

export default connect(mapStateToProps)(NewsRouter);
