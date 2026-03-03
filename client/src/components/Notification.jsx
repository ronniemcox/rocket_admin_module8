import Alert from "react-bootstrap/Alert";

export default function Notification({ show, variant = "success", message }) {
  if (!show || !message) return null;

  return (
    <Alert variant={variant} className="mt-3">
      {message}
    </Alert>
  );
}