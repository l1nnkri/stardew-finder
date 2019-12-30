import { Layout, Menu, Icon } from 'antd';
import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Store from './Store';
import KeepQueryLink from './components/KeepQueryLink';
import { storage } from './firebase';

const { Header, Content, Footer, Sider } = Layout;

export default function LayoutView(props) {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const store = Store.useStore();
  const info = store.get('info');
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
          <Menu.Item key="foraging">
            <KeepQueryLink to="/foraging">
              <Icon type="environment" />
              <span className="nav-text">Foraging</span>
            </KeepQueryLink>
          </Menu.Item>
          <Menu.Item key="farm">
            <KeepQueryLink to="/farm">
              <Icon type="home" />
              <span className="nav-text">Farm</span>
            </KeepQueryLink>
          </Menu.Item>
          <Menu.Item key="bundles">
            <KeepQueryLink to="/bundles">
              <Icon type="appstore" />
              <span className="nav-text">Bundles</span>
            </KeepQueryLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header style={{ background: '#fff', padding: 0, paddingLeft: '15px' }}>
          <h2>
            Tegridy Farms - {info.currentSeason} {info.dayOfMonth} - Year{' '}
            {info.year}
          </h2>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff' }}>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <p>
            {'martolini <3 stardew'} -{' '}
            <a href="" target="blank">
              Download gamestate here
            </a>
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
}
