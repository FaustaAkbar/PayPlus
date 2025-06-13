"use client"

import { useState, useRef, useEffect } from "react"
import { CheckCircle, Eye, EyeOff, Mail, Shield, User, X } from "lucide-react"
import SettingController from "../../controllers/setting_controller.js"

export default function Settings() {
  const formRef = useRef(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [profileImage, setProfileImage] = useState(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      const response = await SettingController.getProfile();
      if (response.success && response.data) {
        setFullName(response.data.name);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phone);
      } else {
        setErrorMessage(response.message);
        setIsError(true);
      }
    }

    fetchProfileData();
  }, [])


  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(URL.createObjectURL(file))
    }
  }


  const saveChanges = async () => {
 
    const validation = SettingController.validateForm(
      fullName, 
      email, 
      currentPassword, 
      newPassword, 
      confirmPassword
    );
    
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      setIsError(true);
      return;
    }

    setIsLoading(true);
    
    try {
     
      if (newPassword) {
        const passwordResponse = await SettingController.changePassword(currentPassword, newPassword);
        if (!passwordResponse.success) {
          setIsLoading(false);
          setErrorMessage(passwordResponse.message);
          setIsError(true);
          return;
        }
      }
      
      const profileResponse = await SettingController.updateProfile(fullName, email);
      
      setIsLoading(false);
      
      if (profileResponse.success) {
        setErrorMessage("Pengaturan berhasil diperbarui!");
        setIsError(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(profileResponse.message);
        setIsError(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsLoading(false);
      setErrorMessage("Terjadi kesalahan saat memperbarui profil");
      setIsError(true);
    }
  }

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="w-full max-w-3xl mx-auto">
        <form ref={formRef} className="flex flex-col">
          {/* Header for profile */}
          <div className="w-full px-4 pt-12 pb-6 bg-[#6366F1] rounded-b-3xl flex flex-col items-center">
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={profileImage || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                  alt="Profile"
                  className="w-24 h-24 object-cover"
                />
              </div>
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
              >
                <span className="text-[#6366F1] text-xl">+</span>
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </div>
            <p className="mt-3 text-white font-semibold">{phoneNumber}</p>
          </div>

          {/* Account Settings */}
          <div className="px-5 py-6">
            <h1 className="text-2xl font-bold text-[#1F2937]">Account Settings</h1>

            {/* Personal Information */}
            <div className="mt-5 p-5 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="p-2.5 bg-[#6366F1]/10 rounded-xl">
                  <User className="w-5.5 h-5.5 text-[#6366F1]" />
                </div>
                <span className="ml-3 text-lg font-semibold text-[#111827]">Personal Information</span>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-[#4B5563]">Full Name</label>
                <div className="mt-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 pr-3 py-3 w-full bg-[#F9FAFB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-[#4B5563]">Email</label>
                <div className="mt-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-3 py-3 w-full bg-[#F9FAFB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="mt-5 p-5 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="p-2.5 bg-[#10B981]/10 rounded-xl">
                  <Shield className="w-5.5 h-5.5 text-[#10B981]" />
                </div>
                <span className="ml-3 text-lg font-semibold text-[#111827]">Security</span>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-[#4B5563]">Current Password</label>
                <div className="mt-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <input
                      type={isCurrentPasswordVisible ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 pr-10 py-3 w-full bg-[#F9FAFB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
                    >
                      {isCurrentPasswordVisible ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-[#4B5563]">New Password</label>
                <div className="mt-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <input
                      type={isNewPasswordVisible ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 py-3 w-full bg-[#F9FAFB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                    >
                      {isNewPasswordVisible ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-[#4B5563]">Confirm New Password</label>
                <div className="mt-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 py-3 w-full bg-[#F9FAFB] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error/Success Message */}
            {errorMessage && (
              <div className={`mt-5 p-3 rounded-xl flex items-start ${isError ? "bg-[#FEE2E2]" : "bg-[#D1FAE5]"}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {isError ? (
                    <X className="h-5 w-5 text-[#DC2626]" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-[#10B981]" />
                  )}
                </div>
                <p className={`ml-2 text-sm ${isError ? "text-[#DC2626]" : "text-[#10B981]"}`}>{errorMessage}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-white text-[#6B7280] border border-[#D1D5DB] rounded-xl font-medium disabled:opacity-70"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={saveChanges}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-[#6366F1] text-white rounded-xl font-medium disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
