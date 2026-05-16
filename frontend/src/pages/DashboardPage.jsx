import React from 'react';
import { Row, Col, Card, Statistic, Button, Space, Alert } from 'antd';
import { DollarOutlined, UserOutlined, ShoppingCartOutlined, GiftOutlined, WarningOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { useBalance } from '../hooks/useBalance';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { balance, loading: balanceLoading, error: balanceError } = useBalance();
  const { user } = useAuth();
  const { connect } = useWeb3();
  const navigate = useNavigate();
  const hasWallet = user?.walletAddress;

  return (
    <div>
      <h1>Dashboard</h1>

      {!hasWallet && (
        <Alert
          message="Wallet Not Connected"
          description="Connect your MetaMask wallet to buy tokens and redeem physical gold."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          style={{ marginBottom: '20px' }}
          action={
            <Button size="small" danger onClick={connect}>
              Connect MetaMask
            </Button>
          }
        />
      )}

      {balanceError && (
        <Alert
          message="Balance Error"
          description={balanceError}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '20px' }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Account Balance"
              value={hasWallet ? balance : 'N/A'}
              prefix={<DollarOutlined />}
              suffix={hasWallet ? 'GOLD' : ''}
              loading={balanceLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Account Status"
              value="Active"
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Account Type"
              value={user?.role === 'admin' ? 'Admin' : 'User'}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Wallet"
              value={hasWallet ? user.walletAddress.substring(0, 10) + '...' : 'Not Connected'}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Email"
              value={user?.email?.substring(0, 15) + '...'}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Quick Actions" style={{ marginBottom: '30px' }}>
        <Space wrap>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/buy')}
            disabled={!hasWallet}
            title={hasWallet ? '' : 'Connect MetaMask first'}
          >
            Buy Gold Tokens
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            icon={<GiftOutlined />}
            onClick={() => navigate('/redeem')}
            disabled={!hasWallet}
            title={hasWallet ? '' : 'Connect MetaMask first'}
          >
            Redeem Gold
          </Button>
          <Button
            type="default"
            size="large"
            icon={<HistoryOutlined />}
            onClick={() => navigate('/history')}
          >
            View History
          </Button>
          <Button
            type="default"
            size="large"
            icon={<SettingOutlined />}
            onClick={() => navigate('/profile')}
          >
            Profile Settings
          </Button>
        </Space>
      </Card>

      <Card title="Welcome">
        <p>Welcome to Gold Token! Manage your physical gold investments.</p>
        <ul>
          <li>View your token balance (1 token = 1 gram of gold)</li>
          <li>Buy gold tokens with payment</li>
          <li>Redeem tokens for physical gold</li>
          <li>View transaction history</li>
          <li>Manage your account settings</li>
        </ul>
      </Card>
    </div>
  );
};

export default DashboardPage;
