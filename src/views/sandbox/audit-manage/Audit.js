import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Tag, notification } from "antd";

export default function Audit() {
  const [dataSource, setdataSource] = useState([]);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };

    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      setdataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              ...list.filter((item) => item.author === username), //把自己过滤出来，同时把同一个区域的编辑的过滤出来
              ...list.filter(
                (item) =>
                  item.region === region &&
                  roleObj[item.role.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        //render属性是自定义样式
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <div>{category.title}</div>;
      },
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"]; //颜色
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"]; //状态
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>; //Tag是一个状态图标
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button type="parmary" onClick={() => handleAudit(item, 2, 1)}>
              通过
            </Button>
            <Button danger onClick={() => handleAudit(item, 3, 0)}>
              驳回
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【审核管理/审核列表】中查看您的新闻审核状态`,
          placement: "bottomRight",
        });
      });
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
