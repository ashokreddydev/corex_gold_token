import React, { useState } from 'react';
import { Card, Form, InputNumber, Input, Button, Alert, message, Space, Statistic, Row, Col, Divider, Steps } from 'antd';
import { DollarOutlined, CheckCircleOutlined, SendOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { useBalance } from '../hooks/useBalance';
import { tokenService } from '../services/tokenService';

const RedeemPage = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { connect } = useWeb3();
  const { balance, loading: balanceLoading } = useBalance();
  const [amount, setAmount] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [redemptionStep, setRedemptionStep] = useState(0);
  const hasWallet = user?.walletAddress;

  const handleRedeem = async (values) => {
    try {
      setLoading(true);
      if (!values.amount || values.amount <= 0) {
        message.error('Amount must be greater than 0');
        return;
      }
      if (values.amount > balance) {
        message.error(`Cannot redeem more than your balance (${balance} tokens)`);
        return;
      }
      if (!values.reason || values.reason.trim().length < 10) {
        message.error('Please provide a detailed redemption reason (at least 10 characters)');
        return;
      }

      // Submit redemption request
      await tokenService.burn(values.amount, values.reason);
      message.success('✅ Redemption request submitted! Admin will verify and process your request.');
      
      setRedemptionStep(1);
      form.resetFields();
      setAmount(null);
      setReason('');

      // Reset step after 3 seconds
      setTimeout(() => setRedemptionStep(0), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Redemption failed';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isValidAmount = amount && amount > 0 && amount <= balance;
  const isValidReason = reason && reason.trim().length >= 10;
  const canSubmit = isValidAmount && isValidReason;

  return (
    <div>
      <h1>Redeem Physical Gold</h1>

      <Card style={{ maxWidth: '700px', margin: '0 auto' }}>
        {!hasWallet && (
          <>
            <Alert
              message="MetaMask Not Connected"
              description="You must connect your MetaMask wallet to redeem tokens. Please click the button below to connect."
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

        <Divider>Your Gold Tokens</Divider>
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12}>
            <Statistic
              title="Available Balance"
              value={balance}
              suffix="grams"
              prefix={<DollarOutlined />}
              loading={balanceLoading}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title="Redemption Value"
              value={amount ? (amount * 65).toFixed(2) : '0'}
              prefix="$"
              suffix="USD"
            />
          </Col>
        </Row>

        <Divider>Redemption Process</Divider>
        <Steps
          current={redemptionStep}
          items={[
            { title: 'Submit Request', description: 'Fill and submit the form' },
            { title: 'Admin Verification', description: 'Admin will verify your request' },
            { title: 'Shipment', description: 'Physical gold will be shipped' },
            { title: 'Complete', description: 'You receive your gold' },
          ]}
          style={{ marginBottom: '20px' }}
        />

        {redemptionStep === 1 && (
          <Alert
            message="✅ Redemption Request Submitted"
            description="Your request has been sent to admins for verification. You will receive an email update shortly."
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            closable
            style={{ marginBottom: '20px' }}
          />
        )}

        <Divider>Request Redemption</Divider>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRedeem}
        >
          <Form.Item
            label="Amount to Redeem (grams of gold)"
            name="amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 1, message: 'Minimum 1 gram' },
            ]}
          >
            <InputNumber
              placeholder="Enter amount"
              min={1}
              max={balance || 0}
              step={1}
              onChange={setAmount}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Shipping Address"
            name="shippingAddress"
            rules={[
              { required: true, message: 'Please enter shipping address' },
              { min: 10, message: 'Address must be at least 10 characters' },
            ]}
          >
            <Input.TextArea
              placeholder="Enter your full shipping address"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="Redemption Reason"
            name="reason"
            rules={[
              { required: true, message: 'Please provide a reason' },
              { min: 10, message: 'Reason must be at least 10 characters' },
            ]}
          >
            <Input.TextArea
              placeholder="Why are you redeeming? (e.g., need physical gold for investment, personal use, etc.)"
              rows={3}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Item>

          {amount && (
            <Card style={{ backgroundColor: '#f6ffed', marginBottom: '20px', borderColor: '#b7eb8f' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Redeeming"
                    value={amount}
                    suffix="GOLD"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="USD Value"
                    value={(amount * 65).toFixed(2)}
                    prefix="$"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
              <Divider style={{ margin: '10px 0' }} />
              <p style={{ fontSize: '12px', color: '#666' }}>
                <strong>Note:</strong> Shipping typically takes 5-7 business days. You will receive tracking information via email.
              </p>
            </Card>
          )}

          <Alert
            message="⚠️ Important Information"
            description={
              <ul style={{ marginBottom: 0 }}>
                <li>Redemption requests require admin approval</li>
                <li>Your tokens will be locked until approved</li>
                <li>Physical gold will be insured during shipment</li>
                <li>Purity: 99.99% pure gold bars</li>
              </ul>
            }
            type="warning"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Space style={{ width: '100%' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SendOutlined />}
              disabled={!hasWallet || !canSubmit}
              loading={loading}
            >
              Submit Redemption Request
            </Button>
          </Space>
        </Form>

        <Divider>Redemption Terms</Divider>
        <ul>
          <li>Minimum redemption: 1 GOLD token (1 gram)</li>
          <li>Maximum per request: Your available balance</li>
          <li>Processing time: 2-3 business days after approval</li>
          <li>Shipping time: 5-7 business days</li>
          <li>Insurance: Included for shipments over $1,000</li>
          <li>Refund policy: 30-day inspection period</li>
        </ul>
      </Card>
    </div>
  );
};

export default RedeemPage;
