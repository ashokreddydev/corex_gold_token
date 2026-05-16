import React, { useState } from 'react';
import { Card, Form, InputNumber, Button, Alert, message, Divider, Space, Statistic } from 'antd';
import { useMint } from '../hooks/useMint';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { useBalance } from '../hooks/useBalance';

const MintPage = () => {
  const [form] = Form.useForm();
  const { mint, loading, error, success, reset } = useMint();
  const { user } = useAuth();
  const { connect } = useWeb3();
  const { balance } = useBalance();
  const [amount, setAmount] = useState(null);
  const hasWallet = user?.walletAddress;

  const handleMint = async (values) => {
    try {
      reset();
      if (!values.amount || values.amount <= 0) {
        message.error('Amount must be greater than 0');
        return;
      }
      if (values.amount > 10000) {
        message.error('Maximum mint amount is 10,000 tokens');
        return;
      }
      await mint(values.amount);
      message.success('Tokens minted successfully!');
      form.resetFields();
      setAmount(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const isValidAmount = amount && amount > 0 && amount <= 10000;

  return (
    <div>
      <h1>Mint Tokens</h1>

      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        {!hasWallet && (
          <>
            <Alert
              message="MetaMask Not Connected"
              description="You must connect your MetaMask wallet to mint tokens. Please click the button below to connect."
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
            <Divider />
          </>
        )}

        {hasWallet && (
          <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
            <Statistic
              title="Current Balance"
              value={balance}
              suffix="GOLD"
              valueStyle={{ color: '#FFD700' }}
            />
          </Space>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: '20px' }}
          />
        )}

        {success && (
          <Alert
            message="Success"
            description="Tokens minted successfully! Check your wallet or transaction history."
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        <Form form={form} onFinish={handleMint} layout="vertical" disabled={!hasWallet}>
          <Form.Item
            label="Amount to Mint"
            name="amount"
            rules={[
              { required: true, message: '⚠️ Amount is required' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (!Number.isFinite(value)) return Promise.reject('⚠️ Amount must be a valid number');
                  if (value <= 0) return Promise.reject('⚠️ Amount must be greater than 0');
                  if (value > 10000) return Promise.reject('⚠️ Maximum mint amount is 10,000 tokens');
                  if (!Number.isInteger(value)) return Promise.reject('⚠️ Amount must be a whole number');
                  return Promise.resolve();
                },
              },
            ]}
            help="Enter a whole number between 1 and 10,000 tokens"
          >
            <InputNumber
              placeholder="e.g., 100"
              min={1}
              max={10000}
              precision={0}
              onChange={setAmount}
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              disabled={!isValidAmount}
            >
              {loading ? 'Processing...' : 'Mint Tokens'}
            </Button>
          </Form.Item>
        </Form>

        <Alert
          message="ℹ️ Information"
          description="Minting tokens will add them to your wallet. Transactions are recorded on the blockchain."
          type="info"
          style={{ marginTop: '20px' }}
        />
      </Card>
    </div>
  );
};

export default MintPage;
