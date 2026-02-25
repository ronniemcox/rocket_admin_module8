import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <h2 className="mb-4">Home</h2>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Agent Management</Card.Title>
              <Card.Text>
                Manage Rocket Elevators agents (create, edit, delete, and view).
              </Card.Text>
              <Button onClick={() => navigate("/agents")}>
                Agent Management
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Transaction Management</Card.Title>
              <Card.Text>
                View the latest transactions and submit new transactions.
              </Card.Text>
              <Button onClick={() => navigate("/transactions")}>
                Transaction Management
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}