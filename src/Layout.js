import { Layout, Menu, Icon } from 'antd';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

export default function LayoutView(props) {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const location = useLocation();
  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={c => setCollapsed(c)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname.slice(1)]}
        >
          <Menu.Item
            key="foraging"
            onClick={e => {
              history.push('/foraging');
            }}
          >
            <Icon type="environment" />
            <span
              className="nav-text"
              onClick={e => {
                history.push('/foraging');
              }}
            >
              Foraging
            </span>
          </Menu.Item>
          <Menu.Item
            key="farm"
            onClick={e => {
              history.push('/farm');
            }}
          >
            <Icon type="home" />
            <span className="nav-text">Farm</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff' }}>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          {'martolini <3 stardew'}
        </Footer>
      </Layout>
    </Layout>
  );
}
