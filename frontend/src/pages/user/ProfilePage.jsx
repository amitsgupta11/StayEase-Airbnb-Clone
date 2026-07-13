import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FiCamera } from "react-icons/fi";
import { userService } from "../../services/user.service.js";
import { updateUser } from "../../redux/slices/authSlice.js";
import { getInitials } from "../../utils/helpers.js";

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [tab, setTab] = useState("profile");
  const { register, handleSubmit } = useForm({ defaultValues: { name:user?.name, phone:user?.phone, bio:user?.bio } });
  const { register: registerPw, handleSubmit: handlePwSubmit, reset: resetPw } = useForm();

  const onSubmitProfile = async (data) => {
    try {
      const { data: res } = await userService.updateProfile(data);
      dispatch(updateUser(res.data.user));
      toast.success("Profile updated!");
    } catch (e) { toast.error(e.response?.data?.message || "Update failed"); }
  };

  const onChangePassword = async (data) => {
    try {
      await userService.changePassword(data);
      toast.success("Password changed!");
      resetPw();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to change password"); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const { data } = await userService.uploadAvatar(formData);
      dispatch(updateUser({ avatar: data.data.avatar }));
      toast.success("Avatar updated!");
    } catch (e) { toast.error("Failed to upload avatar"); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">Account Settings</h1>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
            {user?.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" alt=""/> : getInitials(user?.name)}
          </div>
          <button onClick={() => fileRef.current.click()} className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-card border border-gray-200 dark:border-gray-600">
            <FiCamera size={14} className="dark:text-white"/>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload}/>
        </div>
        <div>
          <p className="font-semibold dark:text-white">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className="badge bg-primary-light text-primary text-xs capitalize mt-1">{user?.role}</span>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button onClick={() => setTab("profile")} className={`pb-3 text-sm font-medium border-b-2 ${tab==="profile" ? "border-primary text-primary" : "border-transparent text-gray-400"}`}>Profile</button>
        <button onClick={() => setTab("password")} className={`pb-3 text-sm font-medium border-b-2 ${tab==="password" ? "border-primary text-primary" : "border-transparent text-gray-400"}`}>Password</button>
      </div>

      {tab === "profile" ? (
        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">Full name</label>
            <input className="input-field" {...register("name")}/>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">Phone</label>
            <input className="input-field" {...register("phone")}/>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">Bio</label>
            <textarea className="input-field" rows={3} maxLength={300} {...register("bio")}/>
          </div>
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      ) : (
        <form onSubmit={handlePwSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">Current password</label>
            <input type="password" className="input-field" {...registerPw("currentPassword", { required:true })}/>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">New password</label>
            <input type="password" className="input-field" {...registerPw("newPassword", { required:true, minLength:6 })}/>
          </div>
          <button type="submit" className="btn-primary">Change password</button>
        </form>
      )}
    </div>
  );
}
