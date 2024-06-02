import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  PencilSquare,
  PersonFill,
  PersonLinesFill,
  CalendarFill,
  LockFill,
  Lock,
  EyeFill,
  EyeSlashFill,
} from "react-bootstrap-icons";
import api from "../api/api";
import { useProfileData } from "../hooks/useProfileData";
import { useUserProfile } from "../context/UserProfileContext";
import { useNavigate } from "react-router-dom";
import BackButton from "./NavigateButton";
import ToastNotification from "./ToastNotification";
import { AxiosError } from "axios";

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileData {
  id: number;
  first_name: string;
  last_name: string;
  personnummer: string;
  user_email: string;
  image: string;
}

interface ErrorResponse {
  detail?: string;
  old_password?: string[];
  new_password?: string[];
}

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  const regex_password = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password.length < 8) {
    errors.push("The password must contain at least 8 characters.");
  }
  if (!regex_password.test(password)) {
    errors.push("The password must contain at least one uppercase letter, one number, and one special character.");
  }

  return errors;
};

const ProfileComponent: React.FC = () => {
  const profiles: ProfileData[] = useProfileData();
  const { loadProfile, setProfile } = useUserProfile();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(new Map());
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [formData, setFormData] = useState<Map<number, { firstName: string; lastName: string; personnummer: string }>>(new Map());
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState<{ [key: string]: boolean }>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const newFormData = new Map();
    profiles.forEach((profile) => {
      newFormData.set(profile.id, {
        firstName: profile.first_name,
        lastName: profile.last_name,
        personnummer: profile.personnummer,
      });
    });
    setFormData(newFormData);
  }, [profiles]);

  const handleFileChange = (
    profileId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFiles(new Map(selectedFiles.set(profileId, file)));
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrls(new Map(previewUrls.set(profileId, fileUrl)));
    }
  };

  const handleInputChange = (
    profileId: number,
    field: string,
    value: string
  ) => {
    const existing = formData.get(profileId) || {
      firstName: "",
      lastName: "",
      personnummer: "",
    };
    const updated = { ...existing, [field]: value };
    setFormData(new Map(formData.set(profileId, updated)));

    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (
    field: string,
    value: string
  ) => {
    setPasswordData((prevData) => ({ ...prevData, [field]: value }));

    if (errors.password) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const validatePersonnummer = (personnummer: string) => {
    const regex = /^\d{6}-\d{4}$/;
    return regex.test(personnummer);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    profileId: number
  ) => {
    event.preventDefault();
    const payload = new FormData();
    if (selectedFiles.has(profileId)) {
      payload.append("image", selectedFiles.get(profileId) as Blob);
    }
    const data = formData.get(profileId);
    if (data) {
      payload.append("first_name", data.firstName);
      payload.append("last_name", data.lastName);
      if (!validatePersonnummer(data.personnummer)) {
        setErrors({
          ...errors,
          personnummer: ["Invalid personnummer format. Expected format: YYMMDD-XXXX."],
        });
        return;
      }
      payload.append("personnummer", data.personnummer);
    }

    try {
      const response = await api.patch(`/profile/${profileId}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadProfile();
      setProfile(response.data);
      setToastMessage("The profile has been updated.");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
      setErrors({
        ...errors,
        general: ["Failed to update profile."],
      });
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const { newPassword, confirmPassword, oldPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setErrors({
        ...errors,
        password: ["New password and confirm password do not match."],
      });
      return;
    }

    const passwordValidationErrors = validatePassword(newPassword);
    if (passwordValidationErrors.length > 0) {
      setErrors({
        ...errors,
        password: passwordValidationErrors,
      });
      return;
    }

    try {
      await api.post("/password-reset/change/", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setToastMessage("Password has been changed successfully.");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigate("/"); // Redirect to the homepage
      }, 3000);
    } catch (error) {
      console.error("An error occurred while changing the password:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorResponse = axiosError.response?.data;
      const errorMessage = errorResponse?.detail || "Failed to change password.";

      setErrors({
        ...errors,
        password: errorResponse?.old_password || [errorMessage],
      });
    }
  };

  return (
    <Container>
      <BackButton backPath="/" />
      <Row className="justify-content-center">
        {profiles.map((profile) => (
          <Col md={6} lg={4} key={profile.id} className="mb-3">
            <Card>
              <Card.Header className="text-center">
                <Image
                  src={previewUrls.get(profile.id) || profile.image}
                  roundedCircle
                  fluid
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Edit</Tooltip>}
                >
                  <label className="btn btn-secondary">
                    <PencilSquare />{" "}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileChange(profile.id, e)}
                    />
                  </label>
                </OverlayTrigger>
                <p
                  className="mt-2 mb-0 text-muted"
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  {profile.user_email}
                </p>
              </Card.Header>
              <Card.Body>
                <h5 className="text-center" style={{ fontSize: "1rem", marginBottom: "1rem"}}>
                  Account Settings
                </h5>
                <Form onSubmit={(e) => handleSubmit(e, profile.id)}>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <PersonFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        value={formData.get(profile.id)?.firstName || ""}
                        onChange={(e) =>
                          handleInputChange(profile.id, "firstName", e.target.value)
                        }
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName && (
                          <Alert variant="warning" className="mt-2 w-100">
                            {errors.firstName}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <PersonLinesFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        value={formData.get(profile.id)?.lastName || ""}
                        onChange={(e) =>
                          handleInputChange(profile.id, "lastName", e.target.value)
                        }
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName && (
                          <Alert variant="warning" className="mt-2 w-100">
                            {errors.lastName}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <CalendarFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Personnummer"
                        value={formData.get(profile.id)?.personnummer || ""}
                        onChange={(e) =>
                          handleInputChange(profile.id, "personnummer", e.target.value)
                        }
                        isInvalid={!!errors.personnummer}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.personnummer && (
                          <Alert variant="warning" className="mt-2 w-100">
                            {errors.personnummer}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {errors.general && <Alert variant="warning">{errors.general}</Alert>}
                  <Button variant="success" type="submit" className="w-100" size="sm">
                    Update Profile
                  </Button>
                </Form>
                <hr />
                <div className="d-flex justify-content-center">
                  <Form onSubmit={handlePasswordSubmit} style={{ width: "100%" }}>
                    <h5 className="text-center" style={{ fontSize: "1rem", marginBottom: "1rem"}}>
                      Change Password
                    </h5>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <Lock />
                        </InputGroup.Text>
                        <Form.Control
                          type={passwordVisible.oldPassword ? "text" : "password"}
                          placeholder="Old password"
                          value={passwordData.oldPassword}
                          onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                          isInvalid={!!errors.oldPassword}
                        />
                        <InputGroup.Text
                          onClick={() => togglePasswordVisibility("oldPassword")}
                          style={{ cursor: "pointer" }}
                        >
                          {passwordVisible.oldPassword ? (
                            <EyeSlashFill size={20} />
                          ) : (
                            <EyeFill size={20} />
                          )}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.oldPassword && (
                            <Alert variant="warning" className="mt-2 w-100">
                              {errors.oldPassword}
                            </Alert>
                          )}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <LockFill />
                        </InputGroup.Text>
                        <Form.Control
                          type={passwordVisible.newPassword ? "text" : "password"}
                          placeholder="New password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          isInvalid={!!errors.newPassword}
                        />
                        <InputGroup.Text
                          onClick={() => togglePasswordVisibility("newPassword")}
                          style={{ cursor: "pointer" }}
                        >
                          {passwordVisible.newPassword ? (
                            <EyeSlashFill size={20} />
                          ) : (
                            <EyeFill size={20} />
                          )}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.newPassword && (
                            <Alert variant="warning" className="mt-2 w-100">
                              {errors.newPassword}
                            </Alert>
                          )}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <LockFill />
                        </InputGroup.Text>
                        <Form.Control
                          type={passwordVisible.confirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange("confirmPassword", e.target.value)
                          }
                          isInvalid={!!errors.confirmPassword}
                        />
                        <InputGroup.Text
                          onClick={() => togglePasswordVisibility("confirmPassword")}
                          style={{ cursor: "pointer" }}
                        >
                          {passwordVisible.confirmPassword ? (
                            <EyeSlashFill size={20} />
                          ) : (
                            <EyeFill size={20} />
                          )}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword && (
                            <Alert variant="warning" className="mt-2 w-100">
                              {errors.confirmPassword}
                            </Alert>
                          )}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    {errors.password && <Alert variant="warning">{errors.password}</Alert>}
                    <Button variant="primary" type="submit" className="w-100" size="sm">
                      Change Password
                    </Button>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant="dark"
      />
    </Container>
  );
};

export default ProfileComponent;
