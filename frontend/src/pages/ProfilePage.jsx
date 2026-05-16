import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, message } from 'antd';
import { userService } from '../services/userService';

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      setError('');
      await userService.updateProfile(values);
      message.success('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Profile Settings</h1>

      <Card style={{ maxWidth: '600px' }}>
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

        <Form form={form} onFinish={handleUpdateProfile} layout="vertical">
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="Enter your email" disabled />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ message: 'Invalid phone format' }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Security" style={{ marginTop: '20px', maxWidth: '600px' }}>
        <Button type="primary" danger block>
          Change Password
        </Button>
      </Card>
    </div>
  );
};

export default ProfilePage;
