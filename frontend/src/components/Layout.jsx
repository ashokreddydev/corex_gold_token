import React from 'react';
import { Layout, Menu, Dropdown, Button, Space, Tag, Statistic } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, CreditCardOutlined, DeleteOutlined, HistoryOutlined, SettingOutlined, WalletOutlined, DollarOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { useBalance } from '../hooks/useBalance';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { account, isConnected, connect, isLoading: walletLoading } = useWeb3();
  const { balance, loading: balanceLoading } = useBalance();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '2',
      icon: <CreditCardOutlined />,
      label: 'Buy',
      onClick: () => navigate('/buy'),
    },
    {
      key: '3',
      icon: <DeleteOutlined />,
      label: 'Redeem',
      onClick: () => navigate('/redeem'),
    },
    {
      key: '4',
      icon: <HistoryOutlined />,
      label: 'History',
      onClick: () => navigate('/history'),
    },
    ...(user?.role === 'admin'
      ? [
          {
            key: '5',
            icon: <SettingOutlined />,
            label: 'Admin',
            onClick: () => navigate('/admin'),
          },
        ]
      : []),
  ];

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
        onClick: () => navigate('/profile'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ color: 'white', padding: '20px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
          Gold Token
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', paddingRight: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Gold Token Application</div>
          
          <Space size="large" align="center">
            {/* Balance Display */}
            {isConnected && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: '#fafafa', borderRadius: '8px' }}>
                <DollarOutlined style={{ fontSize: '16px', color: '#FFD700' }} />
                <Statistic 
                  value={balance} 
                  suffix="GOLD" 
                  precision={2}
                  valueStyle={{ fontSize: '16px', color: '#333' }}
                  loading={balanceLoading}
                />
              </div>
            )}

            {/* MetaMask Connection Button/Address */}
            {isConnected ? (
              <Tag color="success" style={{ padding: '6px 12px', cursor: 'pointer', marginRight: '0' }}>
                <WalletOutlined /> {account?.slice(0, 6)}...{account?.slice(-4)}
              </Tag>
            ) : (
              <Button 
                type="primary" 
                icon={<WalletOutlined />}
                onClick={connect}
                loading={walletLoading}
              >
                Connect Wallet
              </Button>
            )}

            {/* User Menu */}
            <Dropdown menu={userMenu} placement="bottomRight">
              <Button icon={<UserOutlined />}>{user?.email}</Button>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px', padding: '24px', background: '#fff' }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center' }}>Gold Token © 2024 - All rights reserved</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
