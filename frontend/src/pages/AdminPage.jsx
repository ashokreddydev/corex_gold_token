import React, { useState } from 'react';
import { Card, Table, Button, message, Modal, Space, Tag, Form, Input, Tabs, Statistic, Row, Col, InputNumber } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WalletOutlined, CreditCardOutlined } from '@ant-design/icons';
import { tokenService } from '../services/tokenService';
import { userService } from '../services/userService';

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [burnRequests, setBurnRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const [mintForm] = Form.useForm();

  React.useEffect(() => {
    fetchBurnRequests();
    fetchUsers();
    fetchVaultBalance();
  }, []);

  const fetchBurnRequests = async () => {
    try {
      setLoading(true);
      const response = await tokenService.getBurnRequests();
      setBurnRequests(response || []);
    } catch (err) {
      message.error('Failed to load burn requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await userService.getUsers();
      setUsers(response || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      message.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchVaultBalance = async () => {
    try {
      setVaultLoading(true);
      const response = await tokenService.getVaultBalance();
      setVaultBalance(response.balance || 0);
    } catch (err) {
      console.error('Failed to load vault balance:', err);
      message.error('Failed to load vault balance');
    } finally {
      setVaultLoading(false);
    }
  };

  const handleApproveBurn = (id) => {
    Modal.confirm({
      title: 'Approve Burn Request',
      content: 'Are you sure you want to approve this burn request? This will execute the burn transaction on the blockchain.',
      okText: 'Yes, Approve',
      cancelText: 'Cancel',
      okButtonProps: { danger: false },
      async onOk() {
        try {
          setActionLoading((prev) => ({ ...prev, [id]: true }));
          await tokenService.approveBurnRequest(id);
          message.success('✅ Burn request approved! Transaction executed.');
          
          // Update local state
          setBurnRequests((prev) =>
            prev.map((req) =>
              req._id === id ? { ...req, status: 'approved' } : req
            )
          );
          fetchBurnRequests();
        } catch (err) {
          message.error(err.message || 'Failed to approve burn request');
        } finally {
          setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
      },
    });
  };

  const handleRejectBurn = (id) => {
    Modal.confirm({
      title: 'Reject Burn Request',
      content: (
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            label="Rejection Reason"
            name="reason"
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <Input.TextArea
              placeholder="Why are you rejecting this burn request?"
              rows={3}
            />
          </Form.Item>
        </Form>
      ),
      okText: 'Yes, Reject',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      async onOk() {
        try {
          const values = await rejectForm.validateFields();
          setActionLoading((prev) => ({ ...prev, [id]: true }));
          await tokenService.rejectBurnRequest(id, values.reason);
          message.success('❌ Burn request rejected and user notified.');
          
          // Update local state
          setBurnRequests((prev) =>
            prev.map((req) =>
              req._id === id ? { ...req, status: 'rejected' } : req
            )
          );
          rejectForm.resetFields();
          fetchBurnRequests();
        } catch (err) {
          message.error(err.message || 'Failed to reject burn request');
        } finally {
          setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
      },
    });
  };

  const handleMintTokens = async (values) => {
    try {
      setActionLoading((prev) => ({ ...prev, mint: true }));
      await tokenService.mint(values.amount);
      message.success(`✅ Successfully minted ${values.amount} tokens to user!`);
      mintForm.resetFields();
      setMintModalVisible(false);
      fetchVaultBalance();
    } catch (err) {
      message.error(err.message || 'Failed to mint tokens');
    } finally {
      setActionLoading((prev) => ({ ...prev, mint: false }));
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', label: '⏳ Pending' },
      approved: { color: 'green', label: '✅ Approved' },
      completed: { color: 'green', label: '✅ Completed' },
      rejected: { color: 'red', label: '❌ Rejected' },
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const columns = [
    {
      title: 'User',
      dataIndex: ['userId', 'email'],
      key: 'userEmail',
      render: (_, record) => record.userId?.email || 'Unknown',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
      width: 150,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `${text} GOLD`,
      width: 100,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (text) => (
        <span style={{ maxWidth: '300px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </span>
      ),
      width: 250,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      width: 120,
    },
    {
      title: 'Transaction Hash',
      dataIndex: 'txHash',
      key: 'txHash',
      render: (text) => (
        <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
          {text ? `${text.substring(0, 16)}...` : 'N/A'}
        </code>
      ),
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isProcessed = record.status === 'approved' || record.status === 'rejected' || record.status === 'completed';
        const isLoading = actionLoading[record._id];
        
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApproveBurn(record._id)}
              disabled={isProcessed}
              loading={isLoading}
            >
              {record.status === 'approved' ? 'Approved' : 'Approve'}
            </Button>
            <Button
              type="primary"
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleRejectBurn(record._id)}
              disabled={isProcessed}
              loading={isLoading}
            >
              {record.status === 'rejected' ? 'Rejected' : 'Reject'}
            </Button>
          </Space>
        );
      },
      width: 180,
    },
  ];

  const pendingCount = burnRequests.filter((r) => r.status === 'pending').length;

  const userColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role?.toUpperCase() || 'USER'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (address) => (
        <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
          {address ? `${address.substring(0, 16)}...` : 'Not Connected'}
        </code>
      ),
      width: 200,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      width: 120,
    },
  ];

  const tabItems = [
    {
      key: 'burnRequests',
      label: `Redemption Requests (${pendingCount} Pending)`,
      children: (
        <Card loading={loading}>
          <Table
            columns={columns}
            dataSource={burnRequests}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
            size="small"
          />
          <Card title="Statistics" style={{ marginTop: '20px' }}>
            <Space>
              <div>
                <span style={{ fontWeight: 'bold' }}>Total Requests: </span>
                {burnRequests.length}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>⏳ Pending: </span>
                <Tag color="orange">{pendingCount}</Tag>
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>✅ Approved: </span>
                <Tag color="green">{burnRequests.filter((r) => r.status === 'approved').length}</Tag>
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>✅ Completed: </span>
                <Tag color="green">{burnRequests.filter((r) => r.status === 'completed').length}</Tag>
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>❌ Rejected: </span>
                <Tag color="red">{burnRequests.filter((r) => r.status === 'rejected').length}</Tag>
              </div>
            </Space>
          </Card>
        </Card>
      ),
    },
    {
      key: 'vault',
      label: 'Vault & Minting',
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
            <Col xs={24} sm={12} lg={8}>
              <Card loading={vaultLoading}>
                <Statistic
                  title="Vault Balance (ETH)"
                  value={Number.parseFloat(vaultBalance).toFixed(4)}
                  prefix={<WalletOutlined />}
                  valueStyle={{ color: '#FFD700' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Mint Tokens">
            <Form
              form={mintForm}
              layout="vertical"
              onFinish={handleMintTokens}
              style={{ maxWidth: '400px' }}
            >
              <Form.Item
                label="Amount to Mint"
                name="amount"
                rules={[
                  { required: true, message: 'Please enter amount' },
                  { type: 'number', min: 1, message: 'Amount must be at least 1' },
                ]}
              >
                <InputNumber
                  placeholder="Enter amount"
                  min={1}
                  max={10000}
                  step={1}
                />
              </Form.Item>
              <Button
                type="primary"
                icon={<CreditCardOutlined />}
                htmlType="submit"
                loading={actionLoading.mint}
              >
                Mint Tokens
              </Button>
            </Form>
          </Card>
        </div>
      ),
    },
    {
      key: 'users',
      label: `Users Management (${users.length})`,
      children: (
        <Card loading={usersLoading}>
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
            size="small"
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Tabs items={tabItems} />
    </div>
  );
};

export default AdminPage;
