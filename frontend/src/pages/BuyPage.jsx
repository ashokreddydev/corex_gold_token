import React, { useState } from 'react';
import { Card, Form, InputNumber, Button, Alert, message, Divider, Space, Statistic, Row, Col } from 'antd';
import { ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { useBalance } from '../hooks/useBalance';
import { tokenService } from '../services/tokenService';

const BuyPage = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { connect } = useWeb3();
  const { balance, refetch: refetchBalance } = useBalance();
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasWallet = user?.walletAddress;

  // Price per token (1 GOLD = $65)
  const PRICE_PER_TOKEN = 65;
  const totalPrice = amount ? amount * PRICE_PER_TOKEN : 0;

  const handleBuy = async (values) => {
    try {
      setLoading(true);
      console.log('Buy form values:', values);
      
      if (!hasWallet) {
        message.error('❌ Please connect your MetaMask wallet first');
        return;
      }
      
      if (!values.amount || values.amount <= 0) {
        message.error('❌ Amount must be greater than 0');
        return;
      }
      if (values.amount > 10000) {
        message.error('❌ Maximum purchase amount is 10,000 tokens');
        return;
      }

      console.log('Sending mint request with amount:', values.amount);
      
      // Call mint endpoint to purchase tokens
      const response = await tokenService.mint(values.amount);
      console.log('Purchase response:', response);
      
      message.success(`✅ Successfully purchased ${values.amount} GOLD tokens!`);
      form.resetFields();
      setAmount(null);
      
      // Refresh balance after short delay
      setTimeout(() => refetchBalance(), 1500);
    } catch (err) {
      console.error('Buy error:', err);
      const errorMsg = typeof err === 'string' ? err : (err.error || err.message || 'Purchase failed');
      message.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const isValidAmount = amount && amount > 0 && amount <= 10000;

  return (
    <div>
      <h1>Buy Gold Tokens</h1>

      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        {!hasWallet && (
          <>
            <Alert
              message="MetaMask Not Connected"
              description="You must connect your MetaMask wallet to buy tokens. Please click the button below to connect."
              type="warning"
              showIcon
              style={{ marginBottom: '20px' }}
            />
            <Button
              type="primary"
              size="large"
              onClick={connect}
              block
              style={{ marginBottom: '20px' }}
            >
              Connect MetaMask
            </Button>
          </>
        )}

        {hasWallet && (
          <Alert
            message="✅ Wallet Connected"
            description={`Connected to: ${user.walletAddress.substring(0, 16)}...`}
            type="success"
            showIcon
            closable
            style={{ marginBottom: '20px' }}
          />
        )}

        <Divider>Current Holdings</Divider>
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12}>
            <Statistic
              title="Your Balance"
              value={balance}
              suffix="GOLD"
              prefix={<DollarOutlined />}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title="Current Price"
              value={PRICE_PER_TOKEN}
              suffix="USD/GOLD"
              prefix="$"
            />
          </Col>
        </Row>

        <Divider>Purchase Tokens</Divider>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleBuy}
        >
          <Form.Item
            label="Amount to Buy (GOLD tokens)"
            name="amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 1, message: 'Minimum 1 token' },
              { type: 'number', max: 10000, message: 'Maximum 10,000 tokens' },
            ]}
          >
            <InputNumber
              placeholder="Enter amount (1-10,000)"
              min={1}
              max={10000}
              step={1}
              onChange={setAmount}
              style={{ width: '100%' }}
            />
          </Form.Item>

          {amount && (
            <Card style={{ backgroundColor: '#f0f5ff', marginBottom: '20px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Statistic
                    title="Tokens"
                    value={amount}
                    suffix="GOLD"
                  />
                </Col>
                <Col xs={12}>
                  <Statistic
                    title="Total Price"
                    value={totalPrice}
                    prefix="$"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>
            </Card>
          )}

          <Alert
            message="ℹ️ Instant Purchase"
            description="Tokens are minted directly to your wallet. 1 GOLD Token = 1 gram of physical gold backed at $65/gram"
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          {!hasWallet && (
            <Alert
              message="⚠️ Wallet Required"
              description="Connect your MetaMask wallet to proceed"
              type="warning"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}

          {hasWallet && !isValidAmount && (
            <Alert
              message="⚠️ Enter Valid Amount"
              description="Please enter an amount between 1 and 10,000 tokens"
              type="warning"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}

          <Space style={{ width: '100%' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<ShoppingCartOutlined />}
              disabled={!hasWallet || !isValidAmount}
              loading={loading}
            >
              Buy Now (${totalPrice})
            </Button>
          </Space>
        </Form>

        <Divider>How It Works</Divider>
        <ol>
          <li>Connect your MetaMask wallet</li>
          <li>Enter number of tokens you want to buy</li>
          <li>Review the total price (shown on screen)</li>
          <li>Click "Buy Now" to purchase</li>
          <li>Approve the transaction in MetaMask</li>
          <li>Tokens will be credited to your wallet immediately</li>
        </ol>
      </Card>
    </div>
  );
};

export default BuyPage;
