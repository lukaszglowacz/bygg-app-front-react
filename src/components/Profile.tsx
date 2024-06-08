import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Form,
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
  Save2,
  Envelope,
  Trash,
} from "react-bootstrap-icons";
import api from "../api/api";
import { useProfileData } from "../hooks/useProfileData";
import { useUserProfile } from "../context/UserProfileContext";
import ToastNotification from "./ToastNotification";
import Loader from "./Loader";
import ConfirmModal from "./ConfirmModal";
import { AxiosError } from "axios";
import LoadingButton from "./LoadingButton";
import { useAuth } from "../context/AuthContext";

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
  const regex_password =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!regex_password.test(password)) {
    errors.push(
      "Password must include an uppercase letter, a number, and a special character"
    );
  }

  return errors;
};

const ProfileComponent: React.FC = () => {
  const profiles: ProfileData[] = useProfileData();
  const { loadProfile, setProfile } = useUserProfile();
  const { logout } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(
    new Map()
  );
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(
    new Map()
  );
  const [formData, setFormData] = useState<
    Map<number, { firstName: string; lastName: string; personnummer: string }>
  >(new Map());
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState<{
    [key: string]: boolean;
  }>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false);

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
    setLoading(false);
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

  const handlePasswordChange = (field: string, value: string) => {
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

  const handleSubmit = async (profileId: number) => {
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
          personnummer: [
            "Invalid personnummer format. Expected: YYMMDD-XXXX",
          ],
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
      setToastMessage("Profile updated");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
      setErrors({
        ...errors,
        general: ["Profile update failed"],
      });
    }
  };

  const handlePasswordSubmit = async (): Promise<void> => {
    const { newPassword, confirmPassword, oldPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setErrors({
        ...errors,
        password: ["Passwords do not match"],
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
      setToastMessage("Password changed successfully");
      setShowToast(true);

      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      console.error("An error occurred while changing the password:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorResponse = axiosError.response?.data;
      const errorMessage =
        errorResponse?.detail || "Password change failed";

      setErrors({
        ...errors,
        password: errorResponse?.old_password || [errorMessage],
      });
    }
  };

  const handleDeleteProfile = async (): Promise<void> => {
    try {
      await api.delete(`/accounts/user/delete/`); // Użyj endpointa z widoku Django do trwałego usunięcia użytkownika
      setToastMessage("Profile deleted");
      setShowToast(true);
      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      console.error("An error occurred while deleting the profile:", error);
      setErrors({
        ...errors,
        general: ["Profile deletion failed"],
      });
    }
  };

  const handleShowDeleteModal = async (): Promise<void> => {
    setShowDeleteModal(true);
  };

  const handleConfirmFirstDelete = async (): Promise<void> => {
    setShowDeleteModal(false);
    setShowFinalDeleteModal(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
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
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
                <div className="d-flex justify-content-around mt-3">
                  <div className="text-center">
                    <label
                      htmlFor={`file-input-${profile.id}`}
                      className="btn btn-outline-success btn-sm p-0"
                      title="Edit image"
                    >
                      <PencilSquare size={24} />
                    </label>
                    <input
                      type="file"
                      id={`file-input-${profile.id}`}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(profile.id, e)}
                    />
                    <div>Edit image</div>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => e.preventDefault()}>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <Envelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={profile.user_email}
                        readOnly
                        className="bg-light text-muted"
                      />
                    </InputGroup>
                  </Form.Group>
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
                          handleInputChange(
                            profile.id,
                            "firstName",
                            e.target.value
                          )
                        }
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName && (
                          <Alert variant="warning" className="mt-2 w-100 text-center">
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
                          handleInputChange(
                            profile.id,
                            "lastName",
                            e.target.value
                          )
                        }
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName && (
                          <Alert variant="warning" className="mt-2 w-100 text-center">
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
                          handleInputChange(
                            profile.id,
                            "personnummer",
                            e.target.value
                          )
                        }
                        isInvalid={!!errors.personnummer}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.personnummer && (
                          <Alert variant="warning" className="mt-2 w-100 text-center">
                            {errors.personnummer}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {errors.general && (
                    <Alert variant="warning" className="text-center">{errors.general}</Alert>
                  )}
                  <div className="d-flex justify-content-around mt-3">
                    <div className="text-center">
                      <LoadingButton
                        variant="success"
                        onClick={() => handleSubmit(profile.id)}
                        icon={Save2}
                        title="Save"
                        size={24}
                      />
                      <div>Save</div>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <Card.Body>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordSubmit();
                  }}
                >
                  <h5
                    className="text-center"
                    style={{ fontSize: "1rem", marginBottom: "1rem" }}
                  >
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
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
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
                          <Alert variant="warning" className="mt-2 w-100 text-center">
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
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
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
                          <Alert variant="warning" className="mt-2 w-100 text-center">
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
                        type={
                          passwordVisible.confirmPassword ? "text" : "password"
                        }
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        isInvalid={!!errors.confirmPassword}
                      />
                      <InputGroup.Text
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
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
                          <Alert variant="warning" className="mt-2 w-100 text-center">
                            {errors.confirmPassword}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {errors.password && (
                    <Alert variant="warning" className="text-center">{errors.password}</Alert>
                  )}
                  <div className="d-flex justify-content-around mt-3">
                    <div className="text-center">
                      <LoadingButton
                        variant="primary"
                        onClick={handlePasswordSubmit}
                        icon={Save2}
                        title="Change password"
                        size={24}
                      />
                      <div>Change password</div>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <Card.Body>
                <h5
                  className="text-danger text-center"
                  style={{ fontSize: "1rem", marginBottom: "1rem" }}
                >
                  Delete Account
                </h5>
                <p className="text-muted text-center">
                  Once you delete your account, there is no going back. Please
                  be certain
                </p>
                <div className="d-flex justify-content-around mt-3">
                  <div className="text-center">
                    <LoadingButton
                      variant="danger"
                      onClick={handleShowDeleteModal}
                      icon={Trash}
                      title="Delete Account"
                      size={24}
                    />
                    <div>Delete Account</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmFirstDelete}
      >
        <p>Confirm account deletion</p>
      </ConfirmModal>
      <ConfirmModal
        show={showFinalDeleteModal}
        onHide={() => setShowFinalDeleteModal(false)}
        onConfirm={handleDeleteProfile}
      >
        <p>This action will permanently delete all your data</p>
        <p className="text-danger">
          You will no longer have access to your account and all associated data will be lost
        </p>
      </ConfirmModal>
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
