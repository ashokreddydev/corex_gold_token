import React, { useState, useEffect } from 'react';
import { Table, Card, Pagination, Tabs, Tag, Alert, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { tokenService } from '../services/tokenService';

const HistoryPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { transactions, total, loading } = useTransactionHistory(page, pageSize);
  const [burnRequests, setBurnRequests] = useState([]);
  const [burnLoading, setBurnLoading] = useState(false);

  const SEPOLIA_EXPLORER = 'https://sepolia.etherscan.io/tx';

  useEffect(() => {
    fetchBurnRequests();
  }, []);

  const fetchBurnRequests = async () => {
    try {
      setBurnLoading(true);
      const response = await tokenService.getUserBurnRequests();
      setBurnRequests(response || []);
    } catch (err) {
      console.error('Failed to load burn requests:', err);
    } finally {
      setBurnLoading(false);
    }
  };

  const openEtherscan = (txHash) => {
    if (txHash) {
      window.open(`${SEPOLIA_EXPLORER}/${txHash}`, '_blank');
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'orange',
      approved: 'blue',
      completed: 'green',
      rejected: 'red',
      confirmed: 'green',
      failed: 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: '⏳ Pending',
      approved: '👍 Approved',
      completed: '✅ Completed',
      rejected: '❌ Rejected',
      confirmed: '✅ Confirmed',
      failed: '❌ Failed',
    };
    return statusMap[status] || status;
  };

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
      width: 150,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <span style={{ color: text === 'mint' ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
          {text?.toUpperCase()}
        </span>
      ),
      width: 80,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `${text} GOLD`,
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
      width: 120,
    },
    {
      title: 'Transaction Hash',
      dataIndex: 'txHash',
      key: 'txHash',
      render: (text) =>
        text ? (
          <Button
            type="link"
            size="small"
            onClick={() => openEtherscan(text)}
            style={{ padding: 0 }}
          >
            <code style={{ fontSize: '11px' }}>
              {text.substring(0, 16)}...
              <LinkOutlined style={{ marginLeft: '4px' }} />
            </code>
          </Button>
        ) : (
          <span style={{ color: '#999' }}>Pending</span>
        ),
      width: 200,
    },
  ];

  const burnColumns = [
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
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
      width: 120,
    },
    {
      title: 'Rejection Reason',
      dataIndex: 'rejectionReason',
      key: 'rejectionReason',
      render: (text) => text || '—',
      width: 200,
    },
    {
      title: 'Transaction Hash',
      dataIndex: 'txHash',
      key: 'txHash',
      render: (text) =>
        text ? (
          <Button
            type="link"
            size="small"
            onClick={() => openEtherscan(text)}
            style={{ padding: 0 }}
          >
            <code style={{ fontSize: '11px' }}>
              {text.substring(0, 16)}...
              <LinkOutlined style={{ marginLeft: '4px' }} />
            </code>
          </Button>
        ) : (
          <span style={{ color: '#999' }}>Pending</span>
        ),
      width: 200,
    },
  ];

  const tabItems = [
    {
      key: 'transactions',
      label: '📋 Transactions',
      children: (
        <>
          {transactions.length === 0 && !loading && (
            <Alert
              message="No transactions yet"
              description="Your mint and burn transactions will appear here."
              type="info"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}
          <Table
            columns={transactionColumns}
            dataSource={transactions}
            loading={loading}
            rowKey="_id"
            pagination={false}
            scroll={{ x: 1000 }}
            size="small"
          />
          {total > pageSize && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={(p) => setPage(p)}
                onShowSizeChange={(_, size) => setPageSize(size)}
                showSizeChanger
                pageSizeOptions={['10', '20', '50']}
              />
            </div>
          )}
        </>
      ),
    },
    {
      key: 'burns',
      label: '🔥 Burn Requests',
      children: (
        <>
          {burnRequests.length === 0 && !burnLoading && (
            <Alert
              message="No burn requests yet"
              description="Your burn requests will appear here with their status (Pending, Approved, Rejected)."
              type="info"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}
          <Table
            columns={burnColumns}
            dataSource={burnRequests}
            loading={burnLoading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
            size="small"
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>History & Status</h1>

      <Alert
        message="💡 Click on any transaction hash to view details on Sepolia Etherscan"
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Card>
        <Tabs
          defaultActiveKey="transactions"
          items={tabItems}
          onChange={() => {
            // Refetch burn requests when switching tabs
            if (burnRequests.length === 0) {
              fetchBurnRequests();
            }
          }}
        />
      </Card>
    </div>
  );
};

export default HistoryPage;
