import React, { useState } from 'react';
import { Modal, Button, Row, Col } from "react-bootstrap";
import { FaUserCircle } from 'react-icons/fa';

function AdminPanel() {
  // State management
  const [activeTab, setActiveTab] = useState('Users');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Static demo data
  const users = [
    { id: 'usr001', name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 'usr002', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
  ];

  const orders = [
    { 
      id: 'ord001', 
      userEmail: 'john@example.com', 
      createdAt: '2023-05-15 10:30', 
      total: 99.99, 
      status: 'pending',
      items: [
        { productId: 'prod1', productName: 'Gemstone Tree', price: 49.99, quantity: 1, image: 'placeholder.jpg' },
        { productId: 'prod2', productName: 'Healing Stick', price: 25.00, quantity: 2, image: 'placeholder.jpg' }
      ],
      shippingAddress: '123 Main St, City, Country'
    }
  ];

  const feedback = [
    { id: 'fb001', email: 'user@example.com', message: 'Great products!', createdAt: '2023-05-10' }
  ];

  // Handlers
  const handleViewUser = (user) => setSelectedUser(user);
  const handleViewOrder = (order) => setSelectedOrder(order);

  // Tab content renderer
  const renderContent = () => {
    switch (activeTab) {
      case 'Users':
        return (
          <div style={contentBoxStyle}>
            <h2>User Management</h2>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={trStyle}>
                      <td style={tdStyle}>{user.id}</td>
                      <td style={tdStyle}>{user.name}</td>
                      <td style={tdStyle}>{user.email}</td>
                      <td style={tdStyle}>
                        <button 
                          style={actionButtonStyle}
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Orders':
        return (
          <div style={contentBoxStyle}>
            <h2>Order Management</h2>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>User Email</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={trStyle}>
                      <td style={tdStyle}>{order.id}</td>
                      <td style={tdStyle}>{order.userEmail}</td>
                      <td style={tdStyle}>{order.createdAt}</td>
                      <td style={tdStyle}>${order.total.toFixed(2)}</td>
                      <td style={tdStyle}>
                        <span style={{
                          color: order.status === 'completed' ? '#2ecc71' : 
                                order.status === 'pending' ? '#f39c12' : '#3498db',
                          fontWeight: 'bold'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button 
                          style={actionButtonStyle}
                          onClick={() => handleViewOrder(order)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'UserFeedback':
        return (
          <div style={contentBoxStyle}>
            <h2>User Feedback</h2>
            <div style={feedbackContainerStyle}>
              {feedback.map(item => (
                <div key={item.id} style={feedbackCardStyle}>
                  <div style={feedbackHeaderStyle}>
                    <span style={feedbackEmailStyle}>{item.email}</span>
                    <span style={feedbackDateStyle}>{item.createdAt}</span>
                  </div>
                  <div style={feedbackBodyStyle}>
                    <p style={feedbackMessageStyle}>{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div style={contentBoxStyle}>
            <h2>{activeTab}</h2>
            <p>Static content for {activeTab} tab.</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside style={asideStyle}>
        <ul style={asideListStyle}>
          {['Users', 'Orders', 'Products', 'UserFeedback', 'Add Product'].map((item) => (
            <li key={item} style={asideListItemStyle}>
              <button 
                style={{
                  ...asideButtonStyle,
                  backgroundColor: activeTab === item ? '#3498db' : '#34495e'
                }}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Header */}
      <nav style={navStyle}>
        <div style={navContainerStyle}>
          <div style={logoStyle}>
            <h3 style={{ color: 'white' }}>Admin Panel</h3>
          </div>
          <div style={{ marginLeft: 'auto', paddingRight: '20px' }}>
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => setShowProfileModal(true)}
            >
              <FaUserCircle style={{ fontSize: '28px', color: 'white' }} />
              <span style={{ marginLeft: '8px', color: 'white' }}>Admin</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={mainStyle}>
        {renderContent()}

        {/* User Detail Modal */}
        {selectedUser && (
          <Modal show onHide={() => setSelectedUser(null)} centered>
            <Modal.Header closeButton>
              <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <Modal show onHide={() => setSelectedOrder(null)} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Order #{selectedOrder.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <p><strong>User:</strong> {selectedOrder.userEmail}</p>
                  <p><strong>Date:</strong> {selectedOrder.createdAt}</p>
                  <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Status:</strong> 
                    <span style={{ 
                      color: selectedOrder.status === 'completed' ? '#2ecc71' : '#f39c12',
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}>
                      {selectedOrder.status}
                    </span>
                  </p>
                </Col>
              </Row>
              <h5 className="mt-4">Order Items</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img src={item.image} alt={item.productName} width="50" />
                      </td>
                      <td>{item.productName}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Profile Modal */}
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Admin Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> Admin User</p>
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Role:</strong> Administrator</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
}

// Styles (same as your original)
const asideStyle = {
  position: 'fixed',
  left: "0",
  top: "70px",
  width: "200px",
  height: "calc(100vh - 70px)",
  backgroundColor: "#2c3e50",
  zIndex: "100",
  padding: "20px 0",
  overflowY: "auto"
};

const asideListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const asideListItemStyle = {
  margin: "5px 10px",
  borderRadius: "5px",
  overflow: "hidden"
};

const asideButtonStyle = {
  width: "100%",
  padding: "12px 15px",
  border: "none",
  backgroundColor: "#34495e",
  color: "#ecf0f1",
  fontSize: "16px",
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const navStyle = {
  position: 'fixed',
  top: "0",
  left: "0",
  width: "100%",
  height: "70px",
  zIndex: "1000",
  backgroundColor: "#d32936",
  display: "flex",
  alignItems: "center",
  padding: "0 20px"
};

const navContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%"
};

const logoStyle = {
  height: "50px",
  display: "flex",
  alignItems: "center"
};

const mainStyle = {
  marginLeft: "200px",
  marginTop: "70px",
  padding: "20px",
  minHeight: "calc(100vh - 70px)",
  backgroundColor: "#f5f5f5"
};

const contentBoxStyle = {
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
};

const tableContainerStyle = {
  overflowX: "auto"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px"
};

const thStyle = {
  backgroundColor: "#34495e",
  color: "white",
  padding: "12px",
  textAlign: "left"
};

const trStyle = {
  borderBottom: "1px solid #ddd"
};

const tdStyle = {
  padding: "12px",
  verticalAlign: "middle"
};

const actionButtonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer"
};

const feedbackContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const feedbackCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '15px'
};

const feedbackHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px'
};

const feedbackEmailStyle = {
  fontWeight: 'bold'
};

const feedbackDateStyle = {
  color: '#777'
};

const feedbackBodyStyle = {
  marginBottom: '10px'
};

const feedbackMessageStyle = {
  margin: 0
};

export default AdminPanel;