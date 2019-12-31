import { Layout, Menu, Icon, Tag } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Store from './Store';
import KeepQueryLink from './components/KeepQueryLink';
import styled from 'styled-components';

const OuterDiv = styled.div`
  font-family: VT323;
  line-height: 1;
  font-size: 18px;

  .ant-table {
    font-size: 18px !important;
  }

  .ant-checkbox-wrapper {
    font-size: 18px !important;
  }

  .ant-tag {
    font-size: 18px !important;
  }

  .ant-select {
    font-size: 18px !important;
  }

  .ant-menu-inline .ant-menu-item {
    font-size: 18px !important;
  }
`;

const { Header, Content, Footer, Sider } = Layout;

export default function LayoutView(props) {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const store = Store.useStore();
  const info = store.get('info');
  return (
    <OuterDiv>
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
            <Menu.Item key="farm">
              <KeepQueryLink to="/farm">
                <Icon type="home" />
                <span className="nav-text">Farm</span>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="inventory">
              <KeepQueryLink to="/inventory">
                <Icon type="database" />
                <span className="nav-text">Inventory</span>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="bundles">
              <KeepQueryLink to="/bundles">
                <Icon type="appstore" />
                <span className="nav-text">Bundles</span>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="foraging">
              <KeepQueryLink to="/foraging">
                <Icon type="environment" />
                <span className="nav-text">Foraging</span>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="skills">
              <KeepQueryLink to="/skills">
                <Icon type="user" />
                <span className="nav-text">Skills</span>
              </KeepQueryLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header
            style={{ background: '#fff', padding: 0, paddingLeft: '15px' }}
          >
            <h2>
              {`${info.farmName} farm`}
              <Tag
                style={{ marginLeft: 25 }}
                color="orange"
              >{`${info.currentSeason} ${info.dayOfMonth}`}</Tag>
              <Tag color="magenta">Year {info.year}</Tag>
              <Tag color="gold">
                {`${Math.round(((+info.dailyLuck + 0.1) / 0.2) * 100)}% luck`}
              </Tag>
              <Tag color="green">{info.money}💰</Tag>
            </h2>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              {props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <p>{'martolini <3 stardew'}</p>
          </Footer>
        </Layout>
      </Layout>
    </OuterDiv>
  );
}
