import { Layout, Menu, Icon } from 'antd';
import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Store from './Store';

const { Header, Content, Footer, Sider } = Layout;

export default function LayoutView(props) {
  const [collapsed, setCollapsed] = useState(true);
  const history = useHistory();
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
          <Menu.Item
            key="foraging"
            onClick={e => {
              history.push('/foraging');
            }}
          >
            <Icon type="environment" />
            <span className="nav-text">Foraging</span>
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
          {'martolini <3 stardew'}
        </Footer>
      </Layout>
    </Layout>
  );
}
