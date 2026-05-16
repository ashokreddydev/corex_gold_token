import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Alert, Tabs, Divider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService'
import { setUser } from '../store/slices/authSlice'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { checkAuth } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('1')

  const handleEmailLogin = async (values) => {
    try {
      setLoading(true)
      setError('')
      const response = await authService.login(values.email, values.password)
      console.log('Login response:', response)
      dispatch(setUser(response.user))
      setTimeout(() => navigate('/dashboard'), 100)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if(!user) {
      checkAuth();
    } else {
      navigate('/dashboard');
    }
    checkAuth()
  }, [checkAuth, navigate, user]);

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    try {
      setLoading(true)
      setError('')
      const response = await authService.register(
        values.email,
        values.password,
        values.fullName
      )
      console.log('Register response:', response)
      dispatch(setUser(response.user))
      setTimeout(() => navigate('/dashboard'), 100)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    {
      key: '1',
      label: 'Email Login',
      children: (
        <Form
          form={loginForm}
          onFinish={handleEmailLogin}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Register',
      children: (
        <Form
          form={registerForm}
          onFinish={handleRegister}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password!' }]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Account
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
      }}
    >
      <Card
        style={{ width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        title={
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            Gold Token
          </div>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />
        )}

        <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />

        {/* <Divider style={{ margin: '16px 0' }} />

        <Alert
          message="ℹ️ MetaMask Required"
          description="After email login or registration, you'll be prompted to connect your MetaMask wallet on the dashboard for token operations like minting and burning."
          type="info"
          showIcon
          style={{ marginTop: '16px' }}
        /> */}
      </Card>
    </div>
  )
}

export default LoginPage
