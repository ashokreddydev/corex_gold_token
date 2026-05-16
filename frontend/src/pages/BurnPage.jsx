import React, { useState } from 'react';
import { Card, Form, InputNumber, Input, Button, Alert, message, Space, Statistic } from 'antd';
import { useBurn } from '../hooks/useBurn';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { useBalance } from '../hooks/useBalance';

const BurnPage = () => {
  const [form] = Form.useForm();
  const { burn, loading, error, success, reset } = useBurn();
  const { user } = useAuth();
  const { connect } = useWeb3();
  const { balance } = useBalance();
  const [amount, setAmount] = useState(null);
  const [reason, setReason] = useState('');
  const hasWallet = user?.walletAddress;

  const handleBurn = async (values) => {
    try {
      reset();
      if (!values.amount || values.amount <= 0) {
        message.error('Amount must be greater than 0');
        return;
      }
      if (values.amount > balance) {
        message.error(`Cannot burn more than your balance (${balance} tokens)`);
        return;
      }
      if (!values.reason || values.reason.trim().length < 5) {
        message.error('Please provide a reason (at least 5 characters)');
        return;
      }
      await burn(values.amount, values.reason);
      message.success('Burn request submitted successfully!');
      form.resetFields();
      setAmount(null);
      setReason('');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const isValidAmount = amount && amount > 0 && amount <= balance;
  const isValidReason = reason && reason.trim().length >= 5;
  const canSubmit = isValidAmount && isValidReason;

  return (
    <div>
      <h1>Burn Tokens</h1>

      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        {!hasWallet && (
          <>
            <Alert
              message="MetaMask Not Connected"
              description="You must connect your MetaMask wallet to burn tokens. Please click the button below to connect."
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
          <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
            <Statistic
              title="Available Balance"
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
            description="Burn request submitted! Awaiting admin approval. Check history for status."
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        <Form form={form} onFinish={handleBurn} layout="vertical" disabled={!hasWallet} style={{ width: '100%' }}>
          <Form.Item
            label="Amount to Burn"
            name="amount"
            rules={[
              { required: true, message: '⚠️ Amount is required' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (!Number.isFinite(value)) return Promise.reject('⚠️ Amount must be a valid number');
                  if (value <= 0) return Promise.reject('⚠️ Amount must be greater than 0');
                  if (value > balance) return Promise.reject(`⚠️ Cannot burn more than your balance (${balance} tokens)`);
                  if (!Number.isInteger(value)) return Promise.reject('⚠️ Amount must be a whole number');
                  return Promise.resolve();
                },
              },
            ]}
            help={`Enter a whole number between 1 and ${balance} tokens`}
            style={{ marginBottom: '20px', width: '100%' }}
          >
            <InputNumber
              placeholder="e.g., 50"
              min={1}
              max={balance}
              precision={0}
              onChange={setAmount}
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Reason for Burning"
            name="reason"
            rules={[
              { required: true, message: '⚠️ Reason is required' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (value.trim().length < 5) return Promise.reject('⚠️ Reason must be at least 5 characters');
                  if (value.length > 500) return Promise.reject('⚠️ Reason cannot exceed 500 characters');
                  return Promise.resolve();
                },
              },
            ]}
            help={`${reason.length}/500 characters - Explain why you want to burn these tokens`}
          >
            <Input.TextArea
              placeholder="e.g., Reducing supply for price stability"
              rows={4}
              maxLength={500}
              onChange={(e) => setReason(e.target.value)}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={loading}
              block
              size="large"
              disabled={!canSubmit}
            >
              {loading ? 'Processing...' : 'Submit Burn Request'}
            </Button>
          </Form.Item>
        </Form>

        <Alert
          message="⚠️ Warning"
          description="Burning tokens is permanent and irreversible. Please ensure you have a valid reason and have verified the amount."
          type="warning"
          style={{ marginTop: '20px' }}
        />
      </Card>
    </div>
  );
};

export default BurnPage;
